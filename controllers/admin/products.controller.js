const Product = require("../../model/products.model")
const filterStatusHelper = require("../../helper/filterStatus")
const searchHelper = require("../../helper/search")
const paginationHelper = require("../../helper/pagination")
const systemConfig = require("../../config/system")
const ProductsCategory = require("../../model/products-category.model")
const createTreeHelper = require("../../helper/createTree")
const Account = require("../../model/accounts.model")
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }
    // Button Status
    if(req.query.status){
        find.status = req.query.status
    }
    const filterStatus = filterStatusHelper(req.query)
    // End Button Status

    // Search
        
    const objectSearch = searchHelper(req.query)
    if(objectSearch.regex){
        find.title = objectSearch.regex
    }
    // End Search
    // Pagination
    const countProducts = await Product.countDocuments(find)
    let objectPagination = paginationHelper({
        limitItems: 4,
        currentPage: 1
    }, req.query, countProducts)
    // End Pagination
    // Sort
    let sort ={};
    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue
    }else{
        sort.position = "desc"
    }
    // End Sort

    const products = await Product.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip).sort(sort)
    // Lấy ra tên 
    for(const product of products){
        // Lấy ra thông tin người tạo
        const user = await Account.findOne({
            _id: product.createdBy.account_id
        })
        if(user){
            product.accountFullname = user.fullname
        }
        // Lấy ra thông tin người câpj nhật gần nhất
        const updatedBy = product.updatedBy[product.updatedBy.length - 1]
        if(updatedBy){
            const userUpdated = await Account.findOne({
                _id: updatedBy.account_id
            })
            updatedBy.accountFullname = userUpdated.fullname
        }
        		
    }
    // End


    res.render('admin/pages/products/index', { 
        title: 'Hey',
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    })
}

module.exports.changeStatus = async (req, res)=>{
    const status = req.params.status
    const id = req.params.id
    const updatedBy = {
        account_id: res.locals.user.id,
        updateAt: new Date()
    }
    await Product.updateOne({_id: id},{status: status, $push: {updatedBy: updatedBy}})
    req.flash("success", "Cập nhật status thành công")
    res.redirect("back")
}
module.exports.changeMulti = async (req,res) =>{
    const type = req.body.type
    const ids = req.body.ids.split(" ")
    const updatedBy = {
        account_id: res.locals.user.id,
        updateAt: new Date()
    }
    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, { status: "active", $push: {updatedBy: updatedBy}});
            req.flash("success", "Cập nhật status thành công")
            break;
        case "inactive":
            await Product.updateMany({_id: {$in: ids}},{status: "inactive", $push: {updatedBy: updatedBy}},)
            req.flash("success", "Cập nhật status thành công")
            break; 
        case "delete-all":
            await Product.updateMany(
                {_id: {$in: ids}},
                {
                    deleted: true, 
                    // deletedAt: new Date()
                    deletedBy:{
                        account_id: res.locals.user.id,
                        deleteAt: new Date()
                    },
                    $push: {updatedBy: updatedBy}
                })
            req.flash("success", `Xoá thành công ${ids.length} sản phẩm`)
            break; 
        case "change-position":
            for(const item of ids){
                let[id,position] = item.split("-")
                position = parseInt(position)
                await Product.updateOne({_id: id},{position: position, $push: {updatedBy: updatedBy}},)
            }
            req.flash("success", "Cập nhật status thành công")
            break;
        default: 
            break;
    }
    res.redirect("back")
}
module.exports.deleteItem = async (req,res) =>{
    const id = req.params.id
    await Product.updateOne({_id: id},{
        deleted: true,
        deletedBy:{
            account_id: res.locals.user.id,
            deleteAt: new Date()
        }
    })

    req.flash("success", "Cập nhật status thành công")
    res.redirect("back")
}

// [GET]: /admin/products/create
module.exports.create = async (req,res) =>{
    let find = {
        deleted: false,
    }
    const category = await ProductsCategory.find(find)
    const newCategory = createTreeHelper.tree(category)
    res.render("admin/pages/products/create",{
        pageTitle: "Trang tạo sản phẩm",
        category: newCategory
    })
}

// [POST]: /admin/products/create
module.exports.createPost = async (req,res) =>{
    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)
    if(req.body.position == ""){
        const countProducts = await Product.countDocuments()
        req.body.position = countProducts + 1
    }else{
        req.body.position = parseInt(req.body.position)
    }
    req.body.createdBy = {
        account_id: res.locals.user.id,
    }
    const product = new Product(req.body)
    await product.save()
    res.redirect(`${systemConfig.prefixAdmin}/products`)
}

// [GET]: /admin/products/edit/:id
module.exports.edit = async (req,res) =>{
    try {
        const find = {
            deleted:false,
            _id: req.params.id
        }
        const category = await ProductsCategory.find({
            deleted: false,
        })
        const newCategory = createTreeHelper.tree(category)
    
        const product = await Product.findOne(find)
        res.render("admin/pages/products/edit",{
            pageTitle: "Trang chỉnh sửa sản phẩm",
            product: product,
            category: newCategory
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }
}

// [PATCH]: /admin/products/edit/:id
module.exports.editPatch = async (req,res) =>{
    const id = req.params.id
    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)
    req.body.position = parseInt(req.body.position)
    if(req.file){
        req.flash("success", `Cập nhật thành công`)
    }
    try {
        const updatedBy = {
            account_id: res.locals.user.id,
            updateAt: new Date()
        }
        await Product.updateOne({_id: id}, {
            ...req.body,
            $push: {updatedBy: updatedBy}
        })
    } catch (error) {
        req.flash("error", `Cập nhật thất bại`)
    }
    res.redirect(`${systemConfig.prefixAdmin}/products`)
}

// [GET]: /admin/products/detail/:id
module.exports.detail = async (req,res) =>{
    try {
        const find = {
            deleted:false,
            _id: req.params.id
        }
        const product = await Product.findOne(find)
        res.render("admin/pages/products/detail",{
            pageTitle: product.title,
            product: product
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }
}	