const form = document.querySelector("form");
const userName = document.querySelector("[type=text]");
const difficulty = Array.from(document.querySelectorAll("[type=radio]"));
//using Array.from to convert node list to array
const targets = Array.from(document.querySelectorAll(".targets")); 
const span = document.querySelector("span");
//setting a boolean which starts as false, but after a certain amount of time changes to true and the game stops
let gameOver = false;
let score = 0;
let isClicked = false;

//random index generator, depending on the size of the targets array
function randomIndex (array) {
    const index = Math.floor(Math.random() *array.length);
    return index;
}

//allows user to set mode of easy, medium and hard with different time ranges
function randomDuration(difficult) {
    const difficulty = {
        easy: {
            max: 2000,
            min: 1000
        },
        medium: {
            max:1500,
            min:500
        },
        hard:{
            max:500,
            min:300
        }
    }
    const duration = Math.floor(Math.random() * (difficulty[difficult].max - difficulty[difficult].min) + difficulty[difficult].min);
    return duration;
}

function randomTarget (level) {
    //generates a random index, depending on the number of targets
    const random = randomIndex(targets);

    //selects the target with the randomly generated index
    const target = targets[random];

    //add a class of "active" which sets a transform from 0 to 90deg
    target.classList.add("active");
    const duration = randomDuration(level);

    //after a random period of time, removes the active class
    setTimeout(() => {
        target.classList.remove("active");
    }, duration);
}

function handleSubmit(e) {
    //this stops the form from refreshing
    e.preventDefault(); 
    const value = userName.value;

    //looks through the radio buttons for the checked one and returns the value. If none are checked, default to medium
    const level = difficulty.filter(value => value.checked)
        .map(value => value.value)
        .toString() || "medium";
    
    randomTarget(level);
    //loops through the randomTarget function until gameOver boolean becomes true
    const gameOn = setInterval(() => {
        if(gameOver) {
            clearInterval(gameOn);
        }
        isClicked = false;
        randomTarget(level);
    },2000);

    //this sets the duration of how long the game goes, per click of the start button
    setTimeout(() => {
        gameOver = true;
    }, 10000)

    //this removes the text in the input after submit
    this.reset(); 
}

function handleScore (e) {
    if(!e.target.matches("i")) return;
    if(!isClicked) score++;
    isClicked = true;
    span.textContent = score;
}

form.addEventListener("submit", handleSubmit);
targets.forEach(target => target.addEventListener("click", handleScore));