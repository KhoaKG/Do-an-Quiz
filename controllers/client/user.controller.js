const User = require("../../model/users.model")
const systemConfig = require("../../config/system")
const md5 = require('md5');
const generateHelper = require("../../helper/generate")
const ForgotPassword = require("../../model/forgot-password.model")
const sendMailHelper = require("../../helper/sendMail")
const Cart = require("../../model/cart.model")
const Order = require("../../model/order.model")
const Product = require("../../model/products.model")
const productsHelper = require("../../helper/products")

module.exports.register = async (req, res) => {
    res.render("client/pages/user/register", {
    	pageTitle: "Đăng ký tài khoản",
	})
}

module.exports.registerPost = async (req, res) => {
	const existEmail = await User.findOne({
    	email: req.body.email,
        deleted: false
	})
	if (existEmail) {
        req.flash("error", "Email đã tồn tại!")
        res.redirect("back")
    	return
	}
    req.body.password = md5(req.body.password)
	const user = new User(req.body)
	await user.save()
    res.cookie("tokenUser", user.tokenUser)
	res.redirect("/")
} 
module.exports.login = async (req, res) => {
    res.render("client/pages/user/login", {
        pageTitle: "Đăng nhập tài khoản",
	})
}
module.exports.loginPost = async (req, res) => {
	const email = req.body.email
	const password = req.body.password
	const user = await User.findOne({
    	email: email,
        deleted: false
	})
 
	if (!user) {
        req.flash("error", "Email ko tồn tại!")
        res.redirect("back")
    	return
	}
 
	if (md5(password) != user.password) {
        req.flash("error", "Password sai!")
        res.redirect("back")
    	return
	}
 
	if (user.status == "inactive") {
        req.flash("error", "Tài khoản đã bị khóa!")
        res.redirect("back")
    	return
	}
 
    res.cookie("tokenUser", user.tokenUser)

	// Lưu user_id vào collection carts
 
	await Cart.updateOne({
    	_id: req.cookies.cartId
	}, {
        user_id: user.id
	})
 
	// end
 
    res.redirect("/")
}

module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser")
    res.redirect("/")
}

module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/user/forgot-password", {
        pageTitle: "Lấy lại mật khẩu",
	})
}

module.exports.forgotPasswordPost = async (req, res) => {
	const email = req.body.email
	const user = await User.findOne({
    	email: email,
        deleted: false
	})
	if (!user) {
        req.flash("error", "Email ko tồn tại!")
        res.redirect("back")
    	return
	}
 
	// Việc 1: Tạo mã OTP và lưu OTP và email vào collection(forgotPassword
	const otp = generateHelper.generateRandomNumber(8)
	const objectForgotPassword = {
    	email: email,
    	otp: otp,
        expireAt: Date.now()
	}
 
	const forgotPassword = new ForgotPassword(objectForgotPassword)
	await forgotPassword.save()
 
	// Việc 2: Gửi mã OTP qua email của user
	const subject = `Mã OTP xác minh lấy lại mật khẩu`
	const html = `
    	Mã OTP xác minh lấy lại mật khẩu là: <b>${otp}</b>. Thời hạn là 3 phút. Lưu ý không được để lộ OTP.
	`
    sendMailHelper.sendMail(email, subject, html)

 
    res.redirect(`/user/password/otp?email=${email}`)
}

module.exports.otpPassword = async (req, res) => {
    const email = req.query.email
    res.render("client/pages/user/otp-password", {
        pageTitle: "Nhập mã OTP",
    	email: email
	})
}

module.exports.otpPasswordPost = async (req, res) => {
	const email = req.body.email
	const otp = req.body.otp
 
	const result = await ForgotPassword.findOne({
    	email: email,
    	otp: otp
	})
 
	if (!result) {
        req.flash("error", "OTP ko hợp lệ!")
        res.redirect("back")
    	return;
	}
 
	// Sau khi biết đúng là họ rồi -> tìm thông tin của họ để trả ra
	const user = await User.findOne({
    	email: email
	}
	)
 
    res.cookie("tokenUser", user.tokenUser)
 
    res.redirect("/user/password/reset")
}

module.exports.resetPassword = async (req, res) => {
    res.render("client/pages/user/reset-password", {
    	pageTitle: "Đổi mật khẩu",
	})
}
module.exports.resetPasswordPost = async (req, res) => {
	const password = req.body.password
	const tokenUser = req.cookies.tokenUser
 
	await User.updateOne({
    	tokenUser: tokenUser
	}, {
    	password: md5(password)
	})
 
	req.flash("success", "Đổi mật khẩu thành công!")
 
	res.redirect("/")
}

module.exports.info = async (req, res) => {
    res.render("client/pages/user/info", {
    	pageTitle: "Thông tin tài khoản",
	})
}


module.exports.myCourse = async (req, res)=>{	
    const orders = await Order.find({
        user_id: req.cookies.tokenUser
    })
	let totalInactive = 0
	for (const order of orders) {
		for (const product of order.products) {
			const productInfo = await Product.findOne({
				_id: product.product_id
			})
	
			product.productInfo = productInfo
		}
		if(order.status == "inactive"){
			for (const product of order.products) {
				totalInactive += product.quantity
			}
			
		}
    }
    
    
    res.render("client/pages/user/my-course",{
        pageTitle: "Quiz của tôi",
		orders: orders,
		totalInactive: totalInactive
    })
}