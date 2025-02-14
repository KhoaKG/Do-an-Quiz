const Role = require("../../model/roles.model")
const Account = require("../../model/accounts.model")
// [GET]: /admin/roles
module.exports.index = async (req, res) => {
    let find ={
        deleted: false
    }
    const records = await Role.find(find)
    // Lấy ra tên người thêm mới products
    for(const record of records){
        const user = await Account.findOne({
            _id: record.createdBy.account_id
        })
        if(user){
            record.accountFullname = user.fullname
        }
        // Lấy ra thông tin người câpj nhật gần nhất
        const updatedBy = record.updatedBy[record.updatedBy.length - 1]
        if(updatedBy){
            const userUpdated = await Account.findOne({
                _id: updatedBy.account_id
            })
            updatedBy.accountFullname = userUpdated.fullname
        }
    }
    // End

    res.render("admin/pages/roles/index",{
        pageTitle: "Trang nhóm quyền",
        records: records
    })
}
// [GET]: /admin/roles/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/roles/create",{
        pageTitle: "Trang tạo nhóm quyền"
    })
}
// [POST]: /admin/roles/create
module.exports.createPost = async (req, res) => {
    req.body.createdBy = {
        account_id: res.locals.user.id,
    }
    const records = new Role(req.body)
    await records.save()
    res.redirect("back")
}
// [GET]: /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id
        let find = {
            _id: id,
            deleted: false
        }
        const data = await Role.findOne(find)
        res.render("admin/pages/roles/edit",{
            pageTitle: "Trang sửa nhóm quyền",
            data: data
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`)
    }
}

// [PATCH]: /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id
    const updatedBy = {
        account_id: res.locals.user.id,
        updateAt: new Date()
    }
    await Role.updateOne({_id: id}, {
        ...req.body,
        $push: {updatedBy: updatedBy}
    })
    res.redirect(`back`)
}

// [GET]: /admin/roles/permissions
module.exports.permissions = async (req, res) => {
    let find ={
        deleted: false
    }
    const records = await Role.find(find)
    res.render("admin/pages/roles/permissions",{
        pageTitle: "Trang Phân quyền",
        records: records
    })
}

// [PATCH]: /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
    const permissions = JSON.parse(req.body.permissions)
    for (const item of permissions) {
        await Role.updateOne({_id: item.id}, {permissions: item.permissions})
    }
    res.redirect("back")
}

module.exports.deleteItem = async (req,res) =>{
    const id = req.params.id
    await Role.updateOne({_id: id},{
        deleted: true,
        deletedBy:{
            account_id: res.locals.user.id,
            deleteAt: new Date()
        }
    })

    req.flash("success", "Cập nhật status thành công")
    res.redirect("back")
}