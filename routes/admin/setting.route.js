const express = require('express')
const router = express.Router()
const controller = require("../../controllers/admin/setting.controller")

const multer  = require('multer')
const upload = multer({ storage: multer.memoryStorage() });

const uploadClound = require("../../middleware/admin/uploadCloud.middleware")

router.get('/general', controller.general)

router.patch('/general',
    upload.single("logo"),
    uploadClound.upload,
    controller.generalPatch)

 
module.exports = router
