"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
require('dotenv').config();
var octokit_1 = require("octokit");
var express = require("express");
var middleware_1 = require("./middleware");
var app = express();
var octo = new octokit_1.Octokit({
    auth: process.env.TOKEN
});
app.use(middleware_1["default"]);
function getCounts(org, repoName) {
    return __awaiter(this, void 0, void 0, function () {
        var top, members, issueList, commits;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    top = {
                        name: ' ',
                        photo: ' ',
                        contributions: 0
                    };
                    return [4 /*yield*/, octo.request("GET /repos/{owner}/{repo}/contributors", {
                            owner: org,
                            repo: repoName
                        })];
                case 1:
                    members = _a.sent();
                    top = {
                        name: members.data[0].login,
                        photo: members.data[0].avatar_url,
                        contributions: members.data[0].contributions
                    };
                    return [4 /*yield*/, octo.request("GET /repos/{owner}/{repo}/issues", {
                            owner: org,
                            repo: repoName
                        })];
                case 2:
                    issueList = _a.sent();
                    return [4 /*yield*/, octo.request("GET /repos/{owner}/{repo}/commits", {
                            owner: org,
                            repo: repoName
                        })];
                case 3:
                    commits = _a.sent();
                    return [2 /*return*/, {
                            commits: commits.data.length,
                            members: members.data.length,
                            issues: issueList.data.length,
                            topContributor: top
                        }];
            }
        });
    });
}
function getNames(username) {
    return __awaiter(this, void 0, void 0, function () {
        var repos, actualRepo, commits, issues, contributors, repoCount, i, counts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    actualRepo = {
                        commits: 0,
                        issues: 0,
                        contributors: 0,
                        repoCount: 0,
                        repos: []
                    };
                    return [4 /*yield*/, octo.request("GET /orgs/{owner}/repos", {
                            owner: username
                        })];
                case 1:
                    repos = _a.sent();
                    commits = 0;
                    issues = 0;
                    contributors = 0;
                    repoCount = 0;
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < repos.data.length)) return [3 /*break*/, 5];
                    if (!(repos.data[i].topics.includes("hacktoberfest2022") || repos.data[i].topics.includes("hacktoberfest"))) return [3 /*break*/, 4];
                    repoCount += 1;
                    return [4 /*yield*/, getCounts(username, repos.data[i].name)];
                case 3:
                    counts = _a.sent();
                    issues += counts.issues;
                    contributors += counts.members;
                    commits += counts.commits;
                    actualRepo.repos.push({
                        name: repos.data[i].name,
                        desc: repos.data[i].description,
                        topics: repos.data[i].topics,
                        link: repos.data[i].html_url,
                        topContributor: counts.topContributor
                    });
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5:
                    actualRepo = __assign(__assign({}, actualRepo), { commits: commits, contributors: contributors, repoCount: repoCount, issues: issues });
                    return [2 /*return*/, actualRepo];
            }
        });
    });
}
app.get("/:org/:repo", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var org, name, send, issueList, members, commits;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                org = req.params.org;
                name = req.params.repo;
                return [4 /*yield*/, octo.request("GET /repos/{owner}/{repo}/issues", {
                        owner: org,
                        repo: name
                    })];
            case 1:
                issueList = _a.sent();
                return [4 /*yield*/, octo.request("GET /repos/{owner}/{repo}/contributors", {
                        owner: org,
                        repo: name
                    })];
            case 2:
                members = _a.sent();
                return [4 /*yield*/, octo.request("GET /repos/{owner}/{repo}/commits", {
                        owner: org,
                        repo: name
                    })];
            case 3:
                commits = _a.sent();
                send = {
                    data: {
                        name: name,
                        issues: issueList.data,
                        members: members.data,
                        totalCommits: commits.data.length,
                        totalIssues: issueList.data.length
                    }
                };
                res.send(send);
                return [2 /*return*/];
        }
    });
}); });
app.get("/:username", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, data, org, orgTemp;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                username = req.params.username;
                return [4 /*yield*/, getNames(username)];
            case 1:
                data = _a.sent();
                return [4 /*yield*/, octo.request("GET /orgs/{owner}", {
                        owner: username
                    })];
            case 2:
                orgTemp = _a.sent();
                org = {
                    orgName: orgTemp.data.name,
                    orgDesc: orgTemp.data.description,
                    orgLink: orgTemp.data.html_url
                };
                console.log({
                    org: org,
                    orgData: data
                });
                res.send({
                    org: org,
                    orgData: data
                });
                return [2 /*return*/];
        }
    });
}); });
app.post("/verify/:username", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, verify, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                username = req.params.username;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, octo.request("GET /orgs/{owner}", {
                        owner: username
                    })];
            case 2:
                verify = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                verify = "Not Found";
                return [3 /*break*/, 4];
            case 4:
                if (verify != "Not Found") {
                    console.log("Request Made");
                    res.send({
                        "verified": true
                    });
                }
                else {
                    res.send({
                        "verified": false
                    });
                }
                ;
                return [2 /*return*/];
        }
    });
}); });
app.listen(3060, function () {
    console.log("Running on 3000");
});
