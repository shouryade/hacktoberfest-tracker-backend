require("dotenv").config();
import { Octokit } from "octokit";
import * as express from "express";
import setHeaders from "../middleware";
import { orgData } from "./types";
import {
  GraphqlResponseError,
  GraphQlQueryResponseData,
} from "@octokit/graphql";

let octo = new Octokit({
  auth: process.env.TOKEN,
});
const router = express.Router();
const app = express();

app.use(setHeaders);

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
      console.log(error);
      return "Server error";
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
    let contri = await octo.request("GET /repos/{owner}/{repo}/contributors", {
      owner: organisation,
      repo: node.name,
    });
    let contributors = contri.data.map(
      ({ name,login, html_url, avatar_url, contributions }) => ({
        name,
        login,
        html_url,
        avatar_url,
        contributions,
      })
    );
    let repository = {
      name: node.name,
      contributors: contributors,
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

router.get("/:username", async (req, res) => {
  let username = req.params.username;

  if (username === "undefined") {
    console.log("Undefined Request");
    res.send({ response: "False request" });
  } else {
    let dashData: string | orgData = await getDashData(username);
    res.json(dashData);
  }
});

export { router as getOrgData };
