"use strict";
exports.__esModule = true;
exports.AppDataSource = void 0;
require("dotenv").config();
var typeorm_1 = require("typeorm");
var org_1 = require("./entities/org");
var repo_1 = require("./entities/repo");
require("reflect-metadata");
var contribution_1 = require("./entities/contribution");
var issues_1 = require("./entities/issues");
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
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.SQL_HOST,
    username: process.env.SQL_USER,
    password: process.env.SQL_PASS,
    database: process.env.SQL_DB_NAME,
    synchronize: false,
    logging: false,
    entities: [org_1.Org, repo_1.Repo, contribution_1.Contribution, issues_1.Issues]
});
exports.AppDataSource.initialize()
    .then(function () {
    console.log("Data Source has been initialized!");
})["catch"](function (err) {
    console.log(process.env.SQL_HOST);
    console.error("Error during Data Source initialization", err);
});
