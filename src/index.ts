import * as express from "express";
import setHeaders from "./middleware";
import { getOrgData } from "./routes/fetchOrgData";
import { addOrg } from "./routes/addOrg";
import {verifyUser} from "./routes/verifyUser"
import { updateOrg } from "./routes/updateOrg";
import {nextFetch} from "./routes/nextFetch"
const app = express();

app.use(nextFetch);
app.use(setHeaders);
app.use(getOrgData);
app.use(addOrg);
app.use(updateOrg);


app.listen(3060,() => {
    console.log("Server listening on 3060");
})


