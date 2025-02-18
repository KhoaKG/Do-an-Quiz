const express = require('express')
const route = express.Router()
const controller = require("../../controllers/client/result.controller")

route.get('/:id', controller.index)


module.exports = route