const ManageQuestion = require("../../model/manage-questions.model")
const Product = require("../../model/products.model")
module.exports.index = async (req, res) => {
    const products = await Product.find({
        deleted: false,
        status: "active"
    })
    res.render("admin/pages/manage-questions/index",{
        pageTitle: "Trang quản lý câu hỏi",
        products: products
    })
}

module.exports.loadQuiz = async (req, res) => {
    const quizTitle = req.params.quizTitle
    const products = await Product.find({
        deleted: false,
        status: "active"
    })

    // Tìm record trong ManageQuestion với quiz_title tương ứng
    let record = await ManageQuestion.findOne({ quiz_title: quizTitle });
    // Nếu không có record nào, tạo một record mới
    if (!record) {
        record = new ManageQuestion({ quiz_title: quizTitle });
        await record.save();
        // Cập nhật lại record sau khi đã tạo
        record = await ManageQuestion.find({ quiz_title: quizTitle });
    }
    // console.log(record);
    
    res.render("admin/pages/manage-questions/index",{
        pageTitle: "Trang quản lý câu hỏi",
        products: products,
        record: record
    })
}

module.exports.addAnswer = async (req, res) => {
    const quizTitle = req.params.quizTitle
    const indexQuestion = parseInt(req.params.indexQuestion)
    const indexAnswer = parseInt(req.params.indexAnswer)
    const answer_content= 
        {
            answerNumber: indexAnswer + 2,
            input_answer: `Answer ${indexAnswer + 2}`
        }
;
    await ManageQuestion.updateOne(
        { 
            quiz_title: quizTitle
        },
        {
            $push: { 
                [`questions.${indexQuestion}.answer_content`]: answer_content // Dùng chỉ số indexQuestion để chỉ định câu hỏi
            }
        }
    );
    
    res.redirect("back")

}

module.exports.addQuestion = async (req, res) => {
    const quizTitle = req.params.quizTitle
    const indexQuestion = parseInt(req.params.indexQuestion)

    const questions = {
        input_description: `Question ${indexQuestion+2}`,
        thumbnail: ' ',
        inputQuestion: `Question ${indexQuestion+2}`,
        answer_content: [
            {
                answerNumber:"1",
                input_answer: "Answer 1"
            }
        ]
    }
    await ManageQuestion.updateOne({quiz_title: quizTitle}, {
        $push: {questions: questions}
    })
    res.redirect("back")

}
module.exports.editPatch = async (req, res) => {
    const inputQuestions = req.body.inputQuestion;  // Mảng các câu hỏi
    const answerContents = req.body.answerContent;  // Mảng các câu trả lời
    const iscorrect = req.body.iscorrect;  // Các câu trả lời đúng
    const quizTitle = req.params.quizTitle
    

    // Nhóm dữ liệu thành câu hỏi và câu trả lời
    const questions = inputQuestions.map((inputQuestion, indexQuestion) => {
        const answers = answerContents[indexQuestion] || [];  // Lấy các câu trả lời
        const correctAnswers = Array.isArray(iscorrect) && iscorrect[indexQuestion] ? iscorrect[indexQuestion] : [];  // Lấy câu trả lời đúng
        
        return {
            inputQuestion,  // Câu hỏi
            answer_content: answers.map((answer, indexAnswer) => ({
                input_answer: answer,  // Câu trả lời
                is_correct: correctAnswers.includes(answer)  // Kiểm tra câu trả lời đúng
            }))
        };
    });
    console.log(questions);
    
    try {
        // Cập nhật từng câu hỏi trong mảng questions
        await ManageQuestion.updateOne(
            { quiz_title: quizTitle },  // Tìm kiếm tài liệu dựa trên quiz_title
            { $set: { questions: questions } },  // Cập nhật mảng questions
        );
        for (const question of questions) {
            await ManageQuestion.updateOne(
                { quiz_title: quizTitle, 'questions.inputQuestion': question.inputQuestion },  // Tìm câu hỏi theo quiz_title và inputQuestion
                { 
                    $set: { 
                        'questions.$.inputQuestion': question.inputQuestion,  // Cập nhật inputQuestion
                        'questions.$.answer_content': question.answer_content  // Cập nhật answer_content
                    } 
                }
            );
        }

        // Gửi phản hồi sau khi hoàn thành tất cả các cập nhật
        res.redirect("back")

    } catch (err) {
        // Nếu có lỗi, gửi phản hồi và tránh gọi res.send nhiều lần
        console.error("Error updating quiz:", err);
        if (!res.headersSent) {
            res.status(500).send("Internal Server Error");
        }
    }
};