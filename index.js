/* Screens */
const startScreen = document.querySelector("#start-screen");
const gamePlay = document.querySelector("#game-play");
const victoryScreen = document.querySelector("#victory-screen");
const gameOver = document.querySelector("#game-over");
/* Elements */
const button = document.querySelectorAll(".startGameBtn"); //arrayDeBotones
const alessandro = document.querySelector("#alessandro");
const catchCount = document.querySelector("#catchCount");
const timer = document.querySelector("#timeRemaining");
const gameArea = document.querySelector(".game-area");
const backgroundMusic = document.querySelector("#background-music");
const catchSound = document.querySelector("#catch-sound");
const gameOverMusic = document.querySelector("#gameOverMusic");
const victoryMusic = document.querySelector("#victoryMusic");
const quitButton = document.querySelector("#quit-button-mobile");
/* Logic elements */
let counter = 0;
let time = 60;
let timerId;
let moveInterval;
let currentSpeed = 1000;
backgroundMusic.load();

//This loop affects every button under the class "button", it gets the parent element of the clicked button and hides it, then shows the gameplay screen and make sure the game start with some elements reseted.

button.forEach((button) => {
  button.addEventListener("click", (click) => {
    // Get the parent screen of the clicked button
    const parentScreen = click.target.parentElement;
    // console.log('parent element',parentScreen)
    hideOrShowElement(parentScreen);
    hideOrShowElement(gamePlay);
    //reset values
    counter = 0;
    catchCount.textContent = `${counter}`;
    time = 60;
    updateTimer();
    currentSpeed = 1000;
    playMusic(backgroundMusic);
    startMovingAlessandro();
  });
});

alessandro.addEventListener("click", () => {
  console.log("Alessandro fue atrapado");
  ++counter;
  catchCount.textContent = `${counter}`;
  if (catchSound) {
    playMusic(catchSound, 0);
  }
  if (currentSpeed > 200) {
    currentSpeed -= 100;
  }
  adjustMusicSpeed(backgroundMusic);
  startMovingAlessandro();
});

//Keydown event to check if the user has press 'Q' or 'q'

document.addEventListener("keydown", function (event) {
  if (event.key === "q" || event.key === "Q") {
    handleQuit();
  }
});

//This event quit the game if the user click on the 'quit' button

quitButton.addEventListener("click", handleQuit); //function needs to be passed without ()

/* FUNCTIONS */

function hideOrShowElement(element) {
  element.classList.toggle("hidden");
}

/*
moveAlessandro moves Alessandro with a random position and add the random position with inline style. Added hideOrShow() to make alessandro appear or dissapear randomly. 
*/

function moveAlessandro() {
  const gameAreaWidth = gameArea.clientWidth;
  const gameAreaHeight = gameArea.clientHeight;

  const randomX = Math.floor(
    Math.random() * (gameAreaWidth - alessandro.clientWidth)
  );
  const randomY = Math.floor(
    Math.random() * (gameAreaHeight - alessandro.clientHeight)
  );

  alessandro.style.left = `${randomX}px`;
  alessandro.style.top = `${randomY}px`;

  hideOrShowElement(alessandro);
}

//Start the game, making sure that the intervals & counter are reset.

function startMovingAlessandro() {
  clearAllIntervals();
  catchCount.textContent = `${counter}`;
  moveInterval = setInterval(moveAlessandro, currentSpeed);
  timerId = setInterval(() => {
    gameLogic();
    updateTimer();
  }, 800);
}

function updateTimer() {
  timer.textContent = `${time}s`;
}

//gameLogic first check if the user has available time, if it doesn't, then hide gameplay screen and shows gameOver.
// If user has time available and counter is greater or equal to 10, then it hides gamePlay & shows the victory screen.

function gameLogic() {
  if (time > 0) {
    --time;
    if (counter >= 10) {
      backgroundMusic.pause();
      playMusic(victoryMusic);
      hideOrShowElement(gamePlay);
      hideOrShowElement(victoryScreen);
      clearAllIntervals();
    }
  } else {
    endGame();
  }
}
// Increase playback speed as currentSpeed decreases
// The playback rate will range from 1 (normal) to 2 (double speed)

function adjustMusicSpeed(music) {
  const minSpeed = 0.5;
  const maxSpeed = 2;
  const speedFactor = 1000 / currentSpeed;
  music.playbackRate = Math.min(maxSpeed, Math.max(minSpeed, speedFactor));
}

//playMusic with some adjustments.

function playMusic(mp3, currentTime = 0.3, playbackRate = 1, volume = 0.5) {
  mp3.currentTime = currentTime;
  mp3.playbackRate = playbackRate;
  mp3.volume = volume;
  mp3.play();
}

function endGame() {
  backgroundMusic.pause();
  playMusic(gameOverMusic);
  clearAllIntervals();
  hideOrShowElement(gamePlay);
  hideOrShowElement(gameOver);
}

// clearAllIntervals resets all intervals used on the game.
function clearAllIntervals() {
  clearInterval(moveInterval);
  clearInterval(timerId);
}

//handleQuit()
function handleQuit() {
  if (confirm("Do you want to quit the game?")) {
    endGame();
  }
}
