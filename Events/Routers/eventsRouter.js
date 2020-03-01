const express = require("express");
const eventsR = express.Router();
const moongose = require("mongoose");
require("../Models/EventsModel");
let eventsModel = moongose.model("events");
let speakersModel = moongose.model("speakers");


eventsR.get("/listEvents", (req, res) => {
    eventsModel.find({})
        .populate("mainSpeaker otherSpeakers")
        .then((data) => {
            res.render("events/listEvents", {
                events: data
            })
        })
        .catch((err) => {
            console.log("error message => " + err)
            res.send("fail");
        });
})

eventsR.get("/addEvents", (req, res) => {
    speakersModel.find({})
    .then((data)=>{res.render("events/addEvents",{speakers:data})})
    .catch((err)=>{console.log(err)})    
})

eventsR.post("/addEvents", (req, res) => {
    console.log(req.body);
    
    let newEvent = new eventsModel(req.body);
    newEvent.save().then((data)=>{
        // res.render("events/addEvents",{speakers:data})
        res.redirect("/event/listEvents")
    })
    .catch((err) => {
        console.log("error message => " + err);
        res.redirect("/event/addEvents")
    })
})

eventsR.get("/updateEvents/:_id", (req, res) => {
    eventsModel.findById(req.params._id)
    .populate("mainSpeaker otherSpeakers")
    .then((event) => {
        speakersModel.find({})
        .then((speakers)=>{
            res.send({event,speakers})
        })
    }).catch((err) => {
        console.log("error message => " + err);
        res.send("fail");
    })
})

eventsR.post("/updateEvents", (req, res) => {
    eventsModel.findByIdAndUpdate(req.body._id, req.body, {
        new: true
    })
    .populate("mainSpeaker otherSpeakers")
    .then((data) => {    
        res.send(data);
    }).catch((err) => {
        res.send("error message => " + err);
    })
})

eventsR.post("/deleteEvent", (req, res) => {
    eventsModel.findByIdAndDelete(req.body.id)
    .then((data) => {
        res.send("success");
    }).catch((err) => {
        console.log(err);
        res.send("error message => " + err);
    })
})

module.exports = eventsR;