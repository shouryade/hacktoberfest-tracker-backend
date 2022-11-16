import { Octokit } from "octokit";
import * as express from "express";

const app = express();
const octo = new Octokit();

type repo = {
    "name":string,
    "totalCommits":any,
    "totalIssues":number,
    "members":any,
    "issues":any
}

async function getNames(username:string){
    let repos;
    let actualRepo:string[] = [];

    repos = await octo.request("GET /orgs/{owner}/repos",{
        owner:username
    });

    for(var i=0;i<repos.data.length;i++){

        if(repos.data[i].topics.includes("hacktoberfest2022") || repos.data[i].topics.includes("hacktoberfest")){
            actualRepo.push(repos.data[i].name);
        }
    }
    console.log(actualRepo);

    return actualRepo;
}

app.get("/:org/:repo",async (req,res) => {

    const org = req.params.org;
    const name = req.params.repo;

    let send:{
        orgName:string,
        data:repo
    }

    let issueList = await octo.request("GET /repos/{owner}/{repo}/issues",{
        owner:org,
        repo:name
    });

    let members = await octo.request("GET /repos/{owner}/{repo}/contributors",{
        owner:org,
        repo:name
    });

    let commits = await octo.request("GET /repos/{owner}/{repo}/commits",{
        owner:org,
        repo:name
    });

    send = {
        orgName:org,
        data:{
            name:name,
            issues:issueList.data,
            members:members.data,
            totalCommits:commits.data,
            totalIssues:issueList.data.length
        }  
    }

    res.send(send)
});

app.get("/:username",async (req,res) => {
   
    let username = req.params.username;
    let names:string[] = await getNames(username);

    res.send({
        org:username,
        name:names
    });
});

app.post("/verify/:username",async (req,res) => {
    let username = req.params.username;
    let verify = await octo.request("GET /orgs/{owner}",{
        owner:username
    });

    if(verify.data!=null){
        console.log("Request Made");
        
        res.send({
            "verified":true
        })
    }
        
    else{
        res.send({
            "verified":false
        })
    };
})

app.listen(3060,() => {
    console.log("Running on 3000");
    
})

