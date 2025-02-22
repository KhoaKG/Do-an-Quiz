const Cart = require("../../model/cart.model")
const Product = require("../../model/products.model")
const productsHelper = require("../../helper/products")
const Order = require("../../model/order.model")
module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId
    const cart = await Cart.findOne({
        _id: cartId
    })
    if(cart.products.length > 0){
        for(const item of cart.products){
            const productId = item.product_id
            const productInfo = await Product.findOne({
                _id: productId
            })
            
            productInfo.priceNew = productsHelper.priceNewProduct(productInfo)
            
            item.productInfo = productInfo
            item.totalPrice = item.quantity * productInfo.priceNew
        }
    }
    cart.totalPrice = cart.products.reduce((sum, item)=> {
        return sum + item.totalPrice
    }, 0)
    res.render("client/pages/checkout/index",{
        pageTitle: "Trang đặt hàng",
        cartDetail: cart
    })
}

module.exports.order = async (req, res) => {
    const cartId = req.cookies.cartId
    const userInfo = req.body
    const cart = await Cart.findOne({
        _id: cartId
    })
   const products = []	
    for(const product of cart.products){
        const objectProduct = {
            product_id: product.product_id,
            price: 0,
            discountPercentage: 0,
            quantity: product.quantity
        }
        const productInfo = await Product.findOne({
            _id: product.product_id
        })
        objectProduct.price = productInfo.price
        objectProduct.discountPercentage = productInfo.discountPercentage
        products.push(objectProduct)
    }
    const objectOrder = {
        cart_id: cartId,
        userInfo: userInfo,
        products: products,
        user_id: req.cookies.tokenUser
    }
    const order = new Order(objectOrder)
    await order.save()
    // Cập nhật lại giỏ hàng rỗng
    await Cart.updateOne({
        _id: cartId,
    },{
        products: []
    })
    
    res.redirect(`/checkout/success/${order.id}`)
}


module.exports.success = async (req, res) => {
    const order = await Order.findOne({
        _id: req.params.orderId
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


    res.render("client/pages/checkout/success", {
        pageTitle: "Trang đặt hàng thành công",
        order: order
    })
}


