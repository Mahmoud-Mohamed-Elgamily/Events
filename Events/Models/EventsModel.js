let mongoose = require("mongoose");

autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);


require("./speakersModel")
let eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    eventDate: { 
        type:Date,
        required: true
    },
    mainSpeaker: {type:Number,ref:"speakers",required:true},
    otherSpeakers: [{type:Number,ref:"speakers"}],
    status:String
});

eventSchema.plugin(autoIncrement.plugin, 'events');
let eventModel = mongoose.model('events', eventSchema );