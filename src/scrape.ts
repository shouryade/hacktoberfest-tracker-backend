import { Octokit, App } from "octokit";
import { AppDataSource } from "./connenction";
import { Org } from "./entities/org";

const octo = new Octokit({});

async function update(){

    const orgRepository = AppDataSource.getRepository(Org);

    const [listOrgs,length] = await orgRepository.findAndCount({select:['uName']})
    console.log({listOrgs,size:length})
    let count:number = length

    while(count--){
        const data = await octo.request("GET /users/{owner}/repos",{
            owner:listOrgs[count].uName
        });
        const newData = await orgRepository.findOneBy({
            uName:listOrgs[count].uName
        });
        console.log(data.data)
        // newData.contributionList = {list:['Arsh','Second']}
        // newData.contributorList = {list:['Arsh','Second']}
        // newData.issueList = {list:['Arsh','Second']}
        // newData.totalContributions = 40
        // newData.totalRepoList = {list:['Arsh','Second']}
        // newData.totalCommits = 20
        // newData.totalIssues = 10
        // newData.totalRepos = 30
        // orgRepository.save(newData)
    }
    
    setTimeout(update,5000)
}

AppDataSource.initialize()
.then(() =>
    {console.log("Running");
    update();
}
).catch((err) => {
    console.log(err)
});