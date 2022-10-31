"use strict";
exports.__esModule = true;
exports.AppDataSource = void 0;
var typeorm_1 = require("typeorm");
var org_1 = require("./entities/org");
var repo_1 = require("./entities/repo");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "rootUser",
    database: "Root",
    synchronize: true,
    logging: true,
    entities: [org_1.Org, repo_1.Repo],
    subscribers: [],
    migrations: []
});
