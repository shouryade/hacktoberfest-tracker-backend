import * as express from 'express';
import {AppDataSource} from '../connection'
import { Org } from '../entities/org';
import { Repo } from '../entities/repo';
import { Octokit } from 'octokit';

const octo = new Octokit();

const router = express.Router();

router.get('/verifyDB/:orgName',async (req,res) => {
    const orgName = req.params.orgName;
    // console.log(orgName);
    let onGithub;
    try {
        onGithub = await octo.request("GET /orgs/{owner}", {
          owner: orgName,
        });
      } catch (err) {
        onGithub = false;
      }
    
    const orgRepo = AppDataSource.getRepository(Org);
    
    const data = await orgRepo.createQueryBuilder(
        'org'
    )
    .select('org.id')
    .where('org.uName = :uName',{uName:orgName})
    .leftJoinAndSelect(
        'org.repos',
        'repos'
    )
    .getOne();

    if(data && onGithub){
        res.status(200).json({verifiedDB:true})
    }else{
        if(!onGithub)
        res.status(400).json({verifiedDB:false,message:"Not on Github"})
        else
        res.status(400).json({verifiedDB:false,message:"Not in DB"})
    }
})

router.get('/next/:orgName',async (req,res) => {

    const orgName = req.params.orgName;
    
    const orgRepo = AppDataSource.getRepository(Org);
    
    const data = await orgRepo.createQueryBuilder(
        'org'
    )
    .where('org.uName = :uName',{uName:orgName})
    .leftJoinAndSelect(
        'org.repos',
        'repos'
    )
    .getOne()

    res.status(200).json(data);

})

router.get('/next/:orgName/:repo',async (req,res) => {
    const repoRepo = AppDataSource.getRepository(Repo)

    const repoName = req.params.repo;

    const data = await repoRepo.createQueryBuilder(
        'repo'
    )
    .where("repo.name = :repoName",{repoName:repoName})
    .getOne()

    res.json(data)
})

router.get('/contributors/:orgName/:repo/',async (req,res) => {
    const repoRepo = AppDataSource.getRepository(Repo);

    const repoName = req.params.repo;

    const data = await repoRepo.createQueryBuilder(
        'repo'
    )
    .select('repo.id')
    .where('repo.name = :repo',{repo:repoName})
    .leftJoinAndSelect(
        'repo.contributions',
        'contributions'
    )
    .getOne();

    res.json(data);
})

router.get('/issues/:orgName/:repo/',async (req,res) => {
    const repoRepo = AppDataSource.getRepository(Repo);

    const repoName = req.params.repo;

    const data = await repoRepo.createQueryBuilder(
        'repo'
    )
    .select('repo.id')
    .where('repo.name = :repo',{repo:repoName})
    .leftJoinAndSelect(
        'repo.issues',
        'issues'
    )
    .getOne();

    res.json(data);
})

export {router as nextFetch}