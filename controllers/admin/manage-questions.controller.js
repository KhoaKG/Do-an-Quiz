const ManageQuestion = require("../../model/manage-questions.model");
const Product = require("../../model/products.model");

module.exports.index = async (req, res) => {
    const products = await Product.find({
        deleted: false,
        status: "active"
    });
    res.render("admin/pages/manage-questions/index", {
        pageTitle: "Trang quản lý câu hỏi",
        products: products
    });
};

// Xử lý thêm câu hỏi mới
exports.addQuestion = async (req, res) => {
    try {
        let { type, questions, answers, correctAnswer } = req.body;
        if (!Array.isArray(questions)) {
            questions = [questions];  // Chuyển 'questions' thành một mảng
        }
        // Kiểm tra nếu dữ liệu không đầy đủ
        if (!questions || !answers || !correctAnswer) {
            return res.status(400).json({ success: false, message: 'Dữ liệu không đầy đủ' });
        }


        // Xử lý dữ liệu và chuyển thành định dạng mong muốn
        const questionsData = [];
        for (let i = 0; i < questions.length; i++) {
            // Xử lý câu hỏi
            const question = questions[i];
            const answerSet = answers.slice(i * 4, (i + 1) * 4);  // Mỗi câu hỏi có 4 câu trả lời
            
            // Nếu thiếu câu trả lời, có thể xử lý thêm hoặc trả về lỗi
            if (answerSet.length < 1) {
                return res.status(400).json({ success: false, message: 'Thiếu câu trả lời' });
            }

            let correctAnswerIndex = parseInt(correctAnswer[i]);  // Chuyển correctAnswer thành số nguyên
            if (isNaN(correctAnswerIndex) || correctAnswerIndex < 0 || correctAnswerIndex > 3) {
                return res.status(400).json({ success: false, message: 'Chỉ số câu trả lời đúng không hợp lệ' });
            }

            // Tạo đối tượng câu hỏi theo định dạng mong muốn
            const newQuestion = {
                quiz_title: type,   // Thêm quiz title (trang quiz)
                question: question, // Câu hỏi
                answers: answerSet, // Câu trả lời
                correctAnswer: correctAnswerIndex,   // Bạn có thể thay đổi logic này sau để chỉ định câu trả lời đúng
                id: i + 1           // ID của câu hỏi (tăng dần từ 1)
            };

            questionsData.push(newQuestion);
        }

        // Lưu tất cả câu hỏi vào cơ sở dữ liệu
        await ManageQuestion.insertMany(questionsData);
        res.redirect(`/admin/manage-questions/exams/${type}`)
    } catch (error) {
        res.send("Lôix")
    }
};


module.exports.exams = async (req, res) => {
    const products = await Product.find({
        deleted: false,
        status: "active"
    });
    
    res.render("admin/pages/manage-questions/exams", {
        pageTitle: "Trang quản lý đề thi",
        products: products
    });
};

module.exports.examsSlug = async (req, res) => {
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
    res.render("admin/pages/manage-questions/examsSlug",{
        pageTitle: "Trang",
        dataQuestion: dataQuestion,
        quizTitle: quizTitle,
        title: title
    })
}