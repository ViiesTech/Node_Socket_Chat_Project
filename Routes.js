const express = require('express');

const AuthController = require('./controller/AuthController.js');
const MainController = require('./controller/MainController.js');

const Route = express.Router()

Route.post('/Register', AuthController.Register)
Route.post('/Login', AuthController.Login)


Route.post('/getUser', MainController.getUser)
Route.post('/getAllChatUsers', MainController.getAllChatUsers)



module.exports = Route