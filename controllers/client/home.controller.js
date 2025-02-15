const Product = require("../../model/products.model")
const productsHelper = require("../../helper/products")
// [GET] /
module.exports.index = async (req, res) => {
    // Lấy ra sản phẩm nổi bật
    const productsFeatured = await Product.find({
        featured: "1",
        deleted: false,
        status: "active"
    })
    const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured)
    
    // End Lấy ra sản phẩm nổi bật
    // Hiển thị danh sách sản phẩm mới nhất
    const productsNew = await Product.find({
        deleted: false,
        status: "active"
    }).limit(6).sort({position: "desc"})
    const newProductsNew = productsHelper.priceNewProducts(productsNew)
    // End Hiển thị danh sách sản phẩm mới nhất

    res.render("client/pages/home/index",{
        pageTitle: "Trang chủ",
        productsFeatured: newProductsFeatured,
        productsNew: newProductsNew
    })
}
