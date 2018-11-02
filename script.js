const form = document.querySelector("form");
const userName = document.querySelector("[type=text]");
const difficulty = Array.from(document.querySelectorAll("[type=radio]"));
//using Array.from to convert node list to array
const targets = Array.from(document.querySelectorAll(".targets")); 
const span = document.querySelector("span");
const grabLeaderboard = document.querySelector(".leaderboard ul");
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
    // clearInterval(gameOn);
    const leaderboard = {};
    const name = userName.value;

    //resets gameOver to false boolean everytime start button is hit
    gameOver = false;
    countTime = 0;

    //looks through the radio buttons for the checked one and returns the value. If none are checked, default to medium
    const level = difficulty.filter(value => value.checked)
        .map(value => value.value)
        .toString() || "medium";
    
    //right after start button, run the function once, then let interval kick in
    randomTarget(level);

    //loops through the randomTarget function until countTime has incremented to 5
    const gameOn = setInterval(() => {
        if(countTime === 5) {
            clearInterval(gameOn);
            setTimeout(() => {
                leaderboard.name = name;
                leaderboard.finalScore = score;
                leaderboardArray.push(leaderboard);
                localStorage.setItem("items", JSON.stringify(leaderboardArray));
                displayLeaderboard(leaderboardArray);
                score = 0;
            }, 2000);
        }
        isClicked = false;
        countTime++;
        randomTarget(level);
    },2000);

    //this removes the text in the input after submit
    this.reset(); 
}

function handleScore (e) {
    if(!e.target.matches("i")) return;
    if(!isClicked) score++;
    isClicked = true;
    span.textContent = score;
}

function displayLeaderboard (array) {
    const display = array
        .sort((a,b) => {
            if(a.finalScore > b.finalScore) {
                return -1;
            }
            else {
                return 1;
            }
        })
        .map(leader => {
            return `
                <li>${leader.name} ${leader.finalScore}</li>
            `;
        }).join("");
    grabLeaderboard.innerHTML = display;
}

displayLeaderboard(leaderboardArray);
form.addEventListener("submit", handleSubmit);
targets.forEach(target => target.addEventListener("click", handleScore));