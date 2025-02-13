const express = require('express')
const router = express.Router()
const controller = require('../../controllers/admin/products-category.controller')

const validate = require("../../validates/admin/product.validate")

const multer  = require('multer')
const upload = multer({ storage: multer.memoryStorage() });

const uploadCloud = require("../../middleware/admin/uploadCloud.middleware")

router.get('/', controller.index)

router.get('/create', controller.create)

router.post('/create', 
    upload.single('thumbnail'),
    uploadCloud.upload,
    validate.createPost, 
    controller.createPost
)


module.exports = router
