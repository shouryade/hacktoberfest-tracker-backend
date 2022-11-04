import { DataSource } from "typeorm"
import { Org } from "./entities/org"
import { Repo } from "./entities/repo"
import "reflect-metadata"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "password",
    database: "Root",
    synchronize: false,
    entities: [Org, Repo]
});

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })



