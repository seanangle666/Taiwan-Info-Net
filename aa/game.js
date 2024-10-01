var canvas = document.getElementById("myCanvas");
var back = document.getElementById("back")
var img = document.getElementById("imgg");
var drop_item = document.getElementsByClassName("drop")
var ctx = canvas.getContext("2d");

var platformHeight = 150; // 平台的高度與圖像的高度保持一致
var platformWidth = 150; // 平台的寬度
var platformX = (canvas.width - platformWidth) / 2;

var ballRadius = 25;
var gravity = 2; // 掉落速度
var score = 0; // 記分
var lives = 3; // 生命數
var speed = 7; //速度
current_speed = speed; //現在速度

var balls = []; // 用來存放所有掉落的物體

let spacePressed = false;
let rightPressed = false;
let leftPressed = false;

var gameInterval; // 用來保存setInterval的ID
var gameStarted = false; // 標誌遊戲是否已經開始

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

console.log(drop_item);

// 初始創建多個掉落的物體
function createBalls(numBalls) {
    for (let i = 0; i < numBalls; i++) {
        balls.push({
            x: Math.random() * (canvas.width - ballRadius * 2) + ballRadius,
            y: Math.random() * -canvas.height, // 讓物體在不同的初始高度掉落
            dy: gravity, // 隨機的掉落速度
            image: Math.floor(Math.random() * drop_item.length)
        });
    }
}

function resetBall(ball) {
    ball.x = Math.random() * (canvas.width - ballRadius * 2) + ballRadius;
    ball.y = Math.random() * -canvas.height; // 讓物體從上方再次掉落
    ball.dy = gravity; // 隨機的掉落速度
    ball.image = Math.floor(Math.random() * drop_item.length);
}

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    } else if (e.key == " " || e.key == "Spacebar") { // 處理空白鍵
        spacePressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    } else if (e.key == " " || e.key == "Spacebar") { // 處理空白鍵
        spacePressed = false;
    }
}

// 使用圖像繪製平台
function drawPlatform() {
    ctx.drawImage(img, platformX, canvas.height - platformHeight, platformWidth, platformHeight);
}

function drawBall(ball) {
    ctx.drawImage(drop_item[ball.image], ball.x - ballRadius, ball.y - ballRadius, 50, 50); // 繪製掉落物體
}

function detectCollision(ball) {
    // 檢查球是否接觸平台
    if (
        ball.y + ballRadius >= canvas.height - platformHeight &&
        ball.x > platformX &&
        ball.x < platformX + platformWidth
    ) {
        score++; // 加分
        resetBall(ball); // 重置物體位置
    } else if (ball.y + ballRadius > canvas.height) {
        lives--; // 生命數減一
        if (lives > 0) {
            resetBall(ball);
        } else {
            gameOver(); // 遊戲結束
        }
    }
}

// 遊戲結束的函數
function gameOver() {
    clearInterval(gameInterval); // 停止遊戲循環
    alert("遊戲結束! 得分: " + score);
    document.location.reload(); // 重載遊戲
}

// 開始畫面
function showStartScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "72px 標楷體";
    ctx.fillStyle = "#FF0000";
    ctx.textAlign = "center";
    ctx.fillText("按任意鍵開始遊戲", canvas.width / 2, canvas.height / 2);
}

// 遊戲開始函數
function startGame() {
    if (!gameStarted) {
        gameStarted = true; // 設定遊戲開始
        createBalls(5); // 創建5個物體
        gameInterval = setInterval(draw, 10); // 開始遊戲循環
    }
}

// 繪製分數
function drawScore() {
    ctx.font = "32px 標楷體";
    ctx.fillStyle = "#FF0000";
    ctx.textAlign = "left";
    ctx.fillText("已取得的台灣價值: " + score, 0, 50); // 在左上角顯示分數
}

// 繪製生命數
function drawLives() {
    ctx.font = "32px 標楷體";
    ctx.fillStyle = "#FF0000";
    ctx.textAlign = "left";
    ctx.fillText("命數: " + lives, 0, 100); // 在左上角顯示生命數
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlatform();

    // 繪製記分板
    drawScore();
    drawLives();

    // 更新每個物體的狀態並繪製它們
    balls.forEach(ball => {
        drawBall(ball);
        ball.y += ball.dy;
        detectCollision(ball); // 檢測是否接住物體
    });

    // 控制平台移動
    if (spacePressed) {
        current_speed = 2 * speed;
    } else {
        current_speed = speed;
    }

    if (rightPressed) {
        platformX = Math.min(platformX + current_speed, canvas.width - platformWidth);
    } else if (leftPressed) {
        platformX = Math.max(platformX - current_speed, 0);
    }
}

// 顯示開始畫面
showStartScreen();

// 等待玩家按鍵開始遊戲
document.addEventListener("keydown", startGame, { once: true });
