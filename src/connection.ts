require("dotenv").config();
import { DataSource } from "typeorm"
import { Org } from "./entities/org"
import { Repo } from "./entities/repo"
import "reflect-metadata"
import { Contribution } from "./entities/contribution";
import { Issues } from "./entities/issues";

// export const AppDataSource = new DataSource({
//     type: "mysql",
//     host: "34.131.181.255",
//     port: 3306,
//     username: "root",
//     password: "hello1234",
//     database: "hacktoberfest69",
//     synchronize: false,
//     entities: [Org, Repo,Contribution,Issues]
// });

export const AppDataSource = new DataSource({
    type:'mysql',
    host:process.env.SQL_HOST,
    username: process.env.SQL_USER,
    password: process.env.SQL_PASS,
    database: process.env.SQL_DB_NAME,
    synchronize: false,
    logging:false,
    entities: [Org, Repo,Contribution,Issues]
});

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })



