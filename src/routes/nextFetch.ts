import express from 'express';
import {AppDataSource} from '../connection'
import { Org } from '../entities/org';
import { Repo } from '../entities/repo';


const router = express.Router();


router.get('/verifyDB/:orgName',async (req,res) => {
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

    if(data){
        res.status(200).json({verifiedDB:true})
    }else{
        res.status(400).json({verifiedDB:false})
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