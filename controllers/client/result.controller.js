const Answers = require("../../model/answer.model")
const ManageQuestion = require("../../model/manage-questions.model");
const mongoose = require('mongoose');
module.exports.index = async (req, res) => {
    const paramsId = req.params.id
    const objectId = new mongoose.Types.ObjectId(paramsId);
    const dataAnswers = await Answers.findOne({ _id: objectId });
    const dataQuestion = await ManageQuestion.find({ quiz_title: String(dataAnswers.quiz_title) });

    const resultFinal = dataQuestion.map(question => {
        const answer = dataAnswers.answers.find(item => item.questionId.toString() === question._id.toString());
    
        return {
            ...question.toObject(),
            answers: question.answers || [], // Đảm bảo có `answers`
            answer: answer ? answer.answer : null, // Đáp án đã chọn
            correctAnswer: question.correctAnswer // Đáp án đúng
        };
    });
    let correctAnswers = 0;
    let totalQuestions = resultFinal.length
    // Tính số câu đúng và sai từ dataResult
    resultFinal.forEach(item => {
        if(item.correctAnswer == item.answer){
            correctAnswers++
        }
    });
    
    

    res.render("client/pages/result/index",{
        pageTitle: "Trang Kết Quả",
        dataResult: resultFinal,
        correctAnswers: correctAnswers,
        totalQuestions: totalQuestions
    })
}
