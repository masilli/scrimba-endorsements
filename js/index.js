import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://endorsements-db-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const messagesInDB = ref(database, "endorsements")

const textArea = document.getElementById("input-area")
const publishButton = document.getElementById("publish-button")
const messageBoard = document.getElementById("msg-board")

publishButton.addEventListener("click", function() {
    publishMessage()
})

function publishMessage() {
    let textMsg = textArea.value
    
    if (textMsg !== "") {
        push(messagesInDB, textMsg);
        clearTextArea()
    } else {
        textArea.value = "add message here"
        setTimeout(function() {
            textArea.value = ""
        }, 500)
    }
}

function clearTextArea() {
    textArea.value = ""
}

onValue(messagesInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        clearMessages()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendMessageToBoard(currentItem)
        }    
    } else {
        messageBoard.innerHTML = "Nothing to see here... add some products to the list!"
    }
})

function clearMessages() {
    messageBoard.innerHTML = ""
}

function appendMessageToBoard(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("div")
    newEl.setAttribute("tabindex", "0")
    newEl.classList.add("message")
    
    newEl.textContent = itemValue
    
    // newEl.addEventListener("click", function() {
    //     let exactLocationOfItemInDB = ref(database, `endorsements/${itemID}`)
    //     newEl.classList.add("deleted")
    //     setTimeout(function() {
    //         remove(exactLocationOfItemInDB)
    //     }, 500)
    // })
    
    messageBoard.append(newEl)
}