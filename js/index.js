import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://endorsements-db-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const messagesInDB = ref(database, "endorsements")

const freddie = document.querySelector(".freddie")

const textArea = document.getElementById("input-area")

const senderName = document.getElementById("sender-name")
const receiverName = document.getElementById("receiver-name")

const publishButton = document.getElementById("publish-button")
const messageBoard = document.getElementById("msg-board")

publishButton.addEventListener("click", function(e) {
    e.preventDefault()
    publishMessage()
})

function publishMessage() {
    let textMsg = textArea.value
    let senderValue = senderName.value
    let receiverValue = receiverName.value
    const completeMsg = {
        message: textMsg,
        sender: senderValue,
        receiver: receiverValue,
        likes: 0
    }
    
    if (textMsg.trim() === "" || senderValue.trim() === "" || receiverValue.trim() === "") {
        textArea.style.outline = "2px solid red"
        senderName.style.outline = "2px solid red"
        receiverName.style.outline = "2px solid red"
        setTimeout(function() {
            textArea.style.outline = "none"
            senderName.style.outline = "none"
            receiverName.style.outline = "none"
        }, 300)
        setTimeout(function() {
            textArea.style.outline = "2px solid red"
            senderName.style.outline = "2px solid red"
            receiverName.style.outline = "2px solid red"
        }, 600)
        setTimeout(function() {
            textArea.style.outline = "none"
            senderName.style.outline = "none"
            receiverName.style.outline = "none"
        }, 900)
    } else {
        push(messagesInDB, completeMsg)
        clearTextArea()
        freddie.classList.add("publish")
        setTimeout(function() {
            freddie.classList.remove("publish")
        }, 2000)
    }
}

onValue(messagesInDB, function(snapshot) {
    if (snapshot.exists()) {
        let endorsementsArray = Object.entries(snapshot.val())
    
        clearMessages()
        
        for (let i = endorsementsArray.length - 1; i >= 0; i--) {
            appendMessageToBoard(endorsementsArray[i])
        }    
    } else {
        messageBoard.innerHTML = "Nothing to see here..."
    }
})

function clearMessages() {
    messageBoard.innerHTML = ""
}

function clearTextArea() {
    textArea.value = ""
    senderName.value = ""
    receiverName.value = ""
}

function appendMessageToBoard(endorsement) {

    let endorsementID = endorsement[0]
    let endorsementFrom = endorsement[1].sender
    let endorsementTo = endorsement[1].receiver
    let endorsementMsg = endorsement[1].message
    let endorsementLikes = endorsement[1].likes

    let newMessage = document.createElement("div")
    newMessage.id = endorsementID

    newMessage.classList.add("endorsement")

    let msgHeader = document.createElement("div")
    msgHeader.classList.add("msg-header")
    msgHeader.innerHTML = `
        <div>from <span class="sender">${endorsementFrom}</span></div>
        <div>to <span class="receiver">${endorsementTo}</span></div>
    `
    newMessage.appendChild(msgHeader)

    let messageContent = document.createElement("div")
    messageContent.classList.add("message")
    messageContent.textContent = endorsementMsg
    newMessage.appendChild(messageContent)

    let msgFooter = document.createElement("div")
    msgFooter.classList.add("msg-footer")

    let likeButton = document.createElement("div")
    likeButton.classList.add("like-button")
    likeButton.textContent = "♥"
    msgFooter.appendChild(likeButton)

    let likeCounter = document.createElement("div")
    likeCounter.classList.add("like-counter")
    likeCounter.textContent = endorsementLikes
    msgFooter.appendChild(likeCounter)

    newMessage.appendChild(msgFooter)
    
    likeButton.addEventListener("click", function() {
        if(localStorage.getItem(endorsementID)) {
            console.log("already liked")
            likeButton.classList.add("liked")
        } else {
            endorsement[1].likes++
            update(ref(database, `endorsements/${endorsementID}`), endorsement[1])
            localStorage.setItem(endorsementID, "true")
            likeButton.classList.add("liked")
        }
    })

    messageBoard.append(newMessage)
}