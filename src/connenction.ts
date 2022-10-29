import { DataSource } from "typeorm"
import { Org } from "./entities/org"
import { Repo } from "./entities/repo"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 5432,
    username: "test",
    password: "test",
    database: "test",
    synchronize: true,
    logging: true,
    entities: [Org, Repo],
    subscribers: [],
    migrations: [],
});



