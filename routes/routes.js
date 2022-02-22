module.exports = {
    main:{
      user : "/user",
      event : "/event",
    },
    user:{
        registerUser : "/register",
        loginUser : "/login",
        logoutUser : "/logout",
        changePassword :"/changePassword",
        passInfo : "/passInfo"
    },
    event:{
        createEvent : "/create",
        inviteUser : "/invite",
        eventsList : "/eventList",
        invitedToList : "/invitedToList",
        eventDetails : "/:eventId",
        updateEvent : "/:eventId"
    }
}
