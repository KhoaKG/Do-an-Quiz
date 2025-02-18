const homeRoute = require("./home.route")
const productsRoute = require("./products.route")
const categoryMiddleware = require("../../middleware/client/category.middleware")
const blogsRoute = require("./blogs.route")
const searchRoute = require("./search.route")
const cartMiddleware = require("../../middleware/client/cart.middleware")
const cartRoute = require("./cart.route")
const checkoutRoute = require("./checkout.route")
const userRoute = require("./user.route")
const userMiddleware = require("../../middleware/client/user.middleware")
const settingMiddleware = require("../../middleware/client/setting.middleware")
const chatRoute = require("./chat.route")
const authMiddleware = require("../../middleware/client/auth.middleware")
const quizRoute = require("./quiz.route")
const resultRoute = require("./result.route")
const answerRoute = require("./answer.route")
module.exports = (app)=>{
    app.use(categoryMiddleware.category)

    app.use(categoryMiddleware.categoryBlogs)

    app.use(cartMiddleware.cartId)

    app.use(userMiddleware.infoUser)
    
    app.use(settingMiddleware.settingGeneral)

    app.use("/",  homeRoute)

    app.use("/products", productsRoute)

    app.use("/blogs", blogsRoute)

    app.use("/search", searchRoute)

    app.use("/cart", cartRoute)

    app.use("/checkout", checkoutRoute)

    app.use("/user", userRoute)

    app.use("/chat", authMiddleware.requireAuth, chatRoute)

    app.use("/quiz", authMiddleware.requireAuth, quizRoute)

    app.use("/result", authMiddleware.requireAuth, resultRoute)

    app.use("/answers", authMiddleware.requireAuth, answerRoute)
}