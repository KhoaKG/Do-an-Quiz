const Account = require("../../model/accounts.model")
const systemConfig = require("../../config/system")
const md5 = require('md5');
// [GET]: /admin/my-account
module.exports.index = (req, res) => {
    res.render("admin/pages/my-account/index",{
        pageTitle: "Trang account"
    })
}

module.exports.edit = (req, res) => {
    res.render("admin/pages/my-account/edit",{
        pageTitle: "Trang account"
    })
}

module.exports.editPatch = async (req, res) => {
    const id = res.locals.user.id
    const emailExist = await Account.findOne({
        _id: {$ne: id},
        email: req.body.email,
        deleted: false
    })
    if(emailExist){
        req.flash("error",`Email ${req.body.email} đã tồn tại!`)
    }else{
        if(req.body.password){
            req.body.password = md5(req.body.password)
        }else{
            delete req.body.password
        }
        await Account.updateOne({_id: id}, req.body)
    
        req.flash("success", "Cập nhật tài khoản thành công!")
    }    
    res.redirect("back")
}
