// local variables decleration
let chatMessage, uName, passKey, loopExit, timerId = null
let FullScrElement = document.documentElement
let themeOut = "themeDefault",
    themeIn = "themeDefault"

// valid users
const validUser = [
    [26111995, 'Mis. Divya'],
    [26111999, 'Mr. Lokesh']
]

// authoncation || user identification || getting user name
do {
    passKey = prompt('Please enter Pass Key: ')
    if (validUser[0][0] == passKey || validUser[1][0] == passKey) {
        if (passKey == validUser[0][0]) {
            uName = validUser[0][1]
        } else {
            uName = validUser[1][1]
        }
        loopExit = "exit"
    }
} while (!loopExit)
document.querySelector('.userName').innerHTML = uName

// dom elements selection
const submitBtn = document.querySelector('#submitBtn')
const textarea = document.querySelector('#textarea')
const messageBox = document.querySelector('.message__box')
const typingDiv = document.querySelector('.typing')

// importing notification audio
let successSoud = "../media/audio/beep.mp3"
let successAudio = new Audio(successSoud)

// socket connection
const socket = io()

// Broadcast New Connected UserName To All Connected Users
socket.emit('userConnected', uName, uName + ' Connected...')

// getting chat msg on submit btn and broadcast
submitBtn.addEventListener('click', (e) => {
    e.preventDefault()
    chatMessage = textarea.value
    if (!chatMessage) {
        return
    }
    postChat(chatMessage)
})

function postChat(message) {
    // Message Validation And Filtration
    let Umessage = message.trim()

    let data = {
        username: uName,
        chat: Umessage
    }

    // Append to dom calling
    appendToDom(data, "outgoing", themeOut)

    // clearing textarea
    textarea.value = ''

    // Broadcast
    broadcastChat(data)

    // Sync with Mongo Db
    syncWithDb(data)

    // new msg notification audio
    successAudio.play()

    //scroll to last chat at very bottom 
    scrollToBottom()

}

// Append to dom decleration
function appendToDom(data, type, theme) {
    let lTag = document.createElement('li')
    lTag.classList.add('chats', 'messageCom', 'mb-3', type, theme)

    let markup = `
    <div class="card border-light mb-3">
        <div class="card-body">
            <h6>${data.username}</h6>
            <p>${data.chat}</p>
            <div>
                <img src="media/img/clock.png" alt="clock">
                <small>${moment(data.time).format('LT')}</small>
            </div>
        </div>
    </div>
    `

    lTag.innerHTML = markup

    messageBox.appendChild(lTag)
    scrollToBottom()
}

function broadcastChat(data) {
    socket.emit('chats', data)
}

socket.on('chats', (data) => {
    successAudio.play()
    appendToDom(data, "incomming", themeIn)
})

function debounce(func, timer) {
    if (timerId) {
        clearTimeout(timerId)
    }
    timerId = setTimeout(() => {
        func()
    }, timer)
}

// textarea user typing status
textarea.addEventListener('keyup', (e) => {
    socket.emit('typing', { uName })
})

socket.on('typing', (data) => {
    typingDiv.innerText = `${data.uName} is typing...`
    debounce(() => {
        typingDiv.innerText = ''
    }, 1000)
})

socket.on('userConnected', (uName, usermsg) => {
    let data = {
        username: uName,
        chat: usermsg,
    }
    appendToDom(data, "incomming", themeIn)
})

// Api calls
// syncWithDb - saving chats
function syncWithDb(data) {
    const headers = {
        'Content-Type': 'application/json'
    }
    fetch('/api/chats', { method: 'Post', body: JSON.stringify(data), headers })
        .then(response => response.json())
        .then(result => {
            console.log(result)
        })
}

// retreving data - fetchChats
function fetchChats() {
    fetch('/api/chats')
        .then(res => res.json())
        .then(result => {
            result.forEach((chat) => {
                chat.time = chat.createdAt
                if (uName == chat.username) {
                    appendToDom(chat, "outgoing", themeOut)
                } else {
                    appendToDom(chat, "incomming", themeIn)
                }
            })
        })
}

window.onload = fetchChats