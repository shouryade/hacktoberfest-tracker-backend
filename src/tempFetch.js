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
var octokit_1 = require("octokit");
var express = require("express");
var app = express();
var octo = new octokit_1.Octokit();
function getNames(username) {
    return __awaiter(this, void 0, void 0, function () {
        var repos, actualRepo, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    actualRepo = [];
                    return [4 /*yield*/, octo.request("GET /orgs/{owner}/repos", {
                            owner: username
                        })];
                case 1:
                    repos = _a.sent();
                    for (i = 0; i < repos.data.length; i++) {
                        if (repos.data[i].topics.includes("hacktoberfest2022") || repos.data[i].topics.includes("hacktoberfest")) {
                            actualRepo.push(repos.data[i].name);
                        }
                    }
                    // repoNames.forEach(async (repo) => {
                    //     let topics = await octo.request("GET /repos/{owner}/{repo}/topics",{
                    //         owner:"developer-student-club-thapar",
                    //         repo:repo
                    //     });
                    //     console.log(topics);
                    //     if(topics.data.names.includes("hacktoberfest2022") || topics.data.names.includes("hacktoberfest")){
                    //         actualRepo.push(repo);
                    //     }
                    // });
                    console.log(actualRepo);
                    return [2 /*return*/, actualRepo];
            }
        });
    });
}
function getRepoData(names, username) {
    return __awaiter(this, void 0, void 0, function () {
        var send, i, repoData, issueList, members, commits, orgName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    send = { orgName: "", data: [] };
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < names.length)) return [3 /*break*/, 6];
                    repoData = void 0;
                    return [4 /*yield*/, octo.request("GET /repos/{owner}/{repo}/issues", {
                            owner: username,
                            repo: names[i]
                        })];
                case 2:
                    issueList = _a.sent();
                    return [4 /*yield*/, octo.request("GET /repos/{owner}/{repo}/contributors", {
                            owner: username,
                            repo: names[i]
                        })];
                case 3:
                    members = _a.sent();
                    return [4 /*yield*/, octo.request("GET /repos/{owner}/{repo}/commits", {
                            owner: username,
                            repo: names[i]
                        })];
                case 4:
                    commits = _a.sent();
                    repoData = {
                        name: names[i],
                        issues: issueList.data,
                        members: members.data,
                        totalCommits: commits.data,
                        totalIssues: issueList.data.length
                    };
                    // console.log(repoData);
                    send.data.push(repoData);
                    _a.label = 5;
                case 5:
                    i++;
                    return [3 /*break*/, 1];
                case 6:
                    console.log(send);
                    return [4 /*yield*/, octo.request("GET /orgs/{owner}", {
                            owner: username
                        })];
                case 7:
                    orgName = _a.sent();
                    send.orgName = orgName.data.name;
                    return [2 /*return*/, send];
            }
        });
    });
}
app.get("/:username", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, names, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                username = req.params.username;
                return [4 /*yield*/, getNames(username)];
            case 1:
                names = _a.sent();
                return [4 /*yield*/, getRepoData(names, username)];
            case 2:
                data = _a.sent();
                res.send(data);
                return [2 /*return*/];
        }
    });
}); });
app.post("/verify/:username", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, verify;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                username = req.params.username;
                return [4 /*yield*/, octo.request("GET /orgs/{owner}", {
                        owner: username
                    })];
            case 1:
                verify = _a.sent();
                if (verify.data != null) {
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
