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
var router = express.Router();
exports.updateOrg = router;
var updateOrg = function () { return __awaiter(void 0, void 0, void 0, function () {
    var orgRepo, repoRepo, contRepo, orgData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                orgRepo = connection_1.AppDataSource.getRepository(org_1.Org);
                repoRepo = connection_1.AppDataSource.getRepository(repo_1.Repo);
                contRepo = connection_1.AppDataSource.getRepository(contribution_1.Contribution);
                return [4 /*yield*/, orgRepo.createQueryBuilder('org')
                        .select('org.id')
                        .leftJoinAndSelect('org.repo', 'repos')
                        .take(10)
                        .getMany()];
            case 1:
                orgData = _a.sent();
                orgData.forEach(function (orgR) {
                    var data;
                    http.request({
                        hostname: 'localhost',
                        port: 3060,
                        path: '/' + orgR.uName
                    }, function (response) {
                        response.on('data', function (chunk) {
                            data = chunk;
                        });
                        response.on('end', function () {
                            console.log("Request ended");
                        });
                    })
                        .on('error', function (err) {
                        console.log("Error fetching data" + err);
                    })
                        .end();
                    //udpate org data - to do
                    data.repos.forEach(function (repo) { return __awaiter(void 0, void 0, void 0, function () {
                        var result, repoData_1, newRepo;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    result = orgR.repos.find(function (element) {
                                        return element.uName = repo.name;
                                    });
                                    if (!result) return [3 /*break*/, 3];
                                    return [4 /*yield*/, repoRepo.createQueryBuilder('repo')
                                            .select('repo.id')
                                            .where('repo.id = :id', { id: result.id })
                                            .leftJoinAndSelect('repo.contributions', 'contributions')
                                            .getOne()];
                                case 1:
                                    repoData_1 = _a.sent();
                                    repo.contributors.forEach(function (cont) { return __awaiter(void 0, void 0, void 0, function () {
                                        var result1, newContribution;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    result1 = repoData_1.contributions.find(function (ele) {
                                                        return ele.githubId = cont.login;
                                                    });
                                                    if (!result1) return [3 /*break*/, 2];
                                                    //update old contribution
                                                    result1.contributions = cont.contributions;
                                                    result1.name = cont.name;
                                                    result1.picLink = cont.avatar_url;
                                                    result1.profile_link = cont.html_url;
                                                    return [4 /*yield*/, contRepo.save(result1)];
                                                case 1:
                                                    _a.sent();
                                                    return [3 /*break*/, 4];
                                                case 2:
                                                    newContribution = contRepo.create({
                                                        contributions: cont.contributions,
                                                        name: cont.name,
                                                        picLink: cont.avatar_url,
                                                        githubId: cont.login,
                                                        profile_link: cont.html_url,
                                                        repo: repoData_1
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
                                    result.totalCommits = repo.totalCommits,
                                        result.desc = repo.description,
                                        result.name = repo.name,
                                        result.topics = repo.topics,
                                        result.totalIssues = repo.openIssues,
                                        result.totalPrOpen = repo.prOpen,
                                        result.url = repo.url;
                                    return [4 /*yield*/, repoRepo.save(result)];
                                case 2:
                                    _a.sent();
                                    return [3 /*break*/, 5];
                                case 3:
                                    newRepo = repoRepo.create({
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
                                    return [4 /*yield*/, repoRepo.save(newRepo)];
                                case 4:
                                    _a.sent();
                                    _a.label = 5;
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); });
                });
                return [2 /*return*/];
        }
    });
}); };
router.get('/update/org', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, updateOrg()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
