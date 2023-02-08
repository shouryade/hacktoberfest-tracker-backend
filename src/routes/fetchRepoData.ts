require("dotenv").config();
import { Octokit } from "octokit";
import * as express from "express";
import setHeaders from "../middleware";
// import {repo} from "./types";
import {
  GraphqlResponseError,
  GraphQlQueryResponseData,
} from "@octokit/graphql";

const app = express();
const router = express.Router();
const octo = new Octokit({
  auth: process.env.TOKEN,
});

app.use(setHeaders);

async function getRepoData(org: string, name: string) {
    let send = {
      totalCommits: 0,
      issues: [],
      members: [{}],
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
  
  router.get("/:org/:repo", async (req, res) => {
    let organisation = req.params.org;
    let name = req.params.repo;
    let reponse= await getRepoData(organisation, name);
  
    res.json(reponse);
  });

export {router as getRepoData}