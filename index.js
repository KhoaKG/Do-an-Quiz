const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT
const database = require("./config/database")
const systemConfig = require('./config/system')
var methodOverride = require('method-override')
var flash = require('express-flash')
const cookieParser = require("cookie-parser")
const session = require("express-session")


app.set('views', `${__dirname}/views`)
app.set('view engine', 'pug')

app.use(express.static(`${__dirname}/public`))

database.connect()

app.locals.prefixAdmin = systemConfig.prefixAdmin

app.use(methodOverride('_method'))

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());


const route = require("./routes/client/index.route")
route(app)

const routeAdmin = require("./routes/admin/index.route")
routeAdmin(app)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})