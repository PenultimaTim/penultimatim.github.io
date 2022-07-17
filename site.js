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

function createPlayer(color, name, status) {
  const player = { color: color, name: name, status: status }
  return player
}

function playersInit() {
  let attendees = document.getElementById('attendees')
  let newHtml = ''
  const players = []

  // Savage
  player = createPlayer('Red', 'Savage', 'accepted')
  players.push(player)

  // Lordiggs
  player = createPlayer('Cyan', 'Lordiggs', 'invited')
  players.push(player)

  // Timmahhh
  player = createPlayer('Pink', 'Timahhh', 'declined')
  players.push(player)

  















  players.forEach(function (player) {
    newHtml = newHtml + "<div class='attendee " + player.status + "'>"

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

    newHtml = newHtml + '</div>'
  })

  attendees.innerHTML = newHtml
}

let players = playersInit()

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

let stars = starsInit()

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
}

setInterval(run, 10)

function run() {
  stars.forEach(function (star) {
    if (star.x <= 0) {
      star.x = width
    }
    star.x = star.x - star.speed
  })

  render()
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
