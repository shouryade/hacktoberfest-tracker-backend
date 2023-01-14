import * as express from "express"
import { Octokit } from "octokit";

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
  
      res.send({
        verified: true,
      });
    } else {
      res.send({
        verified: false,
      });
    }
});

export {router as verifyUser}