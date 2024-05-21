
// variables
const screens = document.querySelectorAll('.screen')

const chooseInsectBtns = document.querySelectorAll('.choose-creature-btn')

const gameContainer = document.getElementById('game-container')

const startBtn = document.getElementById('start-btn')

const timeEl = document.getElementById('time')

const scoreEl = document.getElementById('score')

const message = document.getElementById('message')

const message2 = document.getElementById('message-2')

let seconds = 0

let score = 0

let selectedCreature = {}


startBtn.addEventListener('click', () => {
    screens[0].classList.add('up')
})

chooseInsectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const img = btn.querySelector('img')
        const alt = img.getAttribute('alt')
        const src = img.getAttribute('src')
        screens[1].classList.add('up')
        selectedCreature = {src, alt}
        setTimeout(createCreature, 1000)

        startGame()
    })
})


function startGame() {
    setInterval(increaseTime, 1000)
    setInterval(console.log(seconds), 1000)
    setInterval(console.log(score), 1000)
}


function increaseTime() {
    let m = Math.floor(seconds / 60)
    let s = seconds % 60
    if (m < 10) {
        m = `0${m}`
    }
    if (s < 10) {
        s = `0${s}`
    }

    timeEl.innerHTML = `Time: ${m}: ${s}`
    seconds++
    setInterval(console.log(`Seconds: ${seconds}`), 1000)
    setInterval(console.log(`Score: ${score}`), 1000)

    if (seconds >= 1) {
        if (score >= 60 && seconds <= 30) {
        setInterval(console.log("win"), 1000)
        message2.classList.add('visible')
        }
    }
}


function createCreature() {
    const creature = document.createElement('div')
    creature.classList.add('creature')
    const { x, y } = getRandomLocation()
    creature.style.top = `${y}px`
    creature.style.left = `${x}px`
    creature.innerHTML = `<img src = "${selectedCreature.src}" alt = "${selectedCreature.alt}" style = "transform: rotate(${Math.random() * 360}deg" />`
    creature.addEventListener('click', catchCreature)

    gameContainer.appendChild(creature)
}


function catchCreature() {
    increaseScore()
    this.classList.add('caught')
    setTimeout(() => this.remove(), 300)
    addCreatures()
}


function addCreatures() {
    setTimeout(createCreature, 700)
    setTimeout(createCreature, 1000)
}


function increaseScore() {
    score++
    if (score > 19) {
        message.classList.add('visible')
        setTimeout(messageLeave, 3000)
    }
    scoreEl.innerHTML = `Score: ${score}`
}


function messageLeave() {
    message.classList.add('invisible')
}


function getRandomLocation() {
    const width = window.innerWidth
    const height = window.innerHeight
    const x = Math.random() * (width - 200) + 100
    const y = Math.random() * (height - 200) + 100
    return { x, y }
}
