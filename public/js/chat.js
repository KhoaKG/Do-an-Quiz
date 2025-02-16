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
    	}
	})
 
}
// End CLIENT_SEND_MESSAGE
// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
	const myId = document.querySelector("[my-id]").getAttribute("my-id")
	const body = document.querySelector(".chat .inner-body")
 
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
    body.appendChild(div)
	
	body.scrollTop = bodyChat.scrollHeight
})
 
//  END SERVER_RETURN_MESSAGE

// Scroll Chat to Bottom
const bodyChat = document.querySelector(".chat .inner-body")
if(bodyChat){
	bodyChat.scrollTop = bodyChat.scrollHeight
}
// End Scroll Chat to Bottom

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
	})
}

// End Insert Icon To Input

// End emoji-picker