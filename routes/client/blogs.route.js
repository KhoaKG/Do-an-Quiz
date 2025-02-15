const express = require('express')
const route = express.Router()
const controller = require("../../controllers/client/blogs.controller")

route.get('/', controller.index)

route.get('/detail/:slugProduct', controller.detail)

route.get('/:slugCategory', controller.category)


module.exports = route