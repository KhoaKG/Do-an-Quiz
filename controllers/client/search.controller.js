const Product = require("../../model/products.model")
const productsHelper = require("../../helper/products")
const Blog = require("../../model/blogs.model")
// [GET]: /search/
module.exports.index = async (req, res) => {
    const keyword = req.query.keyword
    let newProducts = []
    let newBlogs = []
    if(keyword){
        const keywordRegex = new RegExp(keyword, "i")
        const products = await Product.find({
            title: keywordRegex,
            status: "active",
            deleted: false
        })
        const blogs = await Blog.find({
            title: keywordRegex,
            status: "active",
            deleted: false
        })
        newBlogs=blogs
        newProducts = productsHelper.priceNewProducts(products)
    }
    res.render("client/pages/search/index",{
        pageTitle: "Kết quả tìm kiếm",
        keyword: keyword,
        products: newProducts,
        blogs: newBlogs
    })
}
