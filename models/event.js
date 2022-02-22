const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({

    id : {
        type : Number,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    description : {
        type: String
    },
    createdBy :{
        type : String,
        required : true
    },
    guests : Array,
    time:String,
    venue : String,
    date : {
        type:Date,
        required : true
    }


},{ timestamps: true});


const Event = mongoose.model("Event", eventSchema);

module.exports = Event
