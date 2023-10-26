var element = document.getElementById("text_value");
const saveButton = document.getElementById('save_btn');
const readButton = document.getElementById('readButton');
const outputText = document.getElementById('outputText');
const dbButtons = document.getElementById('db_buttons');
let existingText = ""
let storedText = ""
let fileText = []
let savedArray = []

createSaved()

document.addEventListener('DOMContentLoaded', function() {
    
    saveButton.addEventListener('click', function() {
        
        const text = element.innerHTML;
        console.log(text)
        // Retrieve the existing text from localStorage and append the new text
        existingText = localStorage.getItem('myText') || '';
        existingText += text + '\n'; // Append a newline for separation

        // Store the updated text in localStorage
        localStorage.setItem('myText', existingText);
        //textInput.value = '';
        createSaved()
    });

    readButton.addEventListener('click', function() {
        // Simulate reading from a server or server-like storage (e.g., localStorage)
        // You can replace this with an actual server-side logic to read from a file.
        // For example, using Node.js on the server.
        // In this example, we'll use localStorage for simplicity.

        storedText = localStorage.getItem('myText');
        if (storedText) {
            outputText.textContent = storedText;
        } else {
            outputText.textContent = storedText;
        }
    });

});

function clearServer() {
    localStorage.removeItem('myText')
}

function createSaved() {
    savedArray = []
    if (localStorage.length !== 0) {
        fileText = localStorage.getItem('myText').split("\n")
        fileText.pop()
        fileText = removeDuplicatesAndEmpty(fileText)
        console.log("fileText:",fileText)
        
        for (let i = 0; i < fileText.length; i++) {
            savedArray.push(fileText[i])
        }
        console.log("savedArray:",savedArray)
        console.log(fileText[0] == savedArray[0])
    }
    displayButtons()
}

function removeDuplicatesAndEmpty(data) {
    return data.filter((value, i) => data.indexOf(value) === i && value.split("-")[1] !== "[]")
}

function displayButtons() {
    if (dbButtons) {
            dbButtons.innerHTML = '<a href="./solids.html?mySolid=[1.95,0.965,0.815,3.3,2.195,2.115,0.99,3.575,2.845,2.97,3.875,3.695,3.89,1.305,2.535,5.97,3.225,1.375]-[0,1,0,2,0,3,0,4,0,5,1,0,1,2,1,3,1,4,1,5,2,0,2,1,2,3,2,4,2,5,3,0,3,1,3,2,3,4,3,5,4,0,4,1,4,2,4,3,4,5,5,0,5,1,5,2,5,3,5,4]" target="_blank"><button class="sidebar_button font-lucida"><i class="fa-solid fa-dice-d6 icon"></i>Dis 4</button></a>'
        
        let content = ""

        for (let i = 0; i < savedArray.length; i++) {
            
            if (i <= 9) {
                let button = `<button class="sidebar_button font-lucida"><i class="fa-solid fa-dice-d6 icon"></i>Drawing ${i + 1}</button>`
                let a = `<a href="./solids.html?mySolid=${savedArray[i]}" target="_blank">${button}</a>`

                content = content + a
            }
        }
        dbButtons.innerHTML = content
    }
    
}