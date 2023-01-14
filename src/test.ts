import { AppDataSource } from "./connection";
import { Org } from "./entities/org";
import { Repo } from "./entities/repo";
import { createQueryBuilder, Repository } from "typeorm";
import * as express from 'express';
import { Contribution } from "./entities/contribution";
import { report } from "process";

const app = express();
app.use(express.json());


const reqRepo = {
    name:"Test",
    uName : "test",
    totalContributions:10,
    totalCommits:10,
    totalIssues:10,
    topics:["test","test1"],
    repoDesc:"Testing"
}

const reqOrg = {
    name:"Test",
    uName : "test",
    totalContributions:10,
    totalCommits:10,
    totalIssues:10,
    totalRepos:10,
}

const reqContributor = {
        githubId:"test",
        name:"test",
        contributions:3000,
        picLink:"testLink",
}

//adding organisation
const addOrg = async () => {
    const org = AppDataSource.getRepository(Org);
    const {
        name,
        uName,
        totalContributions,
        totalCommits,
        totalIssues,
        totalRepos,
    } = reqOrg

    const newOrg = org.create({
        name,
        uName,
        totalContributions,
        totalCommits,
        totalIssues,
        totalRepos
    })

    await org.save(newOrg);

    return newOrg
}

//adding repo for an organisation
const addDataOrgRepo = async (orgId) => {

    const orgRepo = AppDataSource.getRepository(Org);
    const repoRepo = AppDataSource.getRepository(Repo);

    const {
        name,
        uName,
        totalContributions,
        totalCommits,
        totalIssues,
        topics,
        repoDesc
    } = reqRepo;

    const org = await orgRepo.findOne({
        where:{
            id:parseInt(orgId)
        }
    });

    // if(!orgId){
    //     res.send({
    //         msg:"Org not found"
    //     })
    // }

    const repo = repoRepo.create({
        name,
        uName,
        totalContributions,
        totalCommits,
        totalIssues,
        topics,
        repoDesc,
        org
    });

    await repoRepo.save(repo);

    console.log(repo)
}

//connecting repo to contributions
const addContributor = async (repoId:number) => {
    
    const client = AppDataSource.getRepository(Contribution)
    const repoRepository = AppDataSource.getRepository(Repo)

    const {
        githubId,
        name,
        contributions,
        picLink
    } = reqContributor

    let repoNew = await repoRepository.findOne({
        where:{
            id:repoId
        }
    })

    if(!repoNew){
        console.log("Repository Not found");
    }

    const newContributor = client.create({
        githubId,
        name,
        contributions,
        picLink,
        repo:repoNew
    })

    await client.save(newContributor)

}

AppDataSource.initialize()
    .then(() => {
        console.log("Initialized");
        addContributor(1);
    })
    .catch((err) => {
        console.log(err)
    })

app.listen(3060,() => {
    console.log("Running on port 3060");
    
})


const updateAll = async () => {
    const org = AppDataSource.getRepository(Org);
    const repoRepo = AppDataSource.getRepository(Repo);
    const cont = AppDataSource.getRepository(Contribution);

    const orgData = await org.createQueryBuilder(
        'org'
    )
    .select('org.id')
    .leftJoinAndSelect(
        'org.repo',
        'repos'
    )
    .take(10)
    .getMany()

    orgData.forEach(orgR => {

        //data = https.request("https://locahost:3060/repo")

        data.forEach(async (repo) => {
            var result = orgR.repos.find((element) => {
                return element.uName = repo.uName
            })

            if(result){
                const repoData = await repoRepo.createQueryBuilder(
                    'repo'
                )
                .select('repo.id')
                .where('repo.id = :id',result.id)
                .leftJoinAndSelect(
                    'repo.contributions',
                    'contributions'
                )
                .getMany()

                repo.contributors.forEach((cont) => {
                    var result1 = repoData[0].contributions.find((ele) => {
                        return ele.githubId = cont.githubId;
                    })

                    if(result1) {
                        //update
                    }
                    else{
                        //create
                    }
                })
            }
            else{
                //create new repo
            }
        })
            
    })
        

}

