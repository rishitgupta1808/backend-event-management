const express = require("express");
const userController = require("../controller/user.js");

const routes = require('./routes.js');
const { user } = routes;

const router = express.Router();

router.post(user.registerUser,userController.registerUser)

router.post(user.loginUser,userController.loginUser)

router.get(user.logoutUser,userController.logoutUser)

router.post(user.changePassword,userController.changePassword)

router.get(user.passInfo,userController.passInfo)


module.exports = router;
