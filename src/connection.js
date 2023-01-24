"use strict";
exports.__esModule = true;
exports.AppDataSource = void 0;
var typeorm_1 = require("typeorm");
var org_1 = require("./entities/org");
var repo_1 = require("./entities/repo");
require("reflect-metadata");
var contribution_1 = require("./entities/contribution");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "password",
    database: "Root",
    synchronize: false,
    entities: [org_1.Org, repo_1.Repo, contribution_1.Contribution]
});
exports.AppDataSource.initialize()
    .then(function () {
    console.log("Data Source has been initialized!");
})["catch"](function (err) {
    console.error("Error during Data Source initialization", err);
});
