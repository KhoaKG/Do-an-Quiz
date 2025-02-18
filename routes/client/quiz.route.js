const express = require('express')
const route = express.Router()
const controller = require("../../controllers/client/quiz.controller")

route.get('/:slug', controller.index)

route.post('/answers/:slug', controller.answers)

module.exports = route