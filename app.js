const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDb = require("./utils/db");

const routes = require("./routes/routes.js");
const { main } = routes;
const userRouter = require("./routes/user")
const eventRouter = require("./routes/event")

const sessions = require("./utils/session")

//create route to tio read rq.files

const app = express();

// 1) GLOBAL MIDDLEWARES
app.use(cors());
// Access-Control-Allow-Origin *

//127.0.0.1:5500/
http: app.options("*", cors());

// parse application/json
app.use(bodyParser.json({ limit: "50mb" }));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

//trigger the function to connect database
connectDb();

//sessions
app.use(sessions)

// ROUTES
app.use(main.user, userRouter);
app.use(main.event, eventRouter);


module.exports = app;
