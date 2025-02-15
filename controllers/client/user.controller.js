const User = require("../../model/users.model")
const systemConfig = require("../../config/system")
const md5 = require('md5');
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
 
    res.redirect("/")
}

module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser")
    res.redirect("/")
}
