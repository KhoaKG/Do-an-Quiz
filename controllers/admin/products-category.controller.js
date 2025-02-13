const ProductsCategory = require("../../model/products-category.model")
const systemConfig = require("../../config/system")
const createTreeHelper = require("../../helper/createTree")
// [GET]: /admin/products-category
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    }
    const records = await ProductsCategory.find(find)
    const newRecords = createTreeHelper.tree(records)
    res.render("admin/pages/products-category/index",{
        pageTitle: "Trang danh mục sản phẩm",
        records: newRecords
    })
}


// [GET]: /admin/products-category/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false,
    }

    const records = await ProductsCategory.find(find)
    const newRecords = createTreeHelper.tree(records)
    res.render("admin/pages/products-category/create",{
        pageTitle: "Trang tạo danh mục sản phẩm",
        records: newRecords
    })
} 


// [POST]: /admin/products-category/create
module.exports.createPost = async (req,res) =>{
    if(req.body.position == ""){
        const countProducts = await ProductsCategory.countDocuments()
        req.body.position = countProducts + 1
    }else{
        req.body.position = parseInt(req.body.position)
    }
    const record = new ProductsCategory(req.body)
    await record.save()
    res.redirect(`${systemConfig.prefixAdmin}/products-category`)
}
