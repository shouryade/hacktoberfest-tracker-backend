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
exports.getOrgData = void 0;
require("dotenv").config();
var octokit_1 = require("octokit");
var express = require("express");
var middleware_1 = require("../middleware");
var graphql_1 = require("@octokit/graphql");
var octo = new octokit_1.Octokit({
    auth: process.env.TOKEN
});
var router = express.Router();
exports.getOrgData = router;
var app = express();
app.use(middleware_1["default"]);
function getDashData(organisation) {
    return __awaiter(this, void 0, void 0, function () {
        var querystring, data, error_1, response, _i, _a, node, contri, contributors, repository;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    querystring = "org:" + organisation + " topic:hacktoberfest";
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, octo.graphql("query getDashData($organisation: String!, $querystring: String!) {\n    search(last: 100, type: REPOSITORY, query: $querystring) {\n      repos: nodes {\n        ... on Repository {\n          name\n          url\n          description\n          repositoryTopics(first: 100) {\n            nodes {\n              topic {\n                name\n              }\n            }\n          }\n          defaultBranchRef {\n            name\n            target {\n              ... on Commit {\n                history {\n                  totalCount\n                }\n              }\n            }\n          }\n          openIssues: issues(states: OPEN) {\n            totalCount\n          }\n          prOpen: pullRequests(states: OPEN) {\n            totalCount\n          }\n        }\n      }\n    }\n    organization(login: $organisation) {\n      name\n      avatarUrl\n      description\n      url\n    }\n  }\n        ", {
                            organisation: organisation,
                            querystring: querystring
                        })];
                case 2:
                    data = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _b.sent();
                    if (error_1 instanceof graphql_1.GraphqlResponseError) {
                        return [2 /*return*/, error_1.message];
                    }
                    else {
                        console.log(error_1);
                        return [2 /*return*/, "Server error"];
                    }
                    return [3 /*break*/, 4];
                case 4:
                    response = {
                        name: data.organization.name,
                        avatarUrl: data.organization.avatarUrl,
                        description: data.organization.description,
                        url: data.organization.url,
                        hfestRepos: data.search.repos.length,
                        repos: []
                    };
                    _i = 0, _a = data.search.repos;
                    _b.label = 5;
                case 5:
                    if (!(_i < _a.length)) return [3 /*break*/, 8];
                    node = _a[_i];
                    return [4 /*yield*/, octo.request("GET /repos/{owner}/{repo}/contributors", {
                            owner: organisation,
                            repo: node.name
                        })];
                case 6:
                    contri = _b.sent();
                    console.log(contri);
                    contributors = contri.data.map(function (_a) {
                        var name = _a.name, login = _a.login, html_url = _a.html_url, avatar_url = _a.avatar_url, contributions = _a.contributions;
                        return ({
                            name: name,
                            login: login,
                            html_url: html_url,
                            avatar_url: avatar_url,
                            contributions: contributions
                        });
                    });
                    repository = {
                        name: node.name,
                        contributors: contributors,
                        url: node.url,
                        description: node.description,
                        topics: node.repositoryTopics.nodes.map(function (nodes) { return nodes.topic.name; }),
                        defBranch: node.defaultBranchRef.name,
                        totalCommits: node.defaultBranchRef.target.history.totalCount,
                        openIssues: node.openIssues.totalCount,
                        prOpen: node.prOpen.totalCount
                    };
                    response.repos.push(repository);
                    _b.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8: return [2 /*return*/, response];
            }
        });
    });
}
router.get("/:username", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, dashData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                username = req.params.username;
                if (!(username === "undefined")) return [3 /*break*/, 1];
                console.log("Undefined Request");
                res.send({ response: "False request" });
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, getDashData(username)];
            case 2:
                dashData = _a.sent();
                res.json(dashData);
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
