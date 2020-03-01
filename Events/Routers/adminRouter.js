const express = require("express");
const adminR = express.Router();
const path = require("path");
const moongose = require("mongoose");
let speakerModel = moongose.model("speakers");
let eventsModel = moongose.model("events");

adminR.get("/profile/", (req, res) => {
    res.render("admin/profile")
});

module.exports = adminR;