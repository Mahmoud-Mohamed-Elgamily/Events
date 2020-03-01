const mongoose = require("mongoose");
const speakerR = require("./Routers/speakerRouter");
const express = require("express");
const eventR = require("./Routers/eventsRouter");
const adminR = require("./Routers/adminRouter.js");
const authR = require("./Routers/authRouter");
const path = require("path");
const session = require("express-session");
var flash = require('connect-flash');
const server = express();


// DB Connection and starting server and session
// DB Connection
mongoose.connect("mongodb://localhost:27017/speakersTask",{ useNewUrlParser: true ,useUnifiedTopology:true })
.then((data)=>{
    console.log("connected");
})
.catch((err)=>{
    console.log("errors "+err);
});

// starting server
server.listen(6060,()=>{
    console.log("Working ... on port 6060");
})

// starting session
server.use(session({
    key: 'Me7mod',
    secret: 'Me7mod',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));
server.use(flash());
server.use((req,res,next)=>{
    console.log(`request from ${req.url} of type ${req.method}`);
    next();
});


// settings 
server.set('view engine', 'ejs');
server.locals.moment = require('moment');
server.set("views" , path.join(__dirname,"Views"));
server.use(express.static('Public'))

server.use(express.json());
server.use(express.urlencoded({extended:false}));
// routers
server.use(authR);
server.use((req,res,next)=>{ 
    if(!req.session.logged)
        return res.redirect('/login');
    next();    
})
server.use("/speaker",speakerR);

server.use((req,res,next)=>{ 
    if(req.session.role != 'admin'){
        return res.redirect(`/speaker/profile/${req.session.userid}`);
    }
    next();
})

server.use("/event",eventR);
server.use("/admin",adminR);

server.use((err , req , res , next)=>{
    console.log("eeeeeeeeeeeeeeeeeeeror");
    console.error(err);
    next();
});
