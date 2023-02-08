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
exports.getRepoData = void 0;
require("dotenv").config();
var octokit_1 = require("octokit");
var express = require("express");
var middleware_1 = require("../middleware");
// import {repo} from "./types";
var graphql_1 = require("@octokit/graphql");
var app = express();
var router = express.Router();
exports.getRepoData = router;
var octo = new octokit_1.Octokit({
    auth: process.env.TOKEN
});
app.use(middleware_1["default"]);
function getRepoData(org, name) {
    return __awaiter(this, void 0, void 0, function () {
        var send, members, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    send = {
                        totalCommits: 0,
                        issues: [],
                        members: [],
                        totalContributors: 0,
                        totalIssues: 0
                    };
                    return [4 /*yield*/, octo.request("GET /repos/{owner}/{repo}/contributors", {
                            owner: org,
                            repo: name
                        })];
                case 1:
                    members = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, octo.graphql("query getRepoData($organisation: String!, $name: String!) {\n          repository(owner: $organisation, name: $name) {\n            ... on Repository {\n              defaultBranchRef {\n                name\n                target {\n                  ... on Commit {\n                    history {\n                      totalCount\n                    }\n                  }\n                }\n              }\n            }\n            issues(\n              last: 100\n              filterBy: {labels: [\"Hacktoberfest-Accepted\"], states: [OPEN]}\n            ) {\n              totalCount\n              nodes {\n                number\n                title\n                url\n                author {\n                  login\n                }\n              }\n            }\n          }\n        }\n        ", {
                            organisation: org,
                            name: name
                        })];
                case 3:
                    data = _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    if (error_1 instanceof graphql_1.GraphqlResponseError) {
                        return [2 /*return*/, error_1.message];
                    }
                    else {
                        return [2 /*return*/, "Server Error!"];
                    }
                    return [3 /*break*/, 5];
                case 5:
                    send.members = members.data.map(function (_a) {
                        var login = _a.login, avatar_url = _a.avatar_url, id = _a.id, contributions = _a.contributions, html_url = _a.html_url;
                        return ({
                            login: login,
                            avatar_url: avatar_url,
                            id: id,
                            contributions: contributions,
                            html_url: html_url
                        });
                    });
                    send.issues = data.repository.issues.nodes.map(function (_a) {
                        var url = _a.url, number = _a.number, title = _a.title, author = _a.author;
                        return ({
                            number: number,
                            title: title,
                            url: url,
                            author: author
                        });
                    });
                    send = __assign(__assign({}, send), { totalCommits: data.repository.defaultBranchRef.target.history.totalCommits, totalContributors: members.data.length, totalIssues: data.repository.issues.totalCount });
                    return [2 /*return*/, send];
            }
        });
    });
}
router.get("/:org/:repo", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var organisation, name, reponse;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                organisation = req.params.org;
                name = req.params.repo;
                return [4 /*yield*/, getRepoData(organisation, name)];
            case 1:
                reponse = _a.sent();
                res.json(reponse);
                return [2 /*return*/];
        }
    });
}); });
