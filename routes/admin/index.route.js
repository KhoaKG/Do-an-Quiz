const dashboardRoute = require("./dashboard.route")
const productsRoute = require("./products.route")
const productsCategory = require("./products-category.route")
const rolesRoute = require("./roles.route")
const accountsRoute = require("./accounts.route")
const systemConfig = require("../../config/system")
module.exports = (app)=>{
    const DATA_PATH = systemConfig.prefixAdmin
    app.use(DATA_PATH + "/dashboard", dashboardRoute)

    app.use(DATA_PATH+ "/products", productsRoute)

    app.use(DATA_PATH+ "/products-category", productsCategory)

    app.use(DATA_PATH+ "/roles", rolesRoute)

    app.use(DATA_PATH+ "/accounts", accountsRoute)
}