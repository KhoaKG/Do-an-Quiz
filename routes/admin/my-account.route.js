const express = require ("express");
const router = express.Router();
const controller = require("../../controllers/admin/my-account.controller.controller");

const multer  = require('multer')
const upload = multer({ storage: multer.memoryStorage() });

const uploadClound = require("../../middleware/admin/uploadCloud.middleware")

router.get("/", controller.index);

router.get('/edit', controller.edit)

router.patch('/edit',upload.single("avatar"),uploadClound.upload, controller.editPatch)

module.exports = router;
