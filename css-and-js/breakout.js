
// open and close rules
const rules = document.getElementById('rules')
const close = document.getElementById('close-btn')
const open = document.getElementById('rules-btn')

// score
score = 0

// canvas
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

// bricks
brickRowCount = 9
brickColumnCount = 5


// open and close rules
open.addEventListener('click', () => {
    rules.classList.add('show')
    document.getElementById('sounds/buzzer.mp3').play()
})

close.addEventListener('click', () => {
    rules.classList.remove('show')
})


// bricks
brickInfo = {
    w: 70,
    h: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    visible: true,
}

bricks = []
for (let i = 0; i < brickRowCount; i++) {
    bricks[i] = []

    for (let j = 0; j < brickColumnCount; j++) {
        const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX

        const y = j * (brickInfo.h + brickInfo.padding) +brickInfo.offsetY

        bricks[i][j] = {x, y, ...brickInfo}
    }
}

// draw bricks
function drawBricks() {
    bricks.forEach(column => {
        column.forEach(brick => {
            ctx.beginPath()
            ctx.rect(brick.x, brick.y, brick.w, brick.h)
            ctx.fillStyle = brick.visible ? '#d11406' : 'transparent';
            // ctx.fillStyle = '#d11406'
            ctx.fill()
            ctx.closePath()
        })
    })
}


// create paddle properties
paddle = {
    x: canvas.width / 2 - 100,
    y: canvas.height - 20,
    w: 200,
    h: 10,
    speed: 8,
    dx: 0,
}

// draw paddle on canvas
function drawPaddle() {
    ctx.beginPath()
    ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h)
    ctx.fillStyle = '#d11406'
    ctx.fill()
    ctx.closePath()
}


// create ball properties
ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    speed: 4,
    dx: 10,
    dy: -10,
}

// draw ball on canvas
function drawBall() {
    ctx.beginPath()
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2)
    ctx.fillStyle = '#d11406'
    ctx.fill()
    ctx.closePath()
}


// draw score on canvas
function drawScore() {
    ctx.font = '20px Cursive'
    ctx.fillText(`Score: ${score}`, canvas.width / 2 - 40, 30)
}


// draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawBall()
    drawPaddle()
    drawScore()
    drawBricks()
}


// move paddle
function movePaddle() {
    paddle.x = paddle.x + (paddle.dx * 2)

    // wall detection
    if (paddle.x <= 20) {
        paddle.x = 20
    }
    if (paddle.x + paddle.w > canvas.width - 20) {
        paddle.x = canvas.width - paddle.w - 20
    }
}


// keydown
function keyDown(e) {
    if (e.key == 'ArrowRight' || e.key == 'Right') {
        paddle.dx = paddle.speed
    }
    if (e.key == 'ArrowLeft' || e.key == 'Left') {
        paddle.dx = -paddle.speed
    }
}


// keyup
function keyUp(e) {
    if (e.key == 'ArrowRight' ||
    e.key == 'Right' ||
    e.key == 'ArrowLeft' ||
    e.key == 'Left') {
        paddle.dx = 0
    }
}


// keyboard event handlers
document.addEventListener('keydown', keyDown)
document.addEventListener('keyup', keyUp)


// move ball
function moveBall() {
    ball.x = ball.x + ball.dx
    ball.y = ball.y + ball.dy

    // wall detection (top)
    if (ball.y + ball.size <= 25) {
        ball.dy = -1 * ball.dy
    }
    // wall detection (right)
    if (ball.x + ball.size >= canvas.width - 10) {
        ball.dx = -1 * ball.dx
    }
    // wall detection (bottom)
    if (ball.y + ball.size >= canvas.height - 5) {
        ball.dy = -1 * ball.dy
        showAllBricks()
        score = 0
    }
    // wall detection (left)
    if (ball.x + ball.size <= 25) {
        ball.dx = -1 * ball.dx
    }

    // paddle collision
    if (ball.x - ball.size > paddle.x && 
        ball.x + ball.size < paddle.x + paddle.w && 
        ball.y + ball.size > paddle.y
        ) 
            {
        ball.dy = -2 * ball.speed
    }

    // brick collision
    bricks.forEach(column => {
        column.forEach(brick => {
            if (brick.visible) {
                if (
                    ball.x - ball.size > brick.x && // left
                    ball.x + ball.size < brick.x + brick.w && // right
                    ball.y + ball.size > brick.y && // top
                    ball.y - ball.size < brick.y + brick.h // bottom
                ) 
                {
                    ball.dy = -1 * ball.dy
                    brick.visible = false
                    increaseScore()
                }
            }
        })
    })
}


// increase score
function increaseScore() {
    score++

    if (score == brickRowCount * brickColumnCount) {
        score == 0 
        showAllBricks()
    }
}


function showAllBricks() {
    bricks.forEach(column => {
        column.forEach(brick => {
            brick.visible = true   
        })
    })
}


// updates canvas and animation
function update() {
    moveBall()
    movePaddle()
    draw()

    requestAnimationFrame(update)
}

update()
