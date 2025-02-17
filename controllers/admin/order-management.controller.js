const Order = require("../../model/order.model")
const Account = require("../../model/accounts.model")
const Product = require("../../model/products.model")
const productsHelper = require("../../helper/products")
module.exports.index = async (req, res) => {
    const orders = await Order.find({})
    // Lấy ra tên 
    for(const product of orders){
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
    res.render("admin/pages/order-management/index",{
        pageTitle: "Trang quản lý đơn hàng",
        orders: orders
    })
}

module.exports.deleteItem = async (req,res) =>{
    const id = req.params.id
    await Order.deleteOne({_id: id})

    req.flash("success", "Đã xóa đơn hàng")
    res.redirect("back")
}

module.exports.changeStatus = async (req, res)=>{
    const status = req.params.status
    const id = req.params.id
    const updatedBy = {
        account_id: res.locals.user.id,
        updateAt: new Date()
    }
    
    await Order.updateOne({_id: id},{status: status, $push: {updatedBy: updatedBy}}, )
    const order = await Order.findOne({
        _id: id
    })
    
    for(const item of order.products){
        const product = await Product.findOne({
            _id : item.product_id
        })
        const stock = product.stock - item.quantity
        await Product.updateOne({_id: item.product_id}, {stock: stock})
        
    }
    req.flash("success", "Cập nhật status thành công")
    res.redirect("back")
}

module.exports.detail = async (req, res) => {
    const order = await Order.findOne({
        _id: req.params.id
    })

    for (const product of order.products) {
        const productInfo = await Product.findOne({
            _id: product.product_id
        }).select("thumbnail title")

        product.productInfo = productInfo

        product.priceNew = productsHelper.priceNewProduct(product)

        product.totalPrice = product.priceNew * product.quantity
    }

    order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice, 0)


    res.render("admin/pages/order-management/detail", {
        pageTitle: "Trang chi tiết đơn hàng",
        order: order
    })
}