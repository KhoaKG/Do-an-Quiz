const dashboardRoute = require("./dashboard.route")
const productsRoute = require("./products.route")
const productsCategory = require("./products-category.route")
const rolesRoute = require("./roles.route")
const accountsRoute = require("./accounts.route")
const systemConfig = require("../../config/system")
const authRoute = require("./auth.route")
const authMiddleware = require("../../middleware/admin/auth.middleware")
const blogsCategoryRoute = require("./blogs-category.route")
const blogsRoute = require("./blogs.route")
module.exports = (app)=>{
    const DATA_PATH = systemConfig.prefixAdmin
    app.use(DATA_PATH + "/dashboard", authMiddleware.requireAuth,dashboardRoute)

    app.use(DATA_PATH+ "/products", authMiddleware.requireAuth,productsRoute)

    app.use(DATA_PATH+ "/products-category", authMiddleware.requireAuth,productsCategory)

    app.use(DATA_PATH+ "/roles", authMiddleware.requireAuth,rolesRoute)

    app.use(DATA_PATH+ "/accounts", authMiddleware.requireAuth, accountsRoute)

    app.use(DATA_PATH+ "/blogs-category", authMiddleware.requireAuth, blogsCategoryRoute)
    
    app.use(DATA_PATH+ "/blogs", authMiddleware.requireAuth, blogsRoute)
    
    app.use(DATA_PATH+ "/auth", authRoute)
}