const express = require('express')
const route = express.Router()
const controller = require("../../controllers/admin/manage-questions.controller")

const multer  = require('multer')
const upload = multer({ storage: multer.memoryStorage() });

const uploadClound = require("../../middleware/admin/uploadCloud.middleware")

route.get('/', controller.index)

route.post('/addQuestion', controller.addQuestion);

route.get('/exams', controller.exams)

route.get('/exams/:slug', controller.examsSlug)

module.exports = route