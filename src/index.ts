import * as express from "express";
import setHeaders from "./middleware";
import { getOrgData } from "./routes/fetchOrgData";
import { addOrg } from "./routes/addOrg";
import {verifyUser} from "./routes/verifyUser"
import { updateOrg } from "./routes/updateOrg";
const app = express();

app.use(verifyUser)
app.use(setHeaders);
app.use(getOrgData);
app.use(addOrg);
app.use(updateOrg);


app.listen(3060,() => {
    console.log("Server listening on 3060");
})


