import * as express from 'express';
import {AppDataSource} from '../connection'
import { Org } from '../entities/org';
import { Repo } from '../entities/repo';
import { Octokit } from 'octokit';

const octo = new Octokit();

const router = express.Router();

router.get('/verifyDB/:orgName',async (req,res) => {
    const orgName = req.params.orgName;
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

router.get('/:orgName',async (req,res) => {

    const orgName = req.params.orgName;
    
    const orgRepo = AppDataSource.getRepository(Org);
    
    const data = await orgRepo.createQueryBuilder(
        'org'
    )
    .select('*')
    .where('org.uName = :uName',{uName:orgName})
    .leftJoinAndSelect(
        'org.repos.name',
        'repos'
    )
    .getOne()

    res.status(200).json(data);

})

router.get('/:orgName/:repo',async (req,res) => {
    const repoRepo = AppDataSource.getRepository(Repo)

    const orgName = req.params.orgName;
    const repoName = req.params.repo;

    const data = await repoRepo.createQueryBuilder(
        'repo'
    )
    .select('*')
    .where("repo.name = :repoName",{repoName:repoName})
    .getOne()

    res.json(data)
})

router.get('/:orgName',async (req,res) => {
    const orgName= req.params.orgName;


})

export {router as nextFetch}