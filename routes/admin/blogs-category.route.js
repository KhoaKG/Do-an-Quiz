const express = require('express')
const route = express.Router()
const controller = require("../../controllers/admin/blogs-category.controller")

const validate = require("../../validates/admin/product.validate")

const multer  = require('multer')
const upload = multer({ storage: multer.memoryStorage() });

const uploadCloud = require("../../middleware/admin/uploadCloud.middleware")

route.get('/', controller.index)

route.get('/create', controller.create)

route.post('/create', 
    upload.single('thumbnail'),
    uploadCloud.upload,
    validate.createPost, 
    controller.createPost
)

route.get('/edit/:id', controller.edit)

route.patch('/edit/:id', 
    upload.single('thumbnail'),
    uploadCloud.upload,
    validate.createPost, 
    controller.editPatch
)

route.delete('/delete/:id', controller.deleteItem)

route.patch('/change-status/:status/:id', controller.changeStatus)

module.exports = route