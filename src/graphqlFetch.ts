require("dotenv").config();
import { Octokit } from "octokit";
import * as express from "express";
import setHeaders from "./middleware";
import {
  GraphqlResponseError,
  GraphQlQueryResponseData,
} from "@octokit/graphql";

const app = express();
const octo = new Octokit({
  auth: process.env.TOKEN,
});

app.use(setHeaders);

type contributor = {
  name: string;
  photo: string;
  contributions: number;
};

type repo = {
  totalCommits: number;
  totalIssues: number;
  totalContributors: number;
  members: {
    login: string;
    avatar_url: string;
    contributions: number;
    id: number;
    html_url: string;
  }[];
  issues: {
    number: number;
    title: string;
    user: string;
    body: string;
  }[];
};

async function getCounts(org: string, repoName: string) {
  let top: contributor = {
    name: " ",
    photo: " ",
    contributions: 0,
  };

  let members = await octo.request("GET /repos/{owner}/{repo}/contributors", {
    owner: org,
    repo: repoName,
  });

  top = {
    name: members.data[0].login,
    photo: members.data[0].avatar_url,
    contributions: members.data[0].contributions,
  };

  let issueList = await octo.request("GET /repos/{owner}/{repo}/issues", {
    owner: org,
    repo: repoName,
  });

  let commits = await octo.request("GET /repos/{owner}/{repo}/commits", {
    owner: org,
    repo: repoName,
  });

  return {
    commits: commits.data.length,
    members: members.data.length,
    issues: issueList.data.length,
    topContributor: top,
  };
}

async function getDashData(username: string) {
  let repos;
  let actualRepo: {
    commits: number;
    issues: number;
    contributors: number;
    repoCount: number;
    repos: {
      name: string;
      desc: string;
      topics: string[];
      link: string;
      topContributor: contributor;
    }[];
  } = {
    commits: 0,
    issues: 0,
    contributors: 0,
    repoCount: 0,
    repos: [],
  };

  repos = await octo.request("GET /orgs/{owner}/repos", {
    owner: username,
  });

  let commits: number = 0;
  let issues: number = 0;
  let contributors: number = 0;
  let repoCount: number = 0;

  for (var i = 0; i < repos.data.length; i++) {
    if (
      repos.data[i].topics.includes("hacktoberfest2022") ||
      repos.data[i].topics.includes("hacktoberfest")
    ) {
      repoCount += 1;
      let counts = await getCounts(username, repos.data[i].name);

      issues += counts.issues;
      contributors += counts.members;
      commits += counts.commits;

      actualRepo.repos.push({
        name: repos.data[i].name,
        desc: repos.data[i].description,
        topics: repos.data[i].topics,
        link: repos.data[i].html_url,
        topContributor: counts.topContributor,
      });
    }
  }

  actualRepo = {
    ...actualRepo,
    commits: commits,
    contributors: contributors,
    repoCount: repoCount,
    issues: issues,
  };

  return actualRepo;
}

async function getRepoData1(org: string, name: string) {
  let send: repo = {
    totalCommits: 0,
    issues: [],
    members: [],
    totalContributors: 0,
    totalIssues: 0,
  };

  let issueList = await octo.request("GET /repos/{owner}/{repo}/issues", {
    owner: org,
    repo: name,
  });

  for (var i = 0; i < issueList.data.length; i++) {
    let issue = {
      number: issueList.data[i].number,
      title: issueList.data[i].title,
      user: issueList.data[i].user.login,
      body: issueList.data[i].body,
    };

    send.issues.push(issue);
  }

  let members = await octo.request("GET /repos/{owner}/{repo}/contributors", {
    owner: org,
    repo: name,
  });

  for (var i = 0; i < members.data.length; i++) {
    let actualName = await octo.request(members.data[i].url);

    let member = {
      name: actualName.data.name,
      photo: members.data[i].avatar_url,
      login: members.data[i].login,
      contributions: members.data[i].contributions,
    };

    // send.members.push(member);
  }

  let commits = await octo.request("GET /repos/{owner}/{repo}/commits", {
    owner: org,
    repo: name,
  });

  send = {
    ...send,
    totalCommits: commits.data.length,
    totalIssues: issueList.data.length,
    totalContributors: members.data.length,
  };

  //   console.log(send);

  return send;
}

async function getRepoData(org: string, name: string) {
  let send: repo = {
    totalCommits: 0,
    issues: [],
    members: [],
    totalContributors: 0,
    totalIssues: 0,
  };

  let members = await octo.request("GET /repos/{owner}/{repo}/contributors", {
    owner: org,
    repo: name,
  });
  let data: GraphQlQueryResponseData;
  try {
    data = await octo.graphql(
      `query getRepoData($organisation: String!, $name: String!) {
        repository(owner: $organisation, name: $name) {
          ... on Repository {
            defaultBranchRef {
              name
              target {
                ... on Commit {
                  history {
                    totalCount
                  }
                }
              }
            }
          }
          issues(
            last: 100
            filterBy: {labels: ["Hacktoberfest-Accepted"], states: [OPEN]}
          ) {
            totalCount
            nodes {
              number
              title
              url
              author {
                login
              }
            }
          }
        }
      }
      `,
      {
        organisation: org,
        name: name,
      }
    );
  } catch (error) {
    if (error instanceof GraphqlResponseError) {
      return error.message;
    } else {
      return "Server Error!";
    }
  }

  send.members = members.data.map(
    ({ login, avatar_url, id, contributions, html_url }) => ({
      login,
      avatar_url,
      id,
      contributions,
      html_url,
    })
  );

  send.issues = data.repository.issues.nodes.map(
    ({ url, number, title, author }) => ({
      number,
      title,
      url,
      author,
    })
  );

  send = {
    ...send,
    totalCommits: data.repository.defaultBranchRef.target.history.totalCommits,
    totalContributors: members.data.length,
    totalIssues: data.repository.issues.totalCount,
  };

  return send;
}

app.get("/:org/:repo", async (req, res) => {
  let organisation = req.params.org;
  let name = req.params.repo;
  let reponse: string | repo = await getRepoData(organisation, name);

  res.json(reponse);
});

app.post("/verify/:username", async (req, res) => {
  let username = req.params.username;
  let verify;
  try {
    verify = await octo.request("GET /orgs/{owner}", {
      owner: username,
    });
  } catch (err) {
    verify = "Not Found";
  }

  if (verify != "Not Found") {
    console.log("Request Made");

    res.send({
      verified: true,
    });
  } else {
    res.send({
      verified: false,
    });
  }
});

app.listen(3060, () => {
  console.log("Running on 3060");
});
