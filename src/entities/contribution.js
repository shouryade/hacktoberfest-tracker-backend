"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Contribution = void 0;
var typeorm_1 = require("typeorm");
var repo_1 = require("./repo");
var Contribution = /** @class */ (function () {
    function Contribution() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)()
    ], Contribution.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)({
            type: "varchar"
        })
    ], Contribution.prototype, "githubId");
    __decorate([
        (0, typeorm_1.Column)({
            type: "varchar"
        })
    ], Contribution.prototype, "name");
    __decorate([
        (0, typeorm_1.Column)({
            type: "varchar"
        })
    ], Contribution.prototype, "picLink");
    __decorate([
        (0, typeorm_1.Column)({
            type: "numeric"
        })
    ], Contribution.prototype, "contributions");
    __decorate([
        (0, typeorm_1.Column)({
            type: "varchar"
        })
    ], Contribution.prototype, "profile_link");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return repo_1.Repo; }, function (repo) { return repo.contributions; }),
        (0, typeorm_1.JoinColumn)({
            name: "repoId"
        })
    ], Contribution.prototype, "repo");
    Contribution = __decorate([
        (0, typeorm_1.Entity)('contribution')
    ], Contribution);
    return Contribution;
}());
exports.Contribution = Contribution;
