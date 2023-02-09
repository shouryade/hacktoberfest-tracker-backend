import * as express from 'express'
import { AppDataSource } from '../connection';
import { Org } from '../entities/org';
import { Repo } from '../entities/repo';
import { Contribution } from '../entities/contribution';
import * as http from 'http'
import { contributors, issue, orgData } from './types';
import { Issues } from '../entities/issues';

const router = express.Router();
const repoRepo = AppDataSource.getRepository(Repo);
const contRepo = AppDataSource.getRepository(Contribution);
const issueRepo = AppDataSource.getRepository(Issues);


const udpateRepo = async (oldRepo,newRepo) => {

    const repoData = await repoRepo.createQueryBuilder(
        'repo'
    )
    .select('repo.id')
    .where('repo.id = :id',{id:oldRepo.id})
    .leftJoinAndSelect(
        'repo.contributions',
        'contributions'
    )
    .getOne()

    const repoIssues = await repoRepo.createQueryBuilder(
        'repo'
    )
    .select('repo.id')
    .where('repo.id = :id',{id:oldRepo.id})
    .leftJoinAndSelect(
        'repo.issues',
        'issues'
    )
    .getOne();

    newRepo.issueList.forEach(async (issue:issue) => {
        var result1 = repoIssues.issues.find((ele) => {
            return ele.issuesNo = issue.number
        });

        if(result1){
            result1.desc = issue.body;
            result1.title = issue.title;
            result1.user = issue.author.login;
            result1.url = issue.url;

            await issueRepo.save(result1);
        }
        else{
            const newIssue = issueRepo.create({
                issuesNo:issue.number,
                title:issue.title,
                user:issue.author.login,
                desc:issue.body,
                url:issue.url,
                repo:oldRepo
            });
            await issueRepo.save(newIssue);
        }
    });

    newRepo.contributors.forEach(async (cont:contributors) => {

        var result1 = repoData.contributions.find((ele) => {
            return ele.githubId = cont.login;
        })

        if(result1) {
            //update old contribution
            result1.contributions = cont.contributions;
            result1.picLink = cont.avatar_url;
            result1.profile_link = cont.html_url

            await contRepo.save(result1);
        }
        else{
            //create new contribution
            const newContribution = contRepo.create({
                contributions:cont.contributions,
                picLink:cont.avatar_url,
                githubId:cont.login,
                profile_link:cont.html_url,
                repo:oldRepo
            });

            await contRepo.save(newContribution);
        }                    
    });

    //update it's values

    oldRepo.totalCommits = newRepo.totalCommits,
    oldRepo.desc = newRepo.description,
    oldRepo.name = newRepo.name,
    oldRepo.topics = newRepo.topics,
    oldRepo.totalIssues = newRepo.openIssues,
    oldRepo.totalPrOpen = newRepo.prOpen,
    oldRepo.url = newRepo.url

    await repoRepo.save(oldRepo);
}

const mainUpdate = async (data,orgR) => {

    data.repos.forEach(async (repo) => {
            
        var result = orgR.repos.find((element) => {
            return element.name = repo.name
        })

        //udpate Repo data - to do

        if(result){
            
            udpateRepo(result,repo);
            //first update it's contributions

        }
        else{
            //new repo
            const newRepo = repoRepo.create({
                uName:"Test",
                name:repo.name,
                topics:repo.topics,
                totalCommits:repo.totalCommits,
                totalIssues:repo.openIssues,
                totalPrOpen:repo.prOpen,
                url:repo.url,
                desc:repo.description,
                org:orgR
            });

            await repoRepo.save(newRepo);

            //add contributors and issues

            repo.contributors.map(async (contributor) => {
                let newContributor = contRepo.create({
                        contributions:contributor.contributions,
                        picLink:contributor.avatar_url,
                        githubId:contributor.login,
                        profile_link:contributor.html_url,
                        repo:newRepo
                })

                await contRepo.save(newContributor);
            })

            repo.issueList.map(async (issue) => {
                let newIssue = issueRepo.create({
                    issuesNo:issue.number,
                    title:issue.title,
                    user:issue.author.login,
                    desc:issue.body,
                    url:issue.url,
                    repo:newRepo
                })
                await issueRepo.save(newIssue);
            })
        }
    })
}
const updateOrg = async () => {
        const orgRepo = AppDataSource.getRepository(Org);

        //fetching data from DB to update
        const orgData = await orgRepo.createQueryBuilder(
            'org'
        )
        .leftJoinAndSelect(
            'org.repos',
            'repos'
        )
        .take(10)
        .getMany()
        
        //for each org this will fetch data from github and update it
        orgData.forEach(orgR => {
            
            var data:orgData;
            console.log(orgR.uName);
            
            http.get({
                hostname:"localhost",
                port:3060,
                path:'/'+orgR.uName,
            },(response) => {

                response.on('data',(chunk) => {
                    data = JSON.parse(chunk);
                    console.log(data);
                })

                response.on('end', async () => {
                    console.log('calling function');
                    await mainUpdate(data,orgR)
                    console.log("Request ended");
                })

            })
            .on('error',(err) => {
                console.log("Error fetching data"+err);
            })
            .end();

            
        })   
        return orgData;     
}  

router.get('/update/org',async (req,res) => {
    await updateOrg();
    res.send({message:'OK'})
});

export {router as updateOrg}