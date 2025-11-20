let baseCanvas = document.getElementById('render');
let r = baseCanvas.getContext('2d');
let images = {
    theend: document.getElementById('theend'),
    endGame: document.getElementById('endGame'),
    t: document.getElementById('t'),
    man: document.getElementById('man'),
    bubble: document.getElementById('bubble'),
    tofu: document.getElementById('tofu'),
    chicken: document.getElementById('chicken'),
}

Object.keys(images).forEach(key => {
    images[key].width = 200;
    images[key].height = 150;
});

r.canvas.width = r.canvas.width * 16 / 5,
    r.canvas.height = r.canvas.height * 9 / 5;

let spq = 0;
let frameCount = 0;
let player = {
    x: r.canvas.width / 2 - images.man.width / 2,
    hp: 10,
    baseSpeed: 20,
    speed: 0,
    score: 20,
}

let leftPressed = false;
let rightPressed = false;
let items = []; // 掉落中的物品
let lastTime = performance.now(); // 初始化時間
let spawnTimer = 0; // 用來控制生成間隔（以秒為單位）
let start = false;

const winScore = 1000;

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') leftPressed = true;
    if (e.key === 'ArrowRight') rightPressed = true;
});
document.addEventListener('keyup', e => {
    if (e.key === 'ArrowLeft') leftPressed = false;
    if (e.key === 'ArrowRight') rightPressed = false;
});
document.getElementById('start-btn').addEventListener('touchstart', () => { start = true, document.getElementById('start-btn').style.display = 'none' });
document.getElementById('start-btn').addEventListener('mousedown', () => { start = true, document.getElementById('start-btn').style.display = 'none' });

document.getElementById('leftBtn').addEventListener('touchstart', () => { leftPressed = true });
document.getElementById('leftBtn').addEventListener('touchend', () => { leftPressed = false });
document.getElementById('rightBtn').addEventListener('touchstart', () => { rightPressed = true });
document.getElementById('rightBtn').addEventListener('touchend', () => { rightPressed = false });

document.getElementById('leftBtn').addEventListener('mousedown', () => { leftPressed = true });
document.getElementById('leftBtn').addEventListener('mouseup', () => { leftPressed = false });
document.getElementById('rightBtn').addEventListener('mousedown', () => { rightPressed = true });
document.getElementById('rightBtn').addEventListener('mouseup', () => { rightPressed = false });

function createItem() {
    let types = ['tofu', 'bubble', 'chicken'];
    let type = types[Math.floor(Math.random() * types.length)];
    let img = images[type];

    let item = {
        x: Math.random() * (r.canvas.width - img.width),
        y: -img.height / 4,
        width: img.width / 4,
        height: img.height / 4,
        speed: 1 + Math.random() + spq / 10,
        type: type,
    };
    items.push(item);
}

function update(currentTime) {
    let deltaTime = (currentTime - lastTime) / 1000; // 換成秒
    lastTime = currentTime;

    let w = r.canvas.width;
    let h = r.canvas.height;
    if (start) {
        if (player.hp <= 0) {
            // Game over 處理（之後可加）
            r.clearRect(0, 0, w, h);
            r.drawImage(images.theend,
                0, 0, w, h);
            r.font = "bold italic 64px 標楷體";
            r.fillStyle = 'red';
            let text = '失敗了〜〜〜〜';
            r.fillText(text, 100, 200)
        } else if (player.score >= winScore) {
            r.clearRect(0, 0, w, h);
            r.drawImage(images.endGame,
                0, 0, w, h);
        } else {
            player.speed = player.baseSpeed + spq / 10;

            // 移動處理
            if (leftPressed) player.x -= player.speed * deltaTime * 60;
            if (rightPressed) player.x += player.speed * deltaTime * 60;
            player.x = Math.max(Math.min(player.x, w - images.man.width), 0);

            // 掉落物生成計時器（例如每 0.5 秒產生一個）
            spawnTimer += deltaTime;
            if (spawnTimer >= 0.25) {
                spq += 0.25;
                createItem();
                spawnTimer = 0;
            }

            // 更新物品位置
            items.forEach(item => item.y += item.speed * deltaTime * 60);
            // ↑ *60 是為了維持你原本用 frame 計算的速度感

            // 碰撞判定
            items = items.filter(item => {
                let hit = item.x < player.x + images.man.width &&
                    item.x + item.width > player.x &&
                    item.y + item.height > (h - images.man.height + 30) &&
                    item.y < h;

                if (hit) {
                    player.score += 10;
                    return false;
                }

                if (item.y > h) {
                    player.score -= 145;
                    player.hp -= 1;
                    return false;
                }

                return true;
            });

            // 繪圖
            r.clearRect(0, 0, w, h);
            r.font = "bold italic 24px 標楷體";
            const gradient = r.createLinearGradient(0, 100, 200, 100);
            gradient.addColorStop(0, "blue");
            gradient.addColorStop(0.3, "white");
            gradient.addColorStop(1, "red");
            r.fillStyle = gradient;
            r.fillText(`你再掉${player.hp}次就會被遣返回大陸`, 0, 20);
            r.fillText(`台灣價值：${player.score}`, 0, 50);
            r.fillText(`還需要${winScore - player.score}完成挑戰`, 0, 80);

            items.forEach(item => {
                r.drawImage(images[item.type], item.x, item.y, item.width, item.height);
            });

            r.drawImage(images.man, player.x, h - images.man.height + 30, images.man.width, images.man.height);
        }
    } else {
        r.clearRect(0, 0, w, h);
        r.drawImage(images.man, w - images.man.width * 2, h - images.man.height * 1.5, images.man.width * 1.5, images.man.height * 1.5);
        r.font = "bold italic 24px 標楷體";
        r.drawImage(images.t,
            w - images.t.width * 2.5 - images.man.width * 1.5, h - 250, images.t.width * 2.5, images.t.height);
        r.lineWidth = 5;
        r.strokeStyle = 'black';
        let text = '哈囉，我是Ai~臺灣先生〜〜',
            text2 = '你要跟我一起挑戰賺台灣價值嗎〜 ？',
            text3 = '馬上按下開始吧〜〜〜〜';
        r.fillStyle = 'yellow';
        r.strokeText(text, 250, 180 - 100);
        r.fillText(text, 250, 180 - 100);
        r.strokeText(text2, 250, 210 - 100);
        r.fillText(text2, 250, 210 - 100);
        r.strokeText(text3, 250, 240 - 100);
        r.fillText(text3, 250, 240 - 100);
    }

    requestAnimationFrame(update);
}
requestAnimationFrame(update);