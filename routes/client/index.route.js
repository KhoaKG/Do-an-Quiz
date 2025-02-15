const homeRoute = require("./home.route")
const productsRoute = require("./products.route")
const categoryMiddleware = require("../../middleware/client/category.middleware")
const blogsRoute = require("./blogs.route")
module.exports = (app)=>{
    app.use(categoryMiddleware.category)

    app.use(categoryMiddleware.categoryBlogs)

    app.use("/",  homeRoute)

    app.use("/products", productsRoute)

    app.use("/blogs", blogsRoute)
}