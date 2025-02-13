const Product = require("../../model/products.model")
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }
    const products = await Product.find(find)
    const newProducts = products.map(item=>{
        item.priceNew = (item.price*(100 - item.discountPercentage)/100).toFixed()
        return item
    })

    res.render('client/pages/products/index', { 
        title: 'Hey', 
        products: newProducts
    })
}

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted:false,
            slug: req.params.slug,
            status: "active"
        }
        const product = await Product.findOne(find)
        res.render("client/pages/products/detail",{
            pageTitle: product.title,
            product: product
        })
    } catch (error) {
        res.redirect(`/products`)
    }
}
