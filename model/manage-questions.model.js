const mongoose = require('mongoose');
const manageQuestionsSchema = new mongoose.Schema({
    quiz_title: String,
    questions:{
        type: [
            {
                input_description: {
                    type: String,
                    default: "Question 1",
                },
                thumbnail: {
                    type: String,
                    default: " ",
                },
                inputQuestion: {
                    type: String,
                    default: "Question 1",
                },
                answer_content: {
                    type: [
                        {
                            answerNumber: {
                                type: String,
                                default: "1",
                            },
                            input_answer: {
                                type: String,
                                default: "Answer 1",
                            },
                            is_correct: String
                        },
                    ],
                    default: [
                        {
                            answerNumber: "1",
                            input_answer: "Answer 1",
                        },
                    ],
                },
            },
        ],
        default: [
            {
                input_description: "Question 1",
                thumbnail: " ",
                inputQuestion: "Question 1",
                answer_content: [
                    {
                        answerNumber: "1",
                        input_answer: "Answer 1",
                        is_correct: String
                    },
                ],
            },
        ],
    },
}, {
	timestamps: true
})
const ManageQuestion = mongoose.model('ManageQuestion', manageQuestionsSchema, "manage-questions");
module.exports = ManageQuestion
