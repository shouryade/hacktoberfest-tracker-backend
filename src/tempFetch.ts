import { Octokit } from "octokit";
import * as express from "express";
import { count } from "console";

const app = express();
const octo = new Octokit();

type repo = {
    "name":string,
    "totalCommits":any,
    "totalIssues":number,
    "members":any,
    "issues":any
}

async function getCounts(org:string,repoName:string){

    let members = await octo.request("GET /repos/{owner}/{repo}/contributors",{
        owner:org,
        repo:repoName
    });

    let issueList = await octo.request("GET /repos/{owner}/{repo}/issues",{
        owner:org,
        repo:repoName
    });

    let commits = await octo.request("GET /repos/{owner}/{repo}/commits",{
        owner:org,
        repo:repoName
    });

    return {
        commits:commits.data.length,
        members:members.data.length,
        issues:issueList.data.length
    }

}

async function getNames(username:string){
    let repos;
    let actualRepo:{
        commits:number,
        issues:number,
        contributors:number,
        repoCount:number,
        repos:{
            name:string,
            desc:string,
            topics:string[],
            link:string}[]
    } = {
        commits:0,
        issues:0,
        contributors:0,
        repoCount:0,
        repos:[]
    };

    repos = await octo.request("GET /orgs/{owner}/repos",{
        owner:username
    });

    let commits:number = 0;
    let issues:number = 0;
    let contributors:number = 0;
    let repoCount:number = 0;

    for(var i=0;i<repos.data.length;i++){

        if(repos.data[i].topics.includes("hacktoberfest2022") || repos.data[i].topics.includes("hacktoberfest")){
            
            repoCount += 1;
            let counts = await getCounts(username,repos.data[i].name);

            issues += counts.issues;
            contributors += counts.members;
            commits += counts.commits;
            
            actualRepo.repos.push({
                name:repos.data[i].name,
                desc:repos.data[i].description,
                topics:repos.data[i].topics,
                link:repos.data[i].html_url
            });
        }
    }

    actualRepo = {
        ...actualRepo,
        commits:commits,
        contributors:contributors,
        repoCount:repoCount,
        issues:issues
    }

    console.log(actualRepo);

    return actualRepo;
}

app.get("/:org/:repo",async (req,res) => {

    const org = req.params.org;
    const name = req.params.repo;

    let send:{
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
        data:{
            name:name,
            issues:issueList.data,
            members:members.data,
            totalCommits:commits.data.length,
            totalIssues:issueList.data.length
        }  
    }

    res.send(send)
});

app.get("/:username",async (req,res) => {
   
    let username = req.params.username;
    let names:{
        commits:number,
        issues:number,
        contributors:number,
        repoCount:number,
        repos:{
            name:string,
            desc:string,
            topics:string[],
            link:string}[]
    } = await getNames(username);

    res.send({
        org:username,
        orgData:names
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

