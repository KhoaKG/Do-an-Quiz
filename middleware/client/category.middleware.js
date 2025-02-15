const ProductsCategory = require("../../model/products-category.model")
const createTreeHelper = require("../../helper/createTree")
module.exports.category = async (req,res,next) =>{
    const productsCategory = await ProductsCategory.find({
        deleted: false
    })
    const newProductsCategory = createTreeHelper.tree(productsCategory)
    res.locals.layoutProductsCategory = newProductsCategory
    next()
}
