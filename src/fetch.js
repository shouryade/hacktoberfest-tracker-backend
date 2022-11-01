"use strict";
exports.__esModule = true;
var express = require("express");
var app = express();
app.post("/signUp", function (req, res) {
    res.send("Hello");
});
app.post("/user", function (req, res) {
});
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Running on port ".concat(port));
});
