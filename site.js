var audioEnabled = false
const audio = new Audio('AmongUsBg.mp3')
audio.loop = true
const backgroundColor = '#000000'
let width = window.innerWidth
let height = window.innerHeight
let lastWidth = window.innerWidth
let lastHeight = window.innerHeight
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const speed = 0.5
canvas.width = width
canvas.height = height
var beanIsFloating = false;

const ejectionDiv = document.getElementById("ejection");

function createPlayer(color, name, status) {
  const player = { color: color, name: name, status: status }
  return player
}

function playersInit() {
  let attendees = document.getElementById('attendees')
  let newHtml = ''
  const players = []

  
    player = createPlayer('Red', 'Savage', 'invited')
    players.push(player)
  
    player = createPlayer('Coral', 'Lordiggs', 'accepted')
    players.push(player)

    player = createPlayer('Pink', 'Timmmahh', 'accepted')
    players.push(player)

    player = createPlayer('Green', 'AiMani', 'invited')
    players.push(player)

    player = createPlayer('Purple', 'Tyler', 'invited')
    players.push(player)

    player = createPlayer('Lime', 'FuFu', 'invited')
    players.push(player)

    player = createPlayer('Black', 'Meathooks', 'invited')
    players.push(player)

    player = createPlayer('Yellow', 'Baaaaa', 'invited')
    players.push(player)

    player = createPlayer('Purple', 'Ashley', 'invited')
    players.push(player)

    player = createPlayer('Cyan', 'Mimi', 'invited')
    players.push(player)

    player = createPlayer('Orange', 'Nick', 'invited')
    players.push(player)

    player = createPlayer('Blue', 'Galaxy', 'invited')
    players.push(player)

    player = createPlayer('Banana', 'Olly', 'accepted')
    players.push(player)

    player = createPlayer('Black', 'Daisuke', 'invited')
    players.push(player)

    player = createPlayer('White', 'Joe', 'invited')
    players.push(player)


    players.sort(dynamicSortMultiple("status", "name"));


  players.forEach(function (player) {
      newHtml = newHtml + "<div class='attendee " + player.status + "' onmouseover='playClick()' onclick='voteOut(\"" + player.color + "\", \"" + player.name + "\");'>"

    newHtml =
      newHtml +
      "<img class='bean bean" + player.status + "' src='bean" +
      player.color +
      ".png' /><span class='strokeme " + player.status + "'>" +
      player.name +
      '</span>'

    if (player.status == 'accepted') {
      newHtml = newHtml + "<img class='thumbsup' src='accepted.png' />"
      }

      if (player.status == 'rejected') {
          newHtml = newHtml + "<img class='thumbsup' src='x.png' />"
      }

    newHtml = newHtml + '</div>'
  })

  attendees.innerHTML = newHtml
}

let players = playersInit()

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

function createStar(x, y) {
  let radius = randomBetween(1, 3)
  let speed = randomBetween(1, 3)
  speed = speed / 10
  const star = { x: x, y: y, radius: radius, speed: speed }
  return star
}

function starsInit() {
  const stars = []
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let rand = Math.random()

      if (rand <= 0.00003) {
        const star = createStar(x, y, 5)
        stars.push(star)
      }
    }
  }

  return stars
}



function voteOut(color, name) {
    if (!beanIsFloating) {
        // Set Color


        // Set name
        ejectionDiv.innerHTML = name + " was ejected.";

        // Set true
        beanIsFloating = true;
    }
}

function floatingBeanInit() {
    var img = document.getElementById("floatingBean");
    return img;
}

let floatingBean = floatingBeanInit();
let stars = starsInit();

function render() {
  ctx.fillStyle = backgroundColor
  ctx.fillRect(0, 0, width, height)
  stars.forEach(function (star) {
    const x = star.x
    const y = star.y
    const r = star.radius
    ctx.beginPath()
    ctx.fillStyle = 'rgb(255, 255, 255)'
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  })

    ctx.drawImage(floatingBean, beanX, canvas.height / 2);
}

setInterval(run, 10)

var testNum = 0;
var beanX = -187;

function run() {
  stars.forEach(function (star) {
    if (star.x <= 0) {
      star.x = width
    }
    star.x = star.x - star.speed
  })


    if (beanIsFloating) {
        console.log(canvas.width);
        testNum++;

        beanX = beanX + (6)

        if (beanX >= canvas.width) {
            ejectionDiv.innerHTML = "";
            beanIsFloating = false;
            beanX = -187;
        }
    }
    
    render();
}

function randomBetween(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
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

window.onresize = function () {
  console.log('here')
  width = window.innerWidth
  height = window.innerHeight

  canvas.width = width
  canvas.height = height

  let i = 0

  stars.forEach(function (star) {
    let currentStarX = star.x / lastWidth
    let currentStarY = star.y / lastHeight

    let newStarX = currentStarX * width
    let newStarY = currentStarY * height

    star.x = newStarX
    star.y = newStarY
  })

  lastWidth = width
  lastHeight = height

  render()
}
