import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, remove, set, get, child, onValue } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js'

const firebaseConfig = {
    apiKey: "AIzaSyBVKFwohG2z1oRTtVqOeRpF5697ZIpionM",
    authDomain: "gym-rat-app.firebaseapp.com",
    databaseURL: "https://gym-rat-app-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "gym-rat-app",
    storageBucket: "gym-rat-app.appspot.com",
    messagingSenderId: "7072731987",
    appId: "1:7072731987:web:a4c340e94c615564a647a6"
};

const app = initializeApp(firebaseConfig);
const exercise = 'exercise'
const database = getDatabase(app)

const bigInputField = document.querySelector("#big-input-el")
const bigInputBtn = document.querySelector("#big-input-btn")
const exerciseUl = document.querySelector("#exercise-list")
const startBtn = document.querySelector("#start")
const exerciseDiv = document.querySelector(".exercise-content")
const progressDiv = document.querySelector(".progress-content")
const loadDiv = document.querySelector(".loading-screen")
let isMainPage = true; 

renderExerciseListDB()
//Add Value of Big Input to DB
bigInputBtn.addEventListener("click", function(){
    let inputValue = bigInputField.value.toUpperCase()
    addDataToDB(inputValue)
    renderExerciseListDB()
    bigInputField.value = ''
})

function addDataToDB(input,num=0){
    if(input){
        set(ref(database,`${exercise}/${input}`),{
            nameOfExercise: input,
            max:num
        })
        .then(()=>{
            alert("Exercise Added")
        })
        .catch((error)=>{
            console.log(error)
        })
    }
}

//Render Exercise List

function renderExerciseListDB(){
    let dbRef = ref(database)

    get(child(dbRef, `${exercise}`)).then((snapshot) => {
        if (snapshot.exists()) {
          let itemArray = Object.entries(snapshot.val())
          clearExerciseList()
          for(let i = 0; i < itemArray.length; i++){
            appendListItem(itemArray[i])
          }
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });
}

function clearExerciseList(){
    exerciseUl.innerHTML = ''
}

function appendListItem(input){
    let exerciseID = input[0]
    let exerciseValues = input[1]

    let newEl = document.createElement("li")

    newEl.textContent = exerciseID

    newEl.addEventListener("click",function(){
        hideExerciseContent()
        renderProgressArea(exerciseValues.max,exerciseValues.nameOfExercise)
    })
    exerciseUl.append(newEl)
}
//hide Exercise List
function hideExerciseContent(){
    exerciseDiv.style.display = "none"
}

function showExerciseContent(){
    renderExerciseListDB()
    clearExerciseList()
    isKg = true
    loadDiv.style.display = "flex"
    setTimeout(()=>{
        loadDiv.style.display = "none"
        exerciseDiv.style.display = "flex"
    },100)
    
}
let isKg = true
//Render Progress Area
function renderProgressArea(max, name){
    
    let exerEl = document.createElement('h1')
    let maxEl = document.createElement('h1')
    exerEl.textContent = `${name}`
    maxEl.textContent = `PR Max Weight: ${max.toFixed(1)}kg`

    let inputEl = document.createElement("input")
    inputEl.setAttribute("type", "text")
    inputEl.setAttribute("placeholder", "Enter PR in kg")

    let submitEl = document.createElement("button")
    submitEl.textContent = "Submit PR"

    let convertEl = document.createElement("button")
    convertEl.textContent = "Convert to lbs"

    let backEl = document.createElement("button")
    backEl.textContent = "Back"

    let deleteEl = document.createElement("button")
    deleteEl.textContent = "Delete Exercise"

    let resetEl = document.createElement("button")
    resetEl.textContent = "Reset PR"

    let precautionEl = document.createElement('h3')
    precautionEl.textContent = "(Danger Zone) Double Click To Press Buttons Below"

    //Add Progress Input to DB
    submitEl.addEventListener("click",function(){
        if(isKg){
            let newPR = parseInt(inputEl.value)
            if(newPR > max){
                addDataToDB(name,newPR)
                
            }else{
                alert("Not a PR, Keep Grinding lil bro")
            }
        }else{
            let newPR = parseInt(inputEl.value)*0.45359237
            if(newPR > max*0.45359237){
                addDataToDB(name,newPR)
                
            }else{
                alert("Not a PR, Keep Grinding lil bro")
            }
        }
       
        clearProgressArea()
        showExerciseContent()
    })
    //Delete Exercise
    deleteEl.addEventListener("dblclick",function(){
        remove(ref(database, `${exercise}/${name}`))
        alert("exercise is deleted")
        clearProgressArea()
        showExerciseContent()
    })
    //Reset PR
    resetEl.addEventListener("dblclick",function(){
        addDataToDB(name)
        clearProgressArea()
        showExerciseContent()
    })
    //Back Button
    backEl.addEventListener("click",function(){
        clearProgressArea()
        showExerciseContent()
    })
    //lbs to kg
    convertEl.addEventListener("click",function(){
        if(isKg){
            maxEl.textContent = `PR Max Weight: ${(max/0.45359237).toFixed(1)}lbs` 
            isKg = false
            convertEl.textContent = "Convert to kg"
            inputEl.setAttribute("placeholder", "Enter PR in lbs")
        }else{
            inputEl.setAttribute("placeholder", "Enter PR in kg")
            maxEl.textContent = `PR Max Weight: ${(max.toFixed(1))}kg` 
            isKg = true
            onvertEl.textContent = "Convert to lbs"
        }
        
    })

    progressDiv.append(exerEl, maxEl, inputEl, submitEl,convertEl, backEl,precautionEl, deleteEl, resetEl)
}


//Clear Progress Area
function clearProgressArea(){
    progressDiv.innerHTML = ''
}



