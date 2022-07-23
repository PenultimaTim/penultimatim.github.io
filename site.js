//--------------------------------
// Variables
//--------------------------------
var audioEnabled = false;
var players = [];
var stars = [];
var actionsAllowed = true;
var beanIsFloating = false;
var actionTimer = 0;
var width = window.innerWidth
var height = window.innerHeight
var beanX = -187;
var gameOver = false;

//--------------------------------
// HTML Objects
//--------------------------------
const ejectionDiv = document.getElementById("ejection");
const impostersRemainingDiv = document.getElementById("impostersRemaining");
const floatingBean = document.getElementById("floatingBean");

//--------------------------------
// Canvas Objects
//--------------------------------
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
canvas.width = width
canvas.height = height

//--------------------------------
// Parameters
//--------------------------------
const minStarSpeed = 1;
const maxStarSpeed = 3;
var maxActionTimer = canvas.width + 187;

const audio = new Audio('AmongUsBg.mp3')
audio.loop = true
const backgroundColor = '#000000'
let lastWidth = window.innerWidth
let lastHeight = window.innerHeight

const speed = 0.5


//--------------------------------
// Player Functions
//--------------------------------
function playersCreatePlayer(color, name, status) {
  var ejected = false;

  if (status.toUpperCase() == "REJECTED") {
    ejected = true;
  }

  const player = { id: players.length, color: color, name: name, status: status, imposter: false, ejected: ejected }
  players.push(player);
}

function playersGeneratePlayers() {
  playersCreatePlayer('Red', 'Savage', 'invited');
  playersCreatePlayer('Coral', 'Lordiggs', 'accepted');
  playersCreatePlayer('Pink', 'Timmmahh', 'accepted');
  playersCreatePlayer('Green', 'AiMani', 'invited');
  playersCreatePlayer('Purple', 'Tyler', 'invited');
  playersCreatePlayer('Lime', 'FuFu', 'invited');
  playersCreatePlayer('Black', 'Meathooks', 'invited');
  playersCreatePlayer('Yellow', 'Baaaaa', 'invited');
  playersCreatePlayer('Purple', 'Ashley', 'invited');
  playersCreatePlayer('Cyan', 'Mimi', 'invited');
  playersCreatePlayer('Orange', 'Nick', 'invited');
  playersCreatePlayer('Blue', 'Galaxy', 'invited');
  playersCreatePlayer('Banana', 'Oliver', 'accepted');
  playersCreatePlayer('Black', 'Daisuke', 'invited');
  playersCreatePlayer('White', 'Joe', 'rejected');
  players.sort(dynamicSortMultiple("status", "name"));
}

function playersAssignImposters() {
  var imposter1 = randomBetween(0, players.length - 1);
  var imposter2 = imposter1;
  while (imposter2 == imposter1) {
    imposter2 = randomBetween(0, players.length - 1);
  }

  players[imposter1].imposter = true;
  players[imposter2].imposter = true;

  impostersRemainingDiv.innerHTML = getImposterCount() + " imposters remaining.";
}

function playersHtmlInit() {
  let newHtml = '';

  players.forEach(function (player) {
    var status = player.status;
    if (player.ejected) {
      status = "REJECTED";
    }

    newHtml = newHtml + "<div class='attendee " + status + "' onmouseover='hoverPlayer(" + player.id + ")' onclick='voteOut(" + player.id + ");'>"

    newHtml =
      newHtml +
      "<img class='bean bean" + status + "' src='bean" +
      player.color +
      ".png' /><span class='strokeme " + status + "'>" +
      player.name +
      '</span>'

    if (player.status == 'accepted') {
      newHtml = newHtml + "<img class='thumbsup' src='accepted.png' />"
    }

    if (player.status == 'rejected') {
      newHtml = newHtml + "<img class='thumbsup' src='x.png' />"
    }

    newHtml = newHtml + '</div>'
  });

  return newHtml;
}

function playerHtml(player) {

}

function hoverPlayer(id) {
  var player = getPlayerFromId(id);
  if (!player.ejected) {
    playClick();
  }
}

function getPlayerFromId(id) {
  var playerFound = false;
  var player;
  var i = 0;

  while (!playerFound) {
    player = players[i];
    if (player.id == id) {
      playerFound = true;
    }
    i++;
  }

  return player;
}

stars.forEach(function (star) {
  const x = star.x
  const y = star.y
  const r = star.radius
  ctx.beginPath()
  ctx.fillStyle = 'rgb(255, 255, 255)'
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fill()
});

function updatePlayersHtml() {
  document.getElementById('attendees').innerHTML = playersHtmlInit();
}

function getImposterCount() {
  var imposterCount = 0;
  players.forEach(function (player) {
    if (player.imposter && !player.ejected) {
      imposterCount++;
    }
  });

  return imposterCount;
}

function getCrewmateCount() {
  var crewMateCount = 0;
  players.forEach(function (player) {
    if (!player.imposter && !player.ejected) {
      crewMateCount++;
    }
  });

  return crewMateCount;
}

function playersInit() {
  playersGeneratePlayers();
  playersAssignImposters();
  updatePlayersHtml();
}



//--------------------------------
// CanvasFunctions
//--------------------------------
function canvasCreateStar(x, y) {
  let radius = randomBetween(minStarSpeed, maxStarSpeed);
  let speed = (randomBetween(minStarSpeed, maxStarSpeed) / 10);
  const star = { x: x, y: y, radius: radius, speed: speed };
  return star;
}

function starsInit() {
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let rand = Math.random();
      if (rand <= 0.00003) {
        const star = canvasCreateStar(x, y, 5);
        stars.push(star);
      }
    }
  }
}

