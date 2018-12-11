const form = document.querySelector("form");
const userName = document.querySelector("[type=text]");
const difficulty = Array.from(document.querySelectorAll("[type=radio]"));
const targets = Array.from(document.querySelectorAll(".targets")); 
const span = document.querySelector("span");
const grabLeaderboard = document.querySelector(".leaderboard ul");
const resetLeaderboard = document.querySelector(".leaderboard button");
let score = 0;
let finalScore = 0;
let isClicked = false;
let countTime = 0;
const leaderboardArray = JSON.parse(localStorage.getItem("items")) || [];

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

//gets a random target which will rotateX from 0deg to 90deg
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

//this function sets the static/beginning state of the targets
function staticTarget () {
    //beginning state of static, where the rotateX is 0deg or "open"
    targets.forEach(target => target.classList.add("static"));

    //after 1 sec, the targets disappear and game begins
    setTimeout(() => {
        targets.forEach(target => target.classList.remove("static"));
    },1000)
}

//when the start button is clicked, everything runs (This is the key function)
function handleSubmit(e) {
    //this stops the form from refreshing
    e.preventDefault(); 
    // clearInterval(gameOn);
    const leaderboard = {};
    const name = userName.value;

    //this is a function call where the original target state has the targets shown, then after 1sec, the targets disappear and the game begins
    staticTarget();

    //resets the gameOver boolean, countTime increment and displays score to zero
    gameOver = false;
    countTime = 0;
    score = 0;
    span.textContent = score;

    //looks through the radio buttons for the checked one and returns the value. If none are checked, default to medium
    const level = difficulty.filter(value => value.checked)
        .map(value => value.value)
        .toString() || "medium";

    //loops through the randomTarget function until countTime has incremented to 5
    const gameOn = setInterval(() => {
        countTime++;
        if(countTime === 5) {
            clearInterval(gameOn);
            setTimeout(() => {
                leaderboard.name = name;
                leaderboard.finalScore = score;
                leaderboardArray.push(leaderboard);
                localStorage.setItem("items", JSON.stringify(leaderboardArray));
                displayLeaderboard(leaderboardArray);
                
                //after the game is over, resets score to zero and displays
                score = 0;
                span.textContent = score;
                
                //add static class back to targets
                targets.forEach(target => target.classList.add("static"));
            }, 2000);
        }
        isClicked = false;
        randomTarget(level);
    },2000);

    //this removes the text in the input after submit
    this.reset(); 
}

//this handles the clicking of targets, counts and adds to DOM
function handleScore (e) {
    //if the div has a class of static, don't allow click to increase score
    if(this.matches(".static")) return;

    //when clicking on the target, we're isolating for the font-awesome only
    if(!e.target.matches("i")) return;

    //score is only counted if the original isClick = false, but becomes true after one click and counting stops
    if(!isClicked) score++;
    isClicked = true;
    span.textContent = score;
}

//this takes the leaderboardArray to sort it, map it and display to DOM
function displayLeaderboard (array) {
    const display = array
        //this method pushes the highest scores to the top and lowest to the bottom
        .sort((a,b) => {
            if(a.finalScore > b.finalScore) {
                return -1;
            }
            else {
                return 1;
            }
        })
        //displays the name and score to the DOM
        .map(leader => {
            return `
                <li>${leader.name} ${leader.finalScore}</li>
            `;
        }).join("");
    grabLeaderboard.innerHTML = display;
}

//removes items from local storage and deletes contents from leaderboardArray and displays results
function handleReset () {
    localStorage.removeItem("items");
    leaderboardArray.length = 0;
    displayLeaderboard(leaderboardArray);
}

//display the leaderboard on page load, which should persist from local storage
displayLeaderboard(leaderboardArray);

//event listeners for forum on submit and clicking of targets
form.addEventListener("submit", handleSubmit);
targets.forEach(target => target.addEventListener("click", handleScore));
resetLeaderboard.addEventListener("click", handleReset);