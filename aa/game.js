let baseCanvas = document.getElementById('render');
let r = baseCanvas.getContext('2d');
let images = {
    man: document.getElementById('man'),
    bubble: document.getElementById('bubble'),
    tofu: document.getElementById('tofu'),
    chicken: document.getElementById('chicken'),
}
r.canvas.width = r.canvas.width * 3,
    r.canvas.height = r.canvas.height * 4;
let player = {
    x: r.canvas.width / 2 - images.man.width / 8,
    speed: 12,
    score: 0,
}

let leftPressed = false;
let rightPressed = false;
let items = []; // 掉落中的物品
let frameCount = 0;

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') leftPressed = true;
    if (e.key === 'ArrowRight') rightPressed = true;
});
document.addEventListener('keyup', e => {
    if (e.key === 'ArrowLeft') leftPressed = false;
    if (e.key === 'ArrowRight') rightPressed = false;
});
document.getElementById('leftBtn').addEventListener('touchstart', () => leftPressed = true);
document.getElementById('leftBtn').addEventListener('touchend', () => leftPressed = false);
document.getElementById('rightBtn').addEventListener('touchstart', () => rightPressed = true);
document.getElementById('rightBtn').addEventListener('touchend', () => rightPressed = false);

document.getElementById('leftBtn').addEventListener('mousedown', () => leftPressed = true);
document.getElementById('leftBtn').addEventListener('mouseup', () => leftPressed = false);
document.getElementById('rightBtn').addEventListener('mousedown', () => rightPressed = true);
document.getElementById('rightBtn').addEventListener('mouseup', () => rightPressed = false);

function createItem() {
    let types = ['tofu', 'bubble', 'chicken'];
    let type = types[Math.floor(Math.random() * types.length)];
    let img = images[type];

    let item = {
        x: Math.random() * (r.canvas.width - img.width / 4),
        y: -img.height / 4,
        width: img.width / 4,
        height: img.height / 4,
        speed: 1.5 + Math.random() + frameCount / 1200,
        type: type,
    };
    items.push(item);
}

function update() {
    w = r.canvas.width,
        h = r.canvas.height;

    // 移動處理
    if (leftPressed) player.x -= player.speed;
    if (rightPressed) player.x += player.speed;
    player.x = Math.min(player.x, w - images.man.width / 4);

    // 掉落物邏輯
    if (frameCount % 40 === 0) {
        createItem();
    }
    frameCount++;

    // 更新物品位置
    items.forEach(item => item.y += item.speed);
    // 碰撞判定
    items = items.filter(item => {
        let hit = item.x < player.x + images.man.width / 4 &&
            item.x + item.width > player.x &&
            item.y + item.height > h - images.man.height / 4 &&
            item.y < h;

        if (hit) {
            player.score += 5;
            return false; // 撞到吃掉
        }

        if (item.y > h) {
            player.score -= 250; // 掉到地上扣分
            return false; // 掉出畫面移除
        }

        return true; // 還在空中，保留
    });


    r.clearRect(0, 0, w, h);
    r.font = "bold italic 48px 標楷體";
    const clololeololol = r.createLinearGradient(0,100,200,100);
    clololeololol.addColorStop(0, "blue");
    clololeololol.addColorStop(0.3, "white");
    clololeololol.addColorStop(1, "red");
    r.fillStyle = clololeololol;
    r.fillText(`台灣價值：${player.score}`, 0, 50);

    // 畫物品
    items.forEach(item => {
        r.drawImage(images[item.type], item.x, item.y, item.width, item.height);
    });

    r.drawImage(images.man, player.x, h - images.man.height / 4, images.man.width / 4, images.man.height / 4);

    requestAnimationFrame(update);
}
update();