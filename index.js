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
var cors = require('cors')
const redis = require('redis');
const RedisStore = require('connect-redis')(session);

app.set('views', `${__dirname}/views`)
app.set('view engine', 'pug')

app.use(express.static(`${__dirname}/public`))

database.connect()

app.locals.prefixAdmin = systemConfig.prefixAdmin

app.use(methodOverride('_method'))

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cookieParser('keyboard cat'));
const redisClient = redis.createClient({
 // Thay thế bằng địa chỉ Redis của bạn nếu không phải localhost
  port: 6379         // Cổng Redis, mặc định là 6379
});
app.use(session({
  cookie: { maxAge: 60000 },
  store: new RedisStore({ client: redisClient }),   // Sử dụng Redis để lưu trữ session
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.use(flash());

app.locals.moment = moment

app.use(cors())
// Socket.io
const server = http.createServer(app);
const io = new Server(server,{
  cors: {
    origin: "*"
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