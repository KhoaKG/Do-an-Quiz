const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT
const database = require("./config/database")
const systemConfig = require('./config/system')
var methodOverride = require('method-override')
var flash = require('express-flash')
const cookieParser = require("cookie-parser")
var session = require('cookie-session');
const moment = require("moment")
const { Server } = require("socket.io");
const http = require('http');
var cors = require('cors')

app.set('views', `${__dirname}/views`)
app.set('view engine', 'pug')

app.use(express.static(`${__dirname}/public`))

database.connect()

app.locals.prefixAdmin = systemConfig.prefixAdmin

app.use(methodOverride('_method'))

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cookieParser('keyboard cat'));

app.use(session({
  cookie:{
      secure: true,
      maxAge:60000
         },
  secret: 'secret',
  saveUninitialized: true,
  resave: false
  }));

app.use(flash());

app.locals.moment = moment

app.use(cors())
// Socket.io
const server = http.createServer(app);
const io = new Server(server,{
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
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