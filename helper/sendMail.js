const nodemailer = require('nodemailer')
 
module.exports.sendMail = (email, subject, html) => {
	const transporter = nodemailer.createTransport({
    	service: "gmail",
    	auth: {
      	  // Tên đăng nhập gmail của mình
        	user: process.env.EMAIL_USER,
        	// Mật khẩu ứng dụng
        	pass: process.env.EMAIL_PASS
    	}
	});
 
	const mailOptions = {
    	// Tên đăng nhập gmail của mình
    	from: process.env.EMAIL_USER,
    	// Tên email người nhận
    	to: email,
    	// Tên tiêu đề
    	subject: subject,
    	// Nội dung: có thể dùng text hoặc html
    	html: html
	};
 
	transporter.sendMail(mailOptions, function (error, info) {
    	if (error) {
        	console.log(error);
    	} else {
        	console.log("Email sent: " + info.response);
    	}
	})
}
