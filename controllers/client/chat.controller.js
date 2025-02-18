const Chat = require("../../model/chat.model")
const User = require("../../model/users.model")
module.exports.index = async (req, res) => {
	const userId = res.locals.user.id
	const fullname = res.locals.user.fullname
	// Socket.io
    _io.once('connection', (socket) => {
        socket.on("CLIENT_SEND_MESSAGE", async (content) => {
            const chat = new Chat({
  	          user_id: userId,
                content: content
        	})
            await chat.save()
 
        	// Trả về data cho Client
            _io.emit("SERVER_RETURN_MESSAGE", {
                userId: userId,
                fullname: fullname,
                content: content
        	})
 
    	})

		socket.on("CLIENT_SEND_TYPING", (type)=>{
			
			socket.broadcast.emit("SERVER_RETURN_TYPING",{
				userId: userId,
                fullname: fullname,
                type: type
			})
			
		})
	})
	// End Socket.io
 
	// Lấy ra data
	const chats = await Chat.find({
        deleted: false
	})
 
	for (const chat of chats) {
    	const infoUser = await User.findOne({
            _id: chat.user_id
        }).select("fullname")
 
        chat.infoUser = infoUser
	}
	// End
 
    res.render('client/pages/chat/index', {
    	title: 'Chat',
    	chats: chats
	})
}
