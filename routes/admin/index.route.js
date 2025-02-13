const dashboardRoute = require("./dashboard.route")
const productsRoute = require("./products.route")
const systemConfig = require("../../config/system")
module.exports = (app)=>{
    const DATA_PATH = systemConfig.prefixAdmin
    app.use(DATA_PATH + "/dashboard", dashboardRoute)

    app.use(DATA_PATH+ "/products", productsRoute)
}