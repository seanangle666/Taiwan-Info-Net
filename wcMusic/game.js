let note = [];
let startTime = Date.now();
noteAdd(1,0);
$(document).ready(function () {
    
});

function noteAdd(r,id) {
    note.push([id,0,r]);
    let lane = $("#r"+(r+1))
    lane
        .append("<div class=\"note\" id=\""+id+"\"></div>");
}
function update() {
    note.forEach(noteprp => {
        noteprp[0];
    });;
}