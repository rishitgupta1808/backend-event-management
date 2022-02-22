const Event = require("../models/event");
const User = require("../models/user")
const bcrypt = require('bcrypt')


exports.createEvent = async(req,res) =>{

    const {name,description,time,date,venue} = req.body;

    console.log(req.body)

    try{

        if(!req.session.user)
        return res.status(400).send("You are not logged In")

        if(name===""||description===""||time===""||venue===""||date===""||!name||!description||!time||!date||!venue)
        return res.status(400).send("Please Fill all the details to create event : name,description,time date,venue")

        let temp = new Date(date)
       
        if(temp=="Invalid Date")
        return res.status(200).send("Date should be in this format YYYY-MM-DD")

        temp.setDate(temp.getDate()+1)

        let event = await Event.create({
            id : Date.now(),
            name : name,
            time : time,
            date : temp,
            venue : venue,
            description : description,
            createdBy : req.session.user
        })

        if(event)
        return res.status(201).send(`Event ${name} is created now you can invite other users`)
        else
        return res.status(500).send('Event i snot created due to some error')

    } catch(err){
        console.log(" EventController : createEvent : "+err)
        return res.status(500).send(err)
    }
    
}

exports.inviteUser = async(req,res) =>{

    const {guestUserId,eventId} = req.body;

    console.log(req.body)

    try{

        if(!req.session.user)
        return res.status(400).send("You are not logged In")

        if(guestUserId===""||eventId===""||!guestUserId||!eventId)
        return res.status(400).send("Please Fill all the details to invite user : guestUserId")

        let userExist = await User.findOne({userId : guestUserId })

        if(!userExist)
        return res.status(400).send(`${guestUserId} is not exist`)

        let alreadyGuest = await Event.findOne({id : eventId,guests:guestUserId})

        if(alreadyGuest)
        return res.status(400).send(`${guestUserId} is already invited`)


        let newEventGuest = await Event.findOneAndUpdate({id : eventId},{
            $push : {guests : guestUserId}
        })

        // let invitedTo = await User.findOneAndUpdate({userId:guestUserId},{
        //     $push : {invitedTo : eventId}
        // })

        if(newEventGuest)
        return res.status(200).send(`${guestUserId} is invited to the ${newEventGuest.name}`)
        else
        return res.status(400).send("Event id is not exist")

      

    } catch(err){
        console.log(" EventController : inviteUser : "+err)
        return res.status(500).send(err)
    }
    
}

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

exports.eventsList = async(req,res) =>{

    let {search,page,to,from} = req.query;

    console.log(req.query)

    let date

    if(from && !to){
        to = new Date()
        to = to.toLocaleDateString(`fr-CA`).split('/').join('-')

        date = {
              '$gte': `${from}T00:00:00.000Z`,
              '$lt': `${to}T23:59:59.999Z`
          };

          console.log(date)
    }
    if(from && to){

        date = {
            '$gte': `${from}T00:00:00.000Z`,
            '$lt': `${to}T23:59:59.999Z`
        };

        console.log(date)

    }

    try{

        if(!req.session.user)
        return res.status(400).send("You are not logged In")

        if(!page)
        return res.status(400).send("page number should be in query")

        let events;

        let limit = 5
        let skip = Number(page * limit)
        if(!search && !to && !from)
        events = await Event.find({createdBy : req.session.user}).skip(skip).limit(limit).sort({name:1})

        else if(!to && !from){
            const regex = new RegExp(escapeRegex(search), 'gi');
            events = await Event.find({createdBy : req.session.user,name:regex}).skip(skip).limit(limit).sort({name:1})
        }

        else if(!search){
            events = await Event.find({createdBy : req.session.user,date}).skip(skip).limit(limit).sort({name:1})
        }
        else{
            const regex = new RegExp(escapeRegex(search), 'gi');
            events = await Event.find({createdBy : req.session.user,date,name:regex}).skip(skip).limit(limit).sort({name:1})
        }

        if(events)
        return res.status(200).json({events})
        else
        return res.status(400).send("No events from this query")

      

    } catch(err){
        console.log(" EventController : eventsList : "+err)
        return res.status(500).send(err)
    }
    
}

exports.invitedToList = async(req,res) =>{

    let {search,page,to,from} = req.query;

    console.log(req.query)

    let date

    if(from && !to){
        to = new Date()
        to = to.toLocaleDateString(`fr-CA`).split('/').join('-')

        date = {
              '$gte': `${from}T00:00:00.000Z`,
              '$lt': `${to}T23:59:59.999Z`
          };

          console.log(date)
    }
    if(from && to){

        date = {
            '$gte': `${from}T00:00:00.000Z`,
            '$lt': `${to}T23:59:59.999Z`
        };

        console.log(date)

    }

    try{

        if(!req.session.user)
        return res.status(400).send("You are not logged In")

        if(!page)
        return res.status(400).send("page number should be in query")

        let events;

        let limit = 5
        let skip = Number(page * limit)
        if(!search && !to && !from)
        events = await Event.find({guests:req.session.user}).skip(skip).limit(limit).sort({name:1})

        else if(!to && !from){
            const regex = new RegExp(escapeRegex(search), 'gi');
            events = await Event.find({guests:req.session.user,name:regex}).skip(skip).limit(limit).sort({name:1})
        }

        else if(!search){
            events = await Event.find({guests:req.session.user,date}).skip(skip).limit(limit).sort({name:1})
        }
        else{
            const regex = new RegExp(escapeRegex(search), 'gi');
            events = await Event.find({guests:req.session.user,name:regex,date}).skip(skip).limit(limit).sort({name:1})
        }

        if(events)
        return res.status(200).json({events})
        else
        return res.status(400).send("No events from this query")

      

    } catch(err){
        console.log(" EventController : invitedToList : "+err)
        return res.status(500).send(err)
    }
}

exports.eventDetails = async(req,res) =>{

    const {eventId} = req.params;

    console.log(req.params)

    try{

        if(!req.session.user)
        return res.status(400).send("You are not logged In")

        if(!eventId)
        return res.status(400).send("eventid is required in param")

        let event = await Event.findOne({eventId:eventId})

        if(event)
        return res.status(200).json({event,users:event.guests})
        else
        return res.status(400).send('No event found by this id')

    } catch(err){
        console.log(" EventController : eventDetails : "+err)
        return res.status(500).send(err)
    }
    
}

exports.updateEvent = async(req,res) =>{

    const {name,description,venue,time,date} = req.body;

    console.log(req.body)

    try{

        if(!req.session.user)
        return res.status(400).send("You are not logged In")

        if((name===""&&description===""&&time===""&&venue===""&&date==="")||(!name&&!description&&!time&&!date&&!venue))
        return res.status(400).send("Please Fill all the details to create event : name and description")

        let temp

        if(date){
        temp = new Date(date)
       
        if(temp=="Invalid Date")
        return res.status(200).send("Date should be in this format YYYY-MM-DD")

        temp.setDate(temp.getDate()+1)

        }

        let event = await Event.findOneAndUpdate({
            id : req.params.eventId,
            createdBy : req.session.user
        },{
            name : name,
            description : description,
            date : temp,
            time : time,
            venue : venue
        })

        if(event)
        return res.status(201).send(`Event ${event.name} is updated`)
        else
        return res.status(500).send('Event is not found by this eventid')

    } catch(err){
        console.log(" EventController : updateEvent : "+err)
        return res.status(500).send(err)
    }
    
}