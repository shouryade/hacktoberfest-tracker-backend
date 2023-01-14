import * as express from "express";
import setHeaders from "./middleware";
import { getOrgData } from "./routes/fetchOrgData";
import { addOrg } from "./routes/addOrg";
const app = express();


app.use(setHeaders);
app.use(getOrgData);
app.use(addOrg);


app.listen(3060,() => {
    console.log("Server listening on 3060");
})


