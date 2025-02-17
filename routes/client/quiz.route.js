const express = require('express')
const route = express.Router()
const controller = require("../../controllers/client/quiz.controller")

route.get('/:slug', controller.index)

module.exports = route