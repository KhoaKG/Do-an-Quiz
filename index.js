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
const moment = require("moment")
const { Server } = require("socket.io");
const http = require('http');

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

app.locals.moment = moment

// Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://do-an-quiz-oc11-g8hgsufe9-kgs-projects-d7615528.vercel.app/",  // Thay bằng URL của client
    methods: ["GET", "POST"]
  }
});

 
global._io = io

// End


const route = require("./routes/client/index.route")
route(app)

const routeAdmin = require("./routes/admin/index.route")
routeAdmin(app)


app.get("*", (req, res) => {
  res.render("client/pages/errors/404", {
	pageTitle: "404 not found",
  })
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})