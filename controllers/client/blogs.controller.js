const Blog = require("../../model/blogs.model")
const productsHelper = require("../../helper/products")
const BlogsCategory = require("../../model/blogs-category.model")
const ProductsCategory = require("../../model/products-category.model")
const productsCategoryHelper = require("../../helper/products-category")
const blogsCategoryHelper = require("../../helper/blogs-category")
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
        status: "active"
    }
    const blogs = await Blog.find(find)

    res.render('client/pages/blogs/index', { 
        title: 'Hey', 
        blogs: blogs
    })
}

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted:false,
            slug: req.params.slugProduct,
            status: "active"
        }
        const product = await Blog.findOne(find)
        if(product.blog_category_id){
            const category = await BlogsCategory.findOne({
                _id: product.blog_category_id,
                status: "active",
                deleted: false
            })
            product.category = category
        }
        res.render("client/pages/blogs/detail",{
            pageTitle: product.title,
            product: product
        })
    } catch (error) {
        res.redirect(`/blogs`)
    }
}


// [GET] /products/:slug
module.exports.category = async (req, res) => {
    const category = await BlogsCategory.findOne({
        slug: req.params.slugCategory,
	    status: "active", 
        deleted: false
    })
    const listSubCategory = await blogsCategoryHelper.getSubCategory(category.id)
    const listSubCategoryId =  listSubCategory.map(item=>item.id)

    const blogs = await Blog.find({
        blog_category_id: {$in: [category.id, ...listSubCategoryId]},
        deleted: false,
        status: "active"
    }).sort({position: "desc"})

    res.render("client/pages/blogs/index",{
        pageTitle: category.title,
        blogs: blogs
    })
}
