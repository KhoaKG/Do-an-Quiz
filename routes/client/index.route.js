const homeRoute = require("./home.route")
const productsRoute = require("./products.route")

module.exports = (app)=>{
    app.use("/", homeRoute)

    app.use("/products", productsRoute)
}