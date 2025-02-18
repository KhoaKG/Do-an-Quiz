const mongoose = require('mongoose');
const answersSchema = new mongoose.Schema({
    tokenUser: String,
    quiz_title: String,
    answers: [
      {
        questionId: String,
        answer: Number
      }
    ],
    createdBy:{
      user_id: String,
      createAt: {
          type: Date,
          default: Date.now
      }
  },
  }, {
    timestamps: true
})
const Answers = mongoose.model('Answers', answersSchema, "answers");
module.exports = Answers
