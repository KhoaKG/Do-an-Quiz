const express = require('express')
const route = express.Router()
const controller = require("../../controllers/admin/products.controller")
const validate = require("../../validates/admin/product.validate")

const multer  = require('multer')
const upload = multer({ storage: multer.memoryStorage() });

const uploadClound = require("../../middleware/admin/uploadCloud.middleware")

route.get('/', controller.index)

route.patch('/change-status/:status/:id', controller.changeStatus)

route.patch('/change-multi', controller.changeMulti)

route.delete('/delete/:id', controller.deleteItem)

route.get('/create', controller.create)

route.post('/create',upload.single("thumbnail"),uploadClound.upload, validate.createPost, controller.createPost)

route.get('/edit/:id', controller.edit)

route.patch('/edit/:id',upload.single("thumbnail"),uploadClound.upload, validate.createPost, controller.editPatch)

route.get('/detail/:id', controller.detail)

module.exports = route