const express = require("express");
const authRouter = express.Router();
const mongoose = require("mongoose");
let speakers = mongoose.model("speakers");

authRouter.get("/login", (req, res) => {
    res.render("authentication/login",{message:req.flash('errMsg')});
})

authRouter.post("/login", (req, res) => {
    // res.send("welcome to login")
    if (req.body.userName == "aa" && req.body.userPassword == "11"){
        req.session.role = 'admin';
        req.session.logged = true;
        res.redirect(`/admin/profile`);
    }
    else
        speakers.findOne({ userName: req.body.userName })
        .then((data) => {
            if(data){

                if (data.userName == req.body.userName && data.password == req.body.userPassword) {
                    req.session.logged = true;
                    req.session.role = 'speaker';
                    req.session.userid = data.id;
                    res.redirect(`/speaker/profile/${data.id}`);
                } else{
                    req.flash('errMsg','wrong password');
                    res.redirect("/login");
                }
            }else{
                req.flash('errMsg','wrong user name');
                res.redirect("/login");
            }
        })
        .catch((err) => {
            console.log(err);
            res.redirect("/login");
        })
})

authRouter.get("/register", (req, res) => {
    // res.send("welcome to register") 
    res.render("authentication/register",{errMsg:req.flash('regErrMsg')})
})

authRouter.post("/register", (req, res) => {
    if(req.body.password == req.body.password2){
        delete req.body.password2
        const newSpeaker = new speakers(req.body);
        newSpeaker.save()
        .then((data) => {
            // res.redirect(`/speaker/profile/:${req.body.userName}`);
            req.session.logged = true;
            req.session.role = 'speaker';
            req.session.id = data.id;
            res.redirect(`/speaker/profile/${data.id}`);
        })
        .catch((err) => {
            console.log(err + "");
            req.flash('regErrMsg','wrong data');
            res.redirect("/register");
        })
    } else {
        req.flash('regErrMsg','password didn\'t match');
        res.redirect("/register");
    }
})

authRouter.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
})

module.exports = authRouter;