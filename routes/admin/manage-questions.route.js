const express = require('express')
const route = express.Router()
const controller = require("../../controllers/admin/manage-questions.controller")

const multer  = require('multer')
const upload = multer({ storage: multer.memoryStorage() });

const uploadClound = require("../../middleware/admin/uploadCloud.middleware")

route.get('/', controller.index)

route.get('/loadQuiz/:quizTitle', controller.loadQuiz)

route.post('/addAnswer/:quizTitle/:indexQuestion/:indexAnswer', controller.addAnswer)

route.post('/addQuestion/:quizTitle/:indexQuestion', controller.addQuestion)

route.patch('/edit/:quizTitle',upload.single("thumbnail"),uploadClound.upload, controller.editPatch)

module.exports = route