const homeRoute = require("./home.route")
const productsRoute = require("./products.route")
const categoryMiddleware = require("../../middleware/client/category.middleware")
const blogsRoute = require("./blogs.route")
const searchRoute = require("./search.route")
const cartMiddleware = require("../../middleware/client/cart.middleware")
const cartRoute = require("./cart.route")
const checkoutRoute = require("./checkout.route")
module.exports = (app)=>{
    app.use(categoryMiddleware.category)

    app.use(categoryMiddleware.categoryBlogs)

    app.use(cartMiddleware.cartId)

    app.use("/",  homeRoute)

    app.use("/products", productsRoute)

    app.use("/blogs", blogsRoute)

    app.use("/search", searchRoute)

    app.use("/cart", cartRoute)

    app.use("/checkout", checkoutRoute)
}