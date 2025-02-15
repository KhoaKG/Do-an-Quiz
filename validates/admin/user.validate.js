module.exports.registerPost = (req, res, next) => {
	if (!req.body.fullname) {
        req.flash("error", "Vui lòng nhập Họ tên!")
        res.redirect("back")
    	return
	}
	if (!req.body.email) {
        req.flash("error", "Vui lòng nhập Email!")
        res.redirect("back")
    	return
	}
	if (!req.body.password) {
        req.flash("error", "Vui lòng nhập Mật khẩu!")
        res.redirect("back")
    	return
	}
	next()
}
module.exports.loginPost = (req, res, next) => {
	if (!req.body.email) {
        req.flash("error", "Vui lòng nhập Email!")
        res.redirect("back")
    	return
	}
	if (!req.body.password) {
        req.flash("error", "Vui lòng nhập Mật khẩu!")
        res.redirect("back")
    	return
	}
	next()
}

module.exports.forgetPasswordPost = (req, res, next) => {
	if (!req.body.email) {
        req.flash("error", "Vui lòng nhập Email!")
        res.redirect("back")
    	return
	}
	next()
}

module.exports.resetPasswordPost = (req, res, next) => {
	if (!req.body.password) {
        req.flash("error", "Vui lòng nhập Password!")
        res.redirect("back")
    	return
	}
 
	if (!req.body.confirmPassword) {
        req.flash("error", "Vui lòng xác nhận lại Password!")
        res.redirect("back")
    	return
	}
 
	if (req.body.password != req.body.confirmPassword) {
        req.flash("error", "Xác nhận mật khẩu không trùng khớp!")
        res.redirect("back")
    	return
	}
	next()
}

