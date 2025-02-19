const Account = require("../../model/accounts.model")
const Role = require("../../model/roles.model")
const systemConfig = require("../../config/system")
const md5 = require('md5');

// [GET]: /admin/accounts
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    }
    const records = await Account.find(find).select("-password -token")
    for(const record of records){
        const role = await Role.findOne({
            _id: record.role_id,
            deleted: false
        })
        record.role = role
    }
    
    res.render("admin/pages/accounts/index",{
        pageTitle: "Trang accounts",
        records: records
    })
}


// [GET]: /admin/accounts/create
module.exports.create = async (req, res) => {
    const roles = await Role.find({
        deleted: false
    })
    res.render("admin/pages/accounts/create",{
        pageTitle: "Trang tạo accounts",
        roles: roles
    })
}
// [POST]: /admin/accounts/createPost
module.exports.createPost = async (req, res) => {
    const emailExist = await Account.findOne({
        email: req.body.email,
        deleted: false
    })
    if(emailExist){
        req.flash("error",`Email ${req.body.email} đã tồn tại!`)
        res.redirect("back")
    }else{
        req.body.password = md5(req.body.password)
        const records = new Account(req.body)
        await records.save()
        res.redirect(`${systemConfig.prefixAdmin}/accounts`)
    }   
}

// [GET] /admin/accounts/edit/: id
module.exports.edit = async (req, res) => {
    let find ={
        _id: req.params.id, 
        deleted: false,
    }
    try{
        const data = await Account.findOne(find);
        const roles = await Role.find({
            deleted: false,
        })
        
        res.render ("admin/pages/accounts/edit", {
            pageTitle: "Chỉnh sửa tài khoản",
            data: data, 
            roles: roles,
        });
    } catch (error){
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
}

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id
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
    res.redirect(`${systemConfig.prefixAdmin}/accounts`)
}

module.exports.changeStatus = async (req, res)=>{
    const status = req.params.status
    const id = req.params.id
    const updatedBy = {
        account_id: res.locals.user.id,
        updateAt: new Date()
    }
    await Account.updateOne({_id: id},{status: status, $push: {updatedBy: updatedBy}})
    req.flash("success", "Cập nhật status thành công")
    res.redirect("back")
}

module.exports.detail =async (req, res) => {
    const id = req.params.id
    const user = await Account.findOne({_id: id})
    res.render("admin/pages/accounts/detail",{
        pageTitle: "Trang chi tiết",
        user: user
    })
}
