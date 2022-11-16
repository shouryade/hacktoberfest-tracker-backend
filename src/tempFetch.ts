import { Octokit } from "octokit";
import * as express from "express";

const app = express();
const octo = new Octokit();


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

    // repoNames.forEach(async (repo) => {
    //     let topics = await octo.request("GET /repos/{owner}/{repo}/topics",{
    //         owner:"developer-student-club-thapar",
    //         repo:repo
    //     });

    //     console.log(topics);

    //     if(topics.data.names.includes("hacktoberfest2022") || topics.data.names.includes("hacktoberfest")){
    //         actualRepo.push(repo);
    //     }
    // });

    console.log(actualRepo);

    return actualRepo;
}

type repo = {
    "name":string,
    "totalCommits":any,
    "totalIssues":number,
    "members":any,
    "issues":any
}

async function getRepoData(names:string[],username:string){
    

    let send:{
        orgName:string,
        data:repo[]
    } = {orgName:"",data:[]};
    
    for(var i=0;i<names.length;i++){
        let repoData:repo;
        
        let issueList = await octo.request("GET /repos/{owner}/{repo}/issues",{
            owner:username,
            repo:names[i]
        });

        let members = await octo.request("GET /repos/{owner}/{repo}/contributors",{
            owner:username,
            repo:names[i]
        });

        let commits = await octo.request("GET /repos/{owner}/{repo}/commits",{
            owner:username,
            repo:names[i]
        });

        repoData = {
            name:names[i],
            issues:issueList.data,
            members:members.data,
            totalCommits:commits.data,
            totalIssues:issueList.data.length
        }

        // console.log(repoData);
        
        send.data.push(repoData)
    }

    console.log(send);
    
    let orgName = await octo.request("GET /orgs/{owner}",{
        owner:username
    });

    send.orgName = orgName.data.name

    return send;
    
}

app.get("/:username",async (req,res) => {
    let username = req.params.username;
    let names:string[] = await getNames(username);
    let data:{
        orgName:string,
        data:repo[]
    } = await getRepoData(names,username);

    res.send(data);
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


