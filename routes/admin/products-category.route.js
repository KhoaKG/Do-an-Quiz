const express = require('express')
const router = express.Router()
const controller = require('../../controllers/admin/products-category.controller')

const validate = require("../../validates/admin/product.validate")

const multer  = require('multer')
const upload = multer({ storage: multer.memoryStorage() });

const uploadCloud = require("../../middleware/admin/uploadCloud.middleware")

router.get('/', controller.index)

router.patch('/change-status/:status/:id', controller.changeStatus)

router.get('/create', controller.create)

router.post('/create', 
    upload.single('thumbnail'),
    uploadCloud.upload,
    validate.createPost, 
    controller.createPost
)

router.get('/edit/:id', controller.edit)

router.patch('/edit/:id', 
    upload.single('thumbnail'),
    uploadCloud.upload,
    validate.createPost, 
    controller.editPatch
)


module.exports = router
