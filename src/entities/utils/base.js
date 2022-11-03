"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Base = void 0;
var typeorm_1 = require("typeorm");
var Base = /** @class */ (function () {
    function Base() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)()
    ], Base.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)({
            type: "varchar"
        })
    ], Base.prototype, "uName");
    __decorate([
        (0, typeorm_1.Column)({
            type: "numeric",
            "default": 0
        })
    ], Base.prototype, "totalContributions");
    __decorate([
        (0, typeorm_1.Column)({
            type: "numeric",
            "default": 0
        })
    ], Base.prototype, "totalCommits");
    __decorate([
        (0, typeorm_1.Column)({
            type: "numeric",
            "default": 0
        })
    ], Base.prototype, "totalIssues");
    __decorate([
        (0, typeorm_1.Column)({
            type: "json",
            "default": null
        })
    ], Base.prototype, "contributorList");
    __decorate([
        (0, typeorm_1.Column)({
            type: "json",
            "default": null
        })
    ], Base.prototype, "issueList");
    __decorate([
        (0, typeorm_1.Column)({
            type: "json",
            "default": null
        })
    ], Base.prototype, "contributionList");
    Base = __decorate([
        (0, typeorm_1.Entity)('base')
    ], Base);
    return Base;
}());
exports.Base = Base;
