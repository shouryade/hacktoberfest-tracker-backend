import * as express from 'express'
import { AppDataSource } from '../connection';
import { Org } from '../entities/org';
import { Repo } from '../entities/repo';
import { Contribution } from '../entities/contribution';
import * as http from 'http'
import { contributors, issue, orgData } from './types';
import { Issues } from '../entities/issues';

const router = express.Router();

const updateOrg = async () => {
        const orgRepo = AppDataSource.getRepository(Org);
        const repoRepo = AppDataSource.getRepository(Repo);
        const contRepo = AppDataSource.getRepository(Contribution);
    
        const orgData = await orgRepo.createQueryBuilder(
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
            
            var data:orgData;

            http.request({
                hostname:'localhost',
                port:3060,
                path:'/'+orgR.uName,
            },(response) => {
                response.on('data',(chunk) => {
                    data = chunk;
                })

                response.on('end', () => {
                    console.log("Request ended");
                })

            })
            .on('error',(err) => {
                console.log("Error fetching data"+err);
            })
            .end();
    
            //udpate org data - to do

        data.repos.forEach(async (repo) => {
            
            var result = orgR.repos.find((element) => {
                return element.uName = repo.name
            })

            //udpate Repo data - to do
    
            if(result){
                
                //first update it's contributions

                const repoData = await repoRepo.createQueryBuilder(
                    'repo'
                )
                .select('repo.id')
                .where('repo.id = :id',{id:result.id})
                .leftJoinAndSelect(
                    'repo.contributions',
                    'contributions'
                )
                .getOne()

                const repoIssues = await repoRepo.createQueryBuilder(
                    'repo'
                )
                .select('repo.id')
                .where('repo.id = :id',{id:result.id})
                .leftJoinAndSelect(
                    'repo.issues',
                    'issues'
                )
                .getOne();

                repo.openIssues.forEach(async (issue:issue) => {
                    var result1 = repoIssues.issues.find((ele) => {
                        return ele.issuesNo = issue.number
                    });
                    const issueRepo = AppDataSource.getRepository(Issues);

                    if(result1){
                        result1.desc = issue.desc;
                        result1.title = issue.title;
                        result1.user = issue.user;

                        await issueRepo.save(result1);
                    }
                    else{
                        const newIssue = issueRepo.create({
                            issuesNo:issue.number,
                            title:issue.title,
                            user:issue.user,
                            desc:issue.desc
                        });
                        await issueRepo.save(newIssue);
                    }
                });
    
                repo.contributors.forEach(async (cont:contributors) => {

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
                            repo:repoData
                        });

                        await contRepo.save(newContribution);
                    }                    
                });

                //update it's values

                result.totalCommits = repo.totalCommits,
                result.desc = repo.description,
                result.name = repo.name,
                result.topics = repo.topics,
                result.totalIssues = repo.openIssues,
                result.totalPrOpen = repo.prOpen,
                result.url = repo.url

                await repoRepo.save(result);

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

                //add contributors for issues
            }
        })        
    })  
}

router.get('/update/org',async (req,res) => {
    await updateOrg();

});

export {router as updateOrg}