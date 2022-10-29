import { DataSource } from "typeorm"
import { Org } from "./entities/org"
import { Repo } from "./entities/repo"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "rootUser",
    database: "Root",
    synchronize: true,
    logging: true,
    entities: [Org, Repo],
    subscribers: [],
    migrations: [],
});



