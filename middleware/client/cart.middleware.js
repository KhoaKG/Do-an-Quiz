const Cart = require("../../model/cart.model")
const Order = require("../../model/order.model")
module.exports.cartId = async (req,res, next)=>{
    if(!req.cookies.cartId){
        const cart = new Cart()
        await cart.save()
        console.log(cart); 
        const expiresTime = 1000 * 60 * 60 * 24 * 365
        res.cookie("cartId", cart.id, {
            expires: new Date(Date.now() + expiresTime)
        })
    }else{
        const cart = await Cart.findOne({
            _id: req.cookies.cartId
        })
        cart.totalQuantity = cart.products.reduce((sum,item)=> sum + item.quantity, 0)
        res.locals.minicart = cart

        const orders = await Order.find({
            user_id: req.cookies.tokenUser
        })
        let totalQuiz = 0
        for (const order of orders) {
            for (const product of order.products) {
                totalQuiz += product.quantity
            }
        }
        res.locals.totalQuiz = totalQuiz
    }   

    next()
}
