import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'
// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form")
if (formSendData) {
    formSendData.addEventListener("submit", (e) => {
    	e.preventDefault()
    	const content = e.target.elements.content.value
    	if (content) {
            socket.emit("CLIENT_SEND_MESSAGE", content)
        	e.target.elements.content.value = ""
			// Fix: Typing
			socket.emit("CLIENT_SEND_TYPING", "hidden")
			//End
    	}
	})
 
}
// End CLIENT_SEND_MESSAGE
// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
	const myId = document.querySelector("[my-id]").getAttribute("my-id")
	const body = document.querySelector(".chat .inner-body")
	const boxTyping = document.querySelector(".inner-list-typing")
	const div = document.createElement("div")
 
	let htmltFullname = ""
 
	if (myId == data.userId) {
        div.classList.add("inner-outgoing")
	} else {
        div.classList.add("inner-incoming")
        htmltFullname = `<div class="inner-name">${data.fullname}</div>`
	}
 
    div.innerHTML = `
        ${htmltFullname}
    	<div class="inner-content">${data.content}</div>
	`
    body.insertBefore(div, boxTyping)
	
	body.scrollTop = bodyChat.scrollHeight
})
 
//  END SERVER_RETURN_MESSAGE

// Scroll Chat to Bottom
const bodyChat = document.querySelector(".chat .inner-body")
if(bodyChat){
	bodyChat.scrollTop = bodyChat.scrollHeight
}
// End Scroll Chat to Bottom

// Show typing
var timeOut
const showTyping = () => {
	socket.emit("CLIENT_SEND_TYPING", "show")
	// Fix: hien quai ko tat

	clearTimeout(timeOut)
	
	timeOut = setTimeout(()=>{
		socket.emit("CLIENT_SEND_TYPING", "hidden")
	}, 3000)
	// End
}
// End Show typing

// emoji-picker

// Show Pop up
const buttonIcon = document.querySelector(".button-icon")
if(buttonIcon){
	
	const tooltip = document.querySelector('.tooltip')
	Popper.createPopper(buttonIcon, tooltip)

	buttonIcon.onclick = () => {
		tooltip.classList.toggle('shown')
	  }
}
// End Show Pop up
const emojiPicker = document.querySelector("emoji-picker")

// Insert Icon To Input
if(emojiPicker){
	const inputChat = document.querySelector(".chat .inner-form input[name='content']")
	emojiPicker.addEventListener("emoji-click", (event)=>{
		const icon = event.detail.unicode
		inputChat.value = inputChat.value + icon

		const end = inputChat.value.length
		inputChat.setSelectionRange(end, end)
		inputChat.focus()

		showTyping()
	})
	// Typing
	var timeOut
	inputChat.addEventListener("keyup", ()=>{
		showTyping()
	})
	// End Typing
}

// End Insert Icon To Input

// End emoji-picker

// SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing")

if(elementListTyping){
	socket.on("SERVER_RETURN_TYPING", (data)=>{
		if(data.type == "show"){
			//Fix: hienj ra qua nhieu typing
			const existTyping = elementListTyping.querySelector(`[user-id="${data.userId}"]`)
			// End
			if(!existTyping){
				const bodyChat = document.querySelector(".chat .inner-body")
				const boxTyping = document.createElement("div");
				boxTyping.classList.add("box-typing")
				boxTyping.setAttribute("user-id", data.userId)
				boxTyping.innerHTML = `
					<div class="inner-name">${data.fullname}</div>
					<div class="inner-dots">
						<span></span>  
						<span></span>   
						<span></span> 
					</div>
				`
				elementListTyping.appendChild(boxTyping)
				bodyChat.scrollTop = bodyChat.scrollHeight
			}
		}else{
			const boxTypingRemove = elementListTyping.querySelector(`[user-id="${data.userId}"]`)
			if(boxTypingRemove){
				elementListTyping.removeChild(boxTypingRemove)
			}
		}
		
	})
}	
// END SERVER_RETURN_TYPING

