const ProductsCategory = require("../../model/products-category.model")
const createTreeHelper = require("../../helper/createTree")
const BlogsCategory = require("../../model/blogs-category.model")
module.exports.category = async (req,res,next) =>{
    const productsCategory = await ProductsCategory.find({
        deleted: false
    })
    const newProductsCategory = createTreeHelper.tree(productsCategory)
    res.locals.layoutProductsCategory = newProductsCategory
    next()
}


module.exports.categoryBlogs = async (req,res,next) =>{
    const blogsCategory = await BlogsCategory.find({
        deleted: false
    })
    const newBlogsCategory = createTreeHelper.tree(blogsCategory)
    res.locals.layoutBlogsCategory = newBlogsCategory
    next()
}
