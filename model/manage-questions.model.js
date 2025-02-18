const mongoose = require('mongoose');
const manageQuestionsSchema = new mongoose.Schema({
    quiz_title: String,
    question: String,
    answers: { 
        type: [String],  // Danh sách các câu trả lời
    },
    correctAnswer: Number
}, {
    timestamps: true
})
const ManageQuestion = mongoose.model('ManageQuestion', manageQuestionsSchema, "manage-questions");
module.exports = ManageQuestion
