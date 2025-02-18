const Product = require("../../model/products.model");
const Answers = require("../../model/answer.model")
const User = require("../../model/users.model")
module.exports.index = async (req, res) => {
    const tokenUser = req.cookies.tokenUser
    const products = await Product.find({
        deleted: false,
        status: "active"
    })
    answersByUserId = await Answers.find({
        tokenUser: tokenUser
    })
    const result = [];

for (let i = 0; i < answersByUserId.length; i++) {
    const quizTitle = answersByUserId[i].quiz_title;
    if (!quizTitle) {
        console.log('Quiz title không hợp lệ:', quizTitle);
        continue;
    }

    const product = products.find(item => item.slug === quizTitle);

    if (product) {
        result.push({
            slug: product.slug, // Chỉ lấy slug từ product
            ...answersByUserId[i]._doc
        });
    } else {
        result.push({
            ...answersByUserId[i]._doc // Nếu không tìm thấy product, chỉ lấy dữ liệu từ answer
        });
    }
}

    const reversedResult = result.reverse();
    
    // Lấy ra tên 
    for(const product of reversedResult){
        // Lấy ra thông tin người tạo
        const user = await User.findOne({
            tokenUser: product.tokenUser
        })
        if(user){
            product.accountFullname = user.fullname
        }
        const products = await Product.findOne({
            slug: product.quiz_title,
        });
        product.title = products.title 
    }
    // End
    
    
    res.render("client/pages/answer/index", {
        pageTitle: "Danh sách bài đã luyện tập ",
        dataAnswers: reversedResult
    });
}