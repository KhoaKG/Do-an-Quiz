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
const RedisStore = require("connect-redis")(session)
const { createClient } = require("redis");

const redisClient = createClient({
  url: "redis://127.0.0.1:6379",
  legacyMode: true, // Chạy chế độ tương thích cũ
});
redisClient.connect().catch(console.error);
redisClient.on("error", (err) => {
  console.error("❌ Redis Error:", err);
});

redisClient.on("connect", () => {
  console.log("✅ Redis Connected!");
});

// Đảm bảo Redis kết nối xong rồi mới tạo session
redisClient.on("ready", () => {
  console.log("🔄 Redis Ready!");
});
app.set('views', `${__dirname}/views`)
app.set('view engine', 'pug')

app.use(express.static(`${__dirname}/public`))

database.connect()

app.locals.prefixAdmin = systemConfig.prefixAdmin

app.use(methodOverride('_method'))

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cookieParser('keyboard cat'));
const redisStore = new RedisStore({
  client: redisClient,
  prefix: "sess:",
});
app.use(
  session({
    store: redisStore,
    secret: "your-secret-key",  // Thay bằng chuỗi bí mật
    resave: false,  // Không lưu session nếu không thay đổi
    saveUninitialized: false,  // Không tạo session mới nếu không cần thiết
    cookie: { secure: false },  // Đặt thành `true` nếu chạy HTTPS
  })
);

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