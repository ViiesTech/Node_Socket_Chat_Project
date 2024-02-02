const express = require('express');

const AuthController = require('./controller/AuthController.js')

const Route = express.Router()

Route.post('/Register', AuthController.Register)
Route.post('/Login', AuthController.Login)


module.exports = Route