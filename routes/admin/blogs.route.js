const express = require('express')
const route = express.Router()
const controller = require("../../controllers/admin/blogs.controller")
const validate = require("../../validates/admin/product.validate")

route.get('/', controller.index)

route.patch('/change-status/:status/:id', controller.changeStatus)

route.patch('/change-multi', controller.changeMulti)

route.delete('/delete/:id', controller.deleteItem)

route.get('/create', controller.create)

route.post('/create', validate.createPost, controller.createPost)

route.get('/edit/:id', controller.edit)

route.patch('/edit/:id',validate.createPost, controller.editPatch)

route.get('/detail/:id', controller.detail)

module.exports = route