function pink() {
  message = "Pffft, you can't vote Pink out.";
  buildMessage(message);
}

function renderBackground() {
  ctx.fillStyle = backgroundColor
  ctx.fillRect(0, 0, width, height)
}

function renderStars() {
  stars.forEach(function (star) {
    const x = star.x
    const y = star.y
    const r = star.radius
    ctx.beginPath()
    ctx.fillStyle = 'rgb(255, 255, 255)'
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  });
}

function renderFloatingBean() {
  ctx.drawImage(floatingBean, beanX, canvas.height / 2);
}

function render() {
  renderBackground();
  renderStars();
  renderFloatingBean();
}

function handleBeanFloating() {
  if (beanIsFloating) {

    beanX = beanX + (6)
    if (beanX >= canvas.width) {
      ejectionDiv.innerHTML = "";
      beanIsFloating = false;
      beanX = -187;
    }
  }
}

//--------------------------------
// Actions
//--------------------------------
function voteOut(id) {
  if (gameOver == true) {
    return;
  }

  var player = getPlayerFromId(id);
  var color = player.color;
  var name = player.name;
  var imposter = player.imposter;

  if (player.ejected == true) {
    return;
  }

  if (actionsAllowed) {
    getPlayerFromId(1);
    actionsAllowed = false;

    if (color.toUpperCase() == "PINK") {
      pink();
      return;
    }

    // Eject the Person
    players.forEach(function (player) {
      if (player.id == id) {
        player.ejected = true;
      }
    });

    // Set Color
    floatingBean.src = "floatingBean" + color + ".png";


    message = name + " was ejected.";
    if (imposter) {
      message = message + " " + name + " was the imposter.";
    }
    else {
      message = message + " " + name + " was NOT the imposter.";
    }

    beanIsFloating = true;
    playKill();
    buildMessage(message);
    impostersRemainingDiv.innerHTML = getImposterCount() + " imposters remaining.";
    updatePlayersHtml();

    if (getImposterCount() >= getCrewmateCount()) {
      gameOver = true;
    } else if (getImposterCount() == 0) {
      gameOver = true;
    } else {
      console.log("STILL PLAYING");
    }
  }
}

function handleActionsAllowed() {
  if (!actionsAllowed) {
    actionTimer = actionTimer + (6);
    if (actionTimer >= maxActionTimer) {
      ejectionDiv.innerHTML = "";
      actionsAllowed = true;
      actionTimer = 0;
    }
  }
}

function playBackgroundMusic() {
  var audioImg = document.getElementById('audioImg')
  var imgSrc = audioImg.src

  if (imgSrc.includes('audioOff')) {
    // Turn On
    audioImg.src = 'audioOn.png'
    audioEnabled = true
    audio.play()
  } else {
    // Turn Off
    audioEnabled = false
    audio.pause()
    audioImg.src = 'audioOff.png'
  }
}

function playClick() {
  if (audioEnabled) {
    const audioClick = new Audio('AmongUsHover.mp3')
    audioClick.play()
  }
}

function playTextAppear() {
  if (audioEnabled) {
    const audioDeedle = new Audio('textAppear.mp3');
    audioDeedle.play();
  }
}

function playKill() {
  if (audioEnabled) {
    const audioKill = new Audio('kill.mp3');
    audioKill.play();
  }
}

//--------------------------------
// Utility Functions (some shamelessly stolen from web)
//--------------------------------
function randomBetween(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function dynamicSort(property) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    /* next line works with strings and numbers, 
     * and you may want to customize it to your needs
     */
    var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    return result * sortOrder;
  }
}

function dynamicSortMultiple() {
  /*
   * save the arguments object as it will be overwritten
   * note that arguments object is an array-like object
   * consisting of the names of the properties to sort by
   */
  var props = arguments;
  return function (obj1, obj2) {
    var i = 0, result = 0, numberOfProperties = props.length;
    /* try getting a different result from 0 (equal)
     * as long as we have extra properties to compare
     */
    while (result === 0 && i < numberOfProperties) {
      result = dynamicSort(props[i])(obj1, obj2);
      i++;
    }
    return result;
  }
}

function buildMessage(message) {
  playTextAppear();
  const messageLength = message.length;
  const timeTaken = 1500;
  const msPerLetter = timeTaken / messageLength;

  const startTime = Date.now();
  var lastLetterTime = startTime;
  var lettersShown = 1;

  var visibleMessage = message.substring(0, lettersShown);

  var myInterval = setInterval(function () {
    var currentTime = Date.now();

    if (currentTime - lastLetterTime >= msPerLetter) {
      // Show New Letter
      lettersShown++;
      visibleMessage = message.substring(0, lettersShown);
      ejectionDiv.innerHTML = visibleMessage;
      lastLetterTime = currentTime;
    }


    if (lettersShown >= message.length) {
      clearInterval(myInterval);
    }
  }, 1);
}

window.onresize = function () {
  width = window.innerWidth
  height = window.innerHeight

  canvas.width = width
  canvas.height = height

  maxActionTimer = canvas.width + 187;

  stars.forEach(function (star) {
    let currentStarX = star.x / lastWidth;
    let currentStarY = star.y / lastHeight;

    let newStarX = currentStarX * width;
    let newStarY = currentStarY * height;

    star.x = newStarX;
    star.y = newStarY;
  })

  lastWidth = width;
  lastHeight = height;

  render();
}

//--------------------------------
// Run the Program
//--------------------------------
starsInit();
playersInit();

function run() {
  stars.forEach(function (star) {
    if (star.x <= 0) {
      star.x = width
    }
    star.x = star.x - star.speed
  })


  handleActionsAllowed();
  handleBeanFloating();
  render();
}

setInterval(run, 10);