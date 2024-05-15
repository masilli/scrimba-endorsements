import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

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

publishButton.addEventListener("click", function() {
    publishMessage()
})

function publishMessage() {
    let textMsg = textArea.value
    let senderValue = senderName.value
    let receiverValue = receiverName.value
    const completeMsg = {
        textMsg: textMsg,
        sender: senderValue,
        receiver: receiverValue
    }
    
    if (textMsg !== "") {
        push(messagesInDB, completeMsg);
        clearTextArea()
        freddie.classList.add("publish")
        setTimeout(function() {
            freddie.classList.remove("publish")
        }, 3000)
    } else {
        textArea.value = ">> add message here"
        setTimeout(function() {
            textArea.value = ""
        }, 500)
    }
}

// onValue(messagesInDB, function(snapshot) {
//     if (snapshot.exists()) {
//         let itemsArray = Object.entries(snapshot.val())
    
//         clearMessages()
        
//         for (let i = 0; i < itemsArray.length; i++) {
//             let currentItem = itemsArray[i]
//             let currentItemID = currentItem[0]
//             let currentItemValue = currentItem[1]
            
//             appendMessageToBoard(currentItem)
//         }    
//     } else {
//         messageBoard.innerHTML = "Nothing to see here..."
//     }
// })

onValue(messagesInDB, function(snapshot) {
    if (snapshot.exists()) {

        clearMessages()
        
        snapshot.forEach((childSnapshot) => {

            const data = childSnapshot.val()
            const textMsg = data.textMsg
            const sender = data.sender
            const receiver = data.receiver

            appendMessageToBoard(textMsg, sender, receiver)
        })
    } else {
        messageBoard.innerHTML = "Nothing to see here..."
    }
})

function clearMessages() {
    messageBoard.innerHTML = ""
}

function clearTextArea() {
    textArea.value = ""
}

// function appendMessageToBoard(item) {
//     let itemID = item[0]
//     let itemValue = item[1]
    
//     let newEl = document.createElement("div")
//     newEl.setAttribute("tabindex", "0")
//     newEl.classList.add("message")
    
//     newEl.textContent = itemValue
    
//     messageBoard.append(newEl)
// }

function appendMessageToBoard(textMsg, sender, receiver) {
    let newEl = document.createElement("div")
    newEl.classList.add("message")
    
    newEl.textContent = `Sender: ${sender}, Receiver: ${receiver}, Message: ${textMsg}`
    
    messageBoard.append(newEl)
}