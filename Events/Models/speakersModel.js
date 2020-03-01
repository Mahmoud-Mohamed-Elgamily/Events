let mongoose = require('mongoose');

autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

let speakerSchema = new mongoose.Schema({
    firstName: {
        type:String,
        required: true
    },
    lastName: {
        type:String,
        required: true
    },
    userName: {
        type:String,
        required: true
    },
    password: {
        type:String,
        required: true
    },
    Address: {
        city:{
            type:String,
            required: true
        },
        street:{
        type:Number,
        required: true
    },
        building:{
        type:Number,
        required: true
    }
    }
});

speakerSchema.plugin(autoIncrement.plugin, 'speakers');
let speakersModel = mongoose.model("speakers", speakerSchema);