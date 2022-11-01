import * as express from 'express';
import { AppDataSource } from './connenction';
import { Org } from './entities/org';

import setHeaders from './middleware';
const app: express.Express = express();

app.use(express.json());
app.use(setHeaders)

app.get("/userData/:id",async(req:express.Request,res:express.Response)=>{
    const id:string = req.params.id;
    try{ 
       
    //    const data = await 
    //    res.send(data); in progress
    } 
    catch(err){
        console.log(err);
    }
})

app.get("/signUp/:link",async (req:express.Request,res:express.Response) => {
    const orgLink:string = req.params.link;

    const orgData = AppDataSource.getRepository(Org); 

    const newOrg = new Org();
    newOrg.uName = orgLink;
    await orgData.save(newOrg);

    const newId = await orgData.findOneBy({uName:orgLink});
    res.send({
        "newId":newId,
        "message":"New user generated. Kindly keep the id safe for next login"
    });

});

app.get("/user/:link/:id",async (req:express.Request,res:express.Response) => {
    const orgLink:string = req.params.link;
    const orgId:number = parseInt(req.params.id);
    const orgData = AppDataSource.getRepository(Org);

    try{
        const check = await orgData.findOneBy({id:orgId});
        if(check == null){
            res.send({
                "data":null,
                "error":"Can't find the Organisation in our Database"
            });
        }
        else{
            if(check.uName === orgLink){
                const data:object = await orgData.find({
                    relations:{
                        repos:true
                    }
                });
                res.send(data);
            }
            else{
                check.uName = orgLink;
                await orgData.save(check);
            }
        }
    }
    catch(err){
        console.log("Error talking to database");
    }
});

const port = process.env.PORT || 3000

app.listen(port,() => {
    console.log(`Running on port ${port}`)
});




