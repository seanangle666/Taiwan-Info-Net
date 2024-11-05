const grid = document.getElementById("grid");

// 設定格線，這裡假設一個小節 4 格車道，每次顯示 4 小節
const totalBars = 4; 
const rowsPerBar = 4; // 每小節有 4 行代表四分音符
const lanes = 4; // 4 個車道

// 初始化格線
for (let i = 0; i < totalBars * rowsPerBar; i++) {
    for (let j = 0; j < lanes; j++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.bar = Math.floor(i / rowsPerBar); // 小節編號
        cell.dataset.lane = j; // 車道編號

        // 點擊切換音符的存在
        cell.addEventListener("click", () => {
            if (cell.querySelector(".note")) {
                cell.innerHTML = ""; // 若有音符則移除
            } else {
                const note = document.createElement("div");
                note.classList.add("note");
                cell.appendChild(note); // 放入音符
            }
        });
        
        grid.appendChild(cell);
    }
}
