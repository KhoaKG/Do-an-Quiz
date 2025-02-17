const Product = require("../../model/products.model")
const productsHelper = require("../../helper/products")
const ProductsCategory = require("../../model/products-category.model")
const productsCategoryHelper = require("../../helper/products-category")
const Order = require("../../model/order.model")
module.exports.index = async (req, res) => {
    try {
        let find = {
            deleted: false,
            status: "active"
        }
        const products = await Product.find(find)
        const newProducts = productsHelper.priceNewProducts(products)
    
        res.render('client/pages/products/index', { 
            title: 'Hey', 
            products: newProducts
        })
    } catch (error) {
        res.redirect(`/products`)
    }
    
}

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted:false,
            slug: req.params.slugProduct,
            status: "active"
        }
        const product = await Product.findOne(find)
        if(product.product_category_id){
            const category = await ProductsCategory.findOne({
                _id: product.product_category_id,
                status: "active",
                deleted: false
            })
            product.category = category
        }
        product.priceNew = productsHelper.priceNewProduct(product)
        
        let check = 0
        const orders = await Order.find({user_id: req.cookies.tokenUser, status: "active"})
        for(const order of orders){
            for(const item of order.products){
                if (item.product_id == product.id){
                    check = 1
                }
            }
        }
        res.render("client/pages/products/detail",{
            pageTitle: product.title,
            product: product,
            check: check
        })
    } catch (error) {
        res.redirect(`/products`)
    }
}


// [GET] /products/:slug
module.exports.category = async (req, res) => {
    const category = await ProductsCategory.findOne({
        slug: req.params.slugCategory,
	    status: "active", 
        deleted: false
    })
    if(category){
        const listSubCategory = await productsCategoryHelper.getSubCategory(category.id)
        const listSubCategoryId =  listSubCategory.map(item=>item.id)

        const products = await Product.find({
            product_category_id: {$in: [category.id, ...listSubCategoryId]},
            deleted: false
        }).sort({position: "desc"})

        const newProducts = productsHelper.priceNewProducts(products)
        res.render("client/pages/products/index",{
            pageTitle: category.title,
            products: newProducts,
        })
    }   else{
        res.redirect(`/products`)
        return
    }
}
