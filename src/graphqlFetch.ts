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

type orgData = {
  name: string;
  avatarUrl: string;
  description: string;
  url: string;
  hfestRepos: number;
  repos: {
    name: string;
    url: string;
    description: string;
    topics: string[];
    defBranch: string;
    totalCommits: number;
    openIssues: number;
    prOpen: number;
  }[];
};

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

async function getDashData(organisation: string) {
  let querystring = "org:" + organisation + " topic:hacktoberfest";
  let data: GraphQlQueryResponseData;
  try {
    data = await octo.graphql(
      `query getDashData($organisation: String!, $querystring: String!) {
  search(last: 100, type: REPOSITORY, query: $querystring) {
    repos: nodes {
      ... on Repository {
        name
        url
        description
        repositoryTopics(first: 100) {
          nodes {
            topic {
              name
            }
          }
        }
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
        openIssues: issues(states: OPEN) {
          totalCount
        }
        prOpen: pullRequests(states: OPEN) {
          totalCount
        }
      }
    }
  }
  organization(login: $organisation) {
    name
    avatarUrl
    description
    url
  }
}
      `,
      {
        organisation: organisation,
        querystring: querystring,
      }
    );
  } catch (error) {
    if (error instanceof GraphqlResponseError) {
      return error.message;
    } else {
      return "Server Error!";
    }
  }
  let response: orgData = {
    name: data.organization.name,
    avatarUrl: data.organization.avatarUrl,
    description: data.organization.description,
    url: data.organization.url,
    hfestRepos: data.search.repos.length,
    repos: [],
  };

  for (let node of data.search.repos) {
    let repository = {
      name: node.name,
      url: node.url,
      description: node.description,
      topics: node.repositoryTopics.nodes.map((nodes) => nodes.topic.name),
      defBranch: node.defaultBranchRef.name,
      totalCommits: node.defaultBranchRef.target.history.totalCount,
      openIssues: node.openIssues.totalCount,
      prOpen: node.prOpen.totalCount,
    };
    response.repos.push(repository);
  }

  return response;
}

app.get("/:username", async (req, res) => {
  let username = req.params.username;

  if (username === "undefined") {
    console.log("Undefined Request");
    res.send({ response: "False request" });
  } else {
    let dashData: string | orgData = await getDashData(username);
    res.json(dashData);
  }
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
