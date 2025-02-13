const express = require('express')
const router = express.Router()
const controller = require('../../controllers/admin/accounts.controller')
const validate = require("../../validates/admin/accounts.validate")

const multer  = require('multer')
const upload = multer({ storage: multer.memoryStorage() });

const uploadClound = require("../../middleware/admin/uploadCloud.middleware")
router.get('/', controller.index)

router.get('/create', controller.create)

router.post('/create',
    upload.single("avatar"),
    uploadClound.upload, 
    validate.createPost, 
    controller.createPost
)

router.get('/edit/:id', controller.edit)
router.patch('/edit/:id',
    upload.single("avatar"),
    uploadClound.upload, 
    validate.editPatch, 
    controller.editPatch
)

module.exports = router
