const express = require('express')
const route = express.Router()
const controller = require("../../controllers/admin/order-management.controller")

route.get('/', controller.index)

route.delete('/delete/:id', controller.deleteItem)

route.patch('/change-status/:status/:id', controller.changeStatus)

route.get('/detail/:id', controller.detail)

module.exports = route