const express = require("express");
const speakerR = express.Router();
const moongose = require("mongoose");
require("../Models/speakersModel");
require("../Models/EventsModel");
let speakerModel = moongose.model("speakers");
let eventsModel = moongose.model("events");

speakerR.get("/profile/:id?", (req, res) => {
    speakerModel.findById(req.params.id)
    .then((userData)=>{
        eventsModel.find({})
        .then((eventsData)=>{
            res.render("speaker/profile", {
                userData,eventsData 
            })
        })
        .catch((err) => {
            console.log("error message => " + err)
            res.send("fail");
        });
    })
    .catch((err) => {
        console.log("error message => " + err)
        res.send("fail");
    });
})

speakerR.get('/decline/:id',(req,res)=>{
    eventsModel.findById(req.params.id)
    .then((data)=>{
        // send notification to the admin with this id 
        res.send("success")
    })
    .catch((err)=>{
        console.log("error msg " + err);
        res.send('fail');
    })
});

speakerR.use((req,res,next)=>{ 
    if(req.session.role != 'admin'){
        if(!req.session.logged)
            return res.redirect('/login');
        else
            return res.redirect(`/speaker/profile/${req.session.userid}`);
    }
    next();
})

speakerR.get("/listSpeakers", (req, res) => {
    speakerModel.find({})
        .then((data) => {
            res.render("speaker/listSpeakers", {
                speakers: data
            })
        })
        .catch((err) => {
            console.log("error message => " + err)
            res.send("fail");
        });
})

speakerR.get("/addSpeaker", (req, res) => {
    res.render("speaker/addspeaker")
})

speakerR.post("/addSpeaker", (req, res) => {
    let newSpeaker = new speakerModel(req.body);
    newSpeaker.save().then((data) => {
        res.redirect("/speaker/listSpeakers")
    }).catch((err) => {
        console.log("error message => " + err);
        res.redirect("/speaker/addSpeaker")
    })
})

speakerR.get("/updateSpeaker/:_id", (req, res) => {
    speakerModel.findById(req.params._id)
    .then((speakers) => {
            res.send(speakers)
    }).catch((err) => {
        console.log("error message => " + err);
        res.send("fail");
    })
})

speakerR.post("/updateSpeaker", (req, res) => {
    console.log(req.body);
    if(req.body.pass1 == req.body.pass2){
        req.body.password = req.body.pass1
    }
    speakerModel.findByIdAndUpdate(req.body._id, req.body, {
        new: true
    }).then((data) => {
        res.send(data);
        // res.redirect("/speaker/listSpeakers");
    }).catch((err) => {
        console.log(err);
        res.send("error message => " + err);
    })
})

speakerR.post("/deleteSpeaker", (req, res) => {
    speakerModel.findByIdAndDelete(req.body.id).then((data) => {
        res.send("success");
    }).catch((err) => {
        res.send("error message => " + err);
    })
})
module.exports = speakerR;