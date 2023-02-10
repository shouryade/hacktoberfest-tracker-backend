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
exports.updateOrg = void 0;
var express = require("express");
var connection_1 = require("../connection");
var org_1 = require("../entities/org");
var repo_1 = require("../entities/repo");
var contribution_1 = require("../entities/contribution");
var http = require("http");
var issues_1 = require("../entities/issues");
var router = express.Router();
exports.updateOrg = router;
var repoRepo = connection_1.AppDataSource.getRepository(repo_1.Repo);
var contRepo = connection_1.AppDataSource.getRepository(contribution_1.Contribution);
var issueRepo = connection_1.AppDataSource.getRepository(issues_1.Issues);
var udpateRepo = function (oldRepo, newRepo) { return __awaiter(void 0, void 0, void 0, function () {
    var repoData, repoIssues;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, repoRepo.createQueryBuilder('repo')
                    .select('repo.id')
                    .where('repo.id = :id', { id: oldRepo.id })
                    .leftJoinAndSelect('repo.contributions', 'contributions')
                    .getOne()];
            case 1:
                repoData = _a.sent();
                return [4 /*yield*/, repoRepo.createQueryBuilder('repo')
                        .select('repo.id')
                        .where('repo.id = :id', { id: oldRepo.id })
                        .leftJoinAndSelect('repo.issues', 'issues')
                        .getOne()];
            case 2:
                repoIssues = _a.sent();
                newRepo.issueList.forEach(function (issue) { return __awaiter(void 0, void 0, void 0, function () {
                    var result1, newIssue;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                result1 = repoIssues.issues.find(function (ele) {
                                    return ele.issuesNo = issue.number;
                                });
                                if (!result1) return [3 /*break*/, 2];
                                result1.desc = issue.body;
                                result1.title = issue.title;
                                result1.user = issue.author.login;
                                result1.url = issue.url;
                                return [4 /*yield*/, issueRepo.save(result1)];
                            case 1:
                                _a.sent();
                                return [3 /*break*/, 4];
                            case 2:
                                newIssue = issueRepo.create({
                                    issuesNo: issue.number,
                                    title: issue.title,
                                    user: issue.author.login,
                                    desc: issue.body,
                                    url: issue.url,
                                    repo: oldRepo
                                });
                                return [4 /*yield*/, issueRepo.save(newIssue)];
                            case 3:
                                _a.sent();
                                _a.label = 4;
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                newRepo.contributors.forEach(function (cont) { return __awaiter(void 0, void 0, void 0, function () {
                    var result1, newContribution;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                result1 = repoData.contributions.find(function (ele) {
                                    return ele.githubId = cont.login;
                                });
                                if (!result1) return [3 /*break*/, 2];
                                //update old contribution
                                result1.contributions = cont.contributions;
                                result1.picLink = cont.avatar_url;
                                result1.profile_link = cont.html_url;
                                return [4 /*yield*/, contRepo.save(result1)];
                            case 1:
                                _a.sent();
                                return [3 /*break*/, 4];
                            case 2:
                                newContribution = contRepo.create({
                                    contributions: cont.contributions,
                                    picLink: cont.avatar_url,
                                    githubId: cont.login,
                                    profile_link: cont.html_url,
                                    repo: oldRepo
                                });
                                return [4 /*yield*/, contRepo.save(newContribution)];
                            case 3:
                                _a.sent();
                                _a.label = 4;
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                //update it's values
                oldRepo.totalCommits = newRepo.totalCommits,
                    oldRepo.desc = newRepo.description,
                    oldRepo.name = newRepo.name,
                    oldRepo.topics = newRepo.topics,
                    oldRepo.totalIssues = newRepo.openIssues,
                    oldRepo.totalPrOpen = newRepo.prOpen,
                    oldRepo.url = newRepo.url;
                return [4 /*yield*/, repoRepo.save(oldRepo)];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var mainUpdate = function (data, orgR) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        data.repos.forEach(function (repo) { return __awaiter(void 0, void 0, void 0, function () {
            var result, newRepo_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = orgR.repos.find(function (element) {
                            return element.name = repo.name;
                        });
                        if (!result) return [3 /*break*/, 1];
                        udpateRepo(result, repo);
                        return [3 /*break*/, 3];
                    case 1:
                        newRepo_1 = repoRepo.create({
                            uName: "Test",
                            name: repo.name,
                            topics: repo.topics,
                            totalCommits: repo.totalCommits,
                            totalIssues: repo.openIssues,
                            totalPrOpen: repo.prOpen,
                            url: repo.url,
                            desc: repo.description,
                            org: orgR
                        });
                        return [4 /*yield*/, repoRepo.save(newRepo_1)];
                    case 2:
                        _a.sent();
                        //add contributors and issues
                        repo.contributors.map(function (contributor) { return __awaiter(void 0, void 0, void 0, function () {
                            var newContributor;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        newContributor = contRepo.create({
                                            contributions: contributor.contributions,
                                            picLink: contributor.avatar_url,
                                            githubId: contributor.login,
                                            profile_link: contributor.html_url,
                                            repo: newRepo_1
                                        });
                                        return [4 /*yield*/, contRepo.save(newContributor)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        repo.issueList.map(function (issue) { return __awaiter(void 0, void 0, void 0, function () {
                            var newIssue;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        newIssue = issueRepo.create({
                                            issuesNo: issue.number,
                                            title: issue.title,
                                            user: issue.author.login,
                                            desc: issue.body,
                                            url: issue.url,
                                            repo: newRepo_1
                                        });
                                        return [4 /*yield*/, issueRepo.save(newIssue)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
var updateOrg = function () { return __awaiter(void 0, void 0, void 0, function () {
    var orgRepo, orgData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                orgRepo = connection_1.AppDataSource.getRepository(org_1.Org);
                return [4 /*yield*/, orgRepo.createQueryBuilder('org')
                        .leftJoinAndSelect('org.repos', 'repos')
                        .take(10)
                        .getMany()
                    //for each org this will fetch data from github and update it
                ];
            case 1:
                orgData = _a.sent();
                //for each org this will fetch data from github and update it
                orgData.forEach(function (orgR) {
                    var data;
                    console.log(orgR.uName);
                    http.get({
                        hostname: "localhost",
                        port: 3060,
                        path: '/' + orgR.uName
                    }, function (response) {
                        response.on('data', function (chunk) {
                            data = JSON.parse(chunk);
                            console.log(data);
                        });
                        response.on('end', function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        console.log('calling function');
                                        return [4 /*yield*/, mainUpdate(data, orgR)];
                                    case 1:
                                        _a.sent();
                                        console.log("Request ended");
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    })
                        .on('error', function (err) {
                        console.log("Error fetching data" + err);
                    })
                        .end();
                });
                return [2 /*return*/, orgData];
        }
    });
}); };
router.get('/update/org', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, updateOrg()];
            case 1:
                _a.sent();
                res.send({ message: 'OK' });
                return [2 /*return*/];
        }
    });
}); });
