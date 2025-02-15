const homeRoute = require("./home.route")
const productsRoute = require("./products.route")
const categoryMiddleware = require("../../middleware/client/category.middleware")

module.exports = (app)=>{
    app.use(categoryMiddleware.category)

    app.use("/",  homeRoute)

    app.use("/products", productsRoute)
}