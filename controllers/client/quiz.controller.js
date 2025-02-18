const ManageQuestion = require("../../model/manage-questions.model");
const Answers = require("../../model/answer.model")
const Product = require("../../model/products.model")
module.exports.index = async (req, res) => {
    const quizTitle = req.params.slug
    const dataQuestion = await ManageQuestion.find({
        quiz_title: quizTitle
    })
    let title = ""
    for(const item of dataQuestion){
        const products = await Product.findOne({
            slug: item.quiz_title,
        });
        title = products.title     
    }
    res.render("client/pages/quiz/index",{
        pageTitle: "Trang Qiz",
        dataQuestion: dataQuestion,
        quizTitle: quizTitle,
        title
    })
}

module.exports.answers = async (req, res) => {
    const quiz_title  = req.params.slug;  // quiz_title từ body
    const tokenUser = req.cookies.tokenUser // Lấy tokenUser từ cookie

    // Biến đổi req.body thành mảng câu trả lời
    const selectedAnswers = Object.keys(req.body).map(questionId => ({
        questionId: questionId,
        answer: parseInt(req.body[questionId]) // Chuyển giá trị câu trả lời thành số
    }));

    // Tạo object options để lưu vào database
    const options = {
        tokenUser: tokenUser,
        quiz_title: quiz_title,
        answers: selectedAnswers,
        createdBy: {
            user_id: req.cookies.tokenUser,
        }
    };

    // Gọi model để lưu dữ liệu vào database
    const newAnswers = new Answers(options);

    await newAnswers.save();  // Lưu câu trả lời mới vào DB
    
    res.redirect(`/result/${newAnswers.id}`)
    
}
