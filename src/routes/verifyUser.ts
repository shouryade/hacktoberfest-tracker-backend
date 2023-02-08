import * as express from "express"
import { Octokit } from "octokit";
import * as http from 'http'

const router = express.Router();
const octo = new Octokit();
router.post("/verify/:username", async (req, res) => {
    let username = req.params.username;
    let verify;
    try {
      verify = await octo.request("GET /orgs/{owner}", {
        owner: username,
      });
    } catch (err) {
      verify = "Not Found";
    }
  
    if (verify != "Not Found") {
      console.log("Request Made");
      
      http.get('http://localhost:3060/verifyDB'+username,(response) => {
        
      if(response.statusCode == 400){ 
            res.send({
              verified: false,
              message:"Add to DB"
            });
          }else{
            res.send({
              verified: true,
              message:"Fetch from DB"
            });
          }
        })
      
    } else {

      res.send({
        verified: false,
        message:"Not found on both Github and DB"
      });
    }
});

export {router as verifyUser}