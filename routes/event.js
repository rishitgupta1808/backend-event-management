const express = require("express");
const eventController = require("../controller/event.js");

const routes = require('./routes.js');
const { event } = routes;

const router = express.Router();

router.post(event.createEvent,eventController.createEvent)

router.post(event.inviteUser,eventController.inviteUser)

router.get(event.eventsList,eventController.eventsList)

router.get(event.invitedToList,eventController.invitedToList)

router.get(event.eventDetails,eventController.eventDetails)

router.put(event.updateEvent,eventController.updateEvent)

module.exports = router;
