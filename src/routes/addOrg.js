"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.addOrg = void 0;
var express = require("express");
var connection_1 = require("../connection");
var org_1 = require("../entities/org");
var http = require("http");
var middleware_1 = require("../middleware");
var repo_1 = require("../entities/repo");
var contribution_1 = require("../entities/contribution");
var issues_1 = require("../entities/issues");
var router = express.Router();
exports.addOrg = router;
express().use(middleware_1["default"]);
var addOrgToDb = function (data, orgName) { return __awaiter(void 0, void 0, void 0, function () {
    var totalIssues, totalCommits, totalPrOpen, totalRepos, name, url, avatar_url, uName, desc, newOrg, org;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                totalIssues = 0;
                totalCommits = 0;
                totalPrOpen = 0;
                totalRepos = data.hfestRepos;
                name = data.name;
                url = data.url;
                avatar_url = data.avatarUrl;
                uName = orgName;
                desc = data.description;
                data.repos.forEach(function (repo) {
                    totalCommits += repo.totalCommits;
                    totalIssues += repo.openIssues;
                    totalPrOpen += repo.prOpen;
                });
                org = connection_1.AppDataSource.getRepository(org_1.Org);
                newOrg = org.create({
                    name: name,
                    uName: uName,
                    url: url,
                    desc: desc,
                    avatar_url: avatar_url,
                    totalPrOpen: totalPrOpen,
                    totalCommits: totalCommits,
                    totalIssues: totalIssues,
                    totalRepos: totalRepos
                });
                return [4 /*yield*/, org.save(newOrg)];
            case 1:
                _a.sent();
                return [2 /*return*/, newOrg];
        }
    });
}); };
var addRepos = function (data, orgId) { return __awaiter(void 0, void 0, void 0, function () {
    var orgRepo, repoRepo, org;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                orgRepo = connection_1.AppDataSource.getRepository(org_1.Org);
                repoRepo = connection_1.AppDataSource.getRepository(repo_1.Repo);
                return [4 /*yield*/, orgRepo.findOne({
                        where: {
                            id: orgId
                        }
                    })];
            case 1:
                org = _a.sent();
                data.forEach(function (repo) { return __awaiter(void 0, void 0, void 0, function () {
                    var newRepo;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (repo.desc == null) {
                                    repo.desc = "";
                                }
                                newRepo = repoRepo.create({
                                    name: repo.name,
                                    uName: "test",
                                    url: repo.url,
                                    desc: repo.description == null ? "" : repo.description,
                                    totalPrOpen: repo.prOpen,
                                    totalCommits: repo.totalCommits,
                                    totalIssues: repo.openIssues,
                                    topics: repo.topics,
                                    org: org
                                });
                                return [4 /*yield*/, repoRepo.save(newRepo)["catch"](function (err) {
                                        console.log("Error:" + err);
                                    })];
                            case 1:
                                _a.sent();
                                addContributor(newRepo, repo.contributors);
                                addIssue(newRepo, repo.issueList);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/, "Repos added successfully"];
        }
    });
}); };
var addContributor = function (repo, repoContributors) { return __awaiter(void 0, void 0, void 0, function () {
    var client;
    return __generator(this, function (_a) {
        client = connection_1.AppDataSource.getRepository(contribution_1.Contribution);
        repoContributors.forEach(function (contributor) { return __awaiter(void 0, void 0, void 0, function () {
            var newContributor;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newContributor = client.create({
                            githubId: contributor.login,
                            contributions: contributor.contributions,
                            picLink: contributor.avatar_url,
                            profile_link: contributor.html_url,
                            repo: repo
                        });
                        return [4 /*yield*/, client.save(newContributor)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
var addIssue = function (repo, repoIssues) {
    var issueRepo = connection_1.AppDataSource.getRepository(issues_1.Issues);
    repoIssues.forEach(function (issue) { return __awaiter(void 0, void 0, void 0, function () {
        var newIssue;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    newIssue = issueRepo.create({
                        issuesNo: issue.number,
                        title: issue.title,
                        desc: issue.body,
                        user: issue.author.login,
                        url: issue.url,
                        repo: repo
                    });
                    return [4 /*yield*/, issueRepo.save(newIssue)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    return;
};
router.get("/addC/:username", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orgName, data;
    return __generator(this, function (_a) {
        orgName = req.params.username;
        data = {
            name: "",
            avatarUrl: "",
            description: "",
            url: "",
            hfestRepos: 0,
            repos: []
        };
        http.get("http://localhost:3060/" + orgName, function (result) {
            result.on('data', function (chunk) {
                data = JSON.parse(chunk);
            });
            result.on('end', function () { return __awaiter(void 0, void 0, void 0, function () {
                var org;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, addOrgToDb(data, orgName)];
                        case 1:
                            org = _a.sent();
                            addRepos(data.repos, org.id);
                            return [2 /*return*/];
                    }
                });
            }); });
        })
            .on('error', function (error) {
            res.send("Error fetching data" + error);
        })
            .end();
        res.send("Data inserted successfully");
        return [2 /*return*/];
    });
}); });
