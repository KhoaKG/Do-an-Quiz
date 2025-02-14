const BlogsCategory = require("../../model/blogs-category.model")
const systemConfig = require("../../config/system")
const createTreeHelper = require("../../helper/createTree")
const Account = require("../../model/accounts.model")
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    }
    const records = await BlogsCategory.find(find)
    for(const record of records){
        // Lấy ra thông tin người tạo
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
    const newRecords = createTreeHelper.tree(records)
    res.render('admin/pages/blogs-category/index',{
        pageTitle: "Trang danh mục bài viết",
        records: newRecords
    })
}

// [GET]: /admin/blogs-category/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false,
    }
    const records = await BlogsCategory.find(find)
    const newRecords = createTreeHelper.tree(records)
    res.render("admin/pages/blogs-category/create",{
        pageTitle: "Trang tạo danh mục bài viết",
        records: newRecords
    })
} 


// [POST]: /admin/blogs-category/create
module.exports.createPost = async (req,res) =>{
    if(req.body.position == ""){
        const countProducts = await BlogsCategory.countDocuments()
        req.body.position = countProducts + 1
    }else{
        req.body.position = parseInt(req.body.position)
    }
    req.body.createdBy = {
        account_id: res.locals.user.id,
    }
    
    const record = new BlogsCategory(req.body)
    await record.save()
    res.redirect(`${systemConfig.prefixAdmin}/blogs-category`)
}

module.exports.edit = async (req, res) => {
    const id = req.params.id
    const data = await BlogsCategory.findOne({ _id: id }, {deleted: false })
    // Lấy ra data để gán cho danh mục cha
    const records = await BlogsCategory.find({
        deleted: false,
    })
    const newRecords = createTreeHelper.tree(records)
    // End Lấy ra data để gán cho danh mục cha
    res.render("admin/pages/blogs-category/edit",{
        pageTitle: "Chỉnh sửa danh mục bài viết",
        data: data,
        records: newRecords
    })
} 

// [PATCH]: /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id
    
    req.body.position = parseInt(req.body.position)
    
    try {
        const updatedBy = {
            account_id: res.locals.user.id,
            updateAt: new Date()
        }
        await BlogsCategory.updateOne({_id: id}, {
            ...req.body,
            $push: {updatedBy: updatedBy}
        })

    } catch (error) {
        req.flash("error", `Cập nhật thất bại`)
    }
    res.redirect(`${systemConfig.prefixAdmin}/blogs-category`)
} 

module.exports.deleteItem = async (req,res) =>{
    const id = req.params.id
    await BlogsCategory.updateOne({_id: id},{
        deleted: true,
        deletedBy:{
            account_id: res.locals.user.id,
            deleteAt: new Date()
        }
    })

    req.flash("success", "Cập nhật status thành công")
    res.redirect("back")
}

module.exports.changeStatus = async (req, res)=>{
    const status = req.params.status
    const id = req.params.id
    const updatedBy = {
        account_id: res.locals.user.id,
        updateAt: new Date()
    }
    await BlogsCategory.updateOne({_id: id},{status: status, $push: {updatedBy: updatedBy}}, )

    req.flash("success", "Cập nhật status thành công")
    res.redirect("back")
}