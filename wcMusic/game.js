let notes = [];
let score = 0;
let startTime = 0;
let sp = $("#speed").val() * 10;
let combo = 0;
let comboAni = 0;
let judAni = 0;
let StartIndex = 0;
const autoplay = false;
let keyset = ["d", "f", "j", "k"];
let keys = {
    "d": false,
    "f": false,
    "j": false,
    "k": false,
    "d_jud": false,
    "f_jud": false,
    "j_jud": false,
    "k_jud": false
};
let noteHeight = 25;
let noteIdCounter = 0; // 用來自動生成 id 的全域變數
let songProgress = 0;
let allNoteNums = 0;
let t = Date.now();
$(document)
    .ready(function () {
        const lanes = [$("#r1"), $("#r2"), $("#r3"), $("#r4")];
        $("#jdline")
            .css("top", lanes[0].offset().top + 500 + noteHeight / 2);
        for (let i = 0; i < 500; i++) {
            noteAdd(0, i * 60 / 260 / 2, Math.round(Math.random()) * 0);
            noteAdd(1, i * 60 / 260, Math.round(Math.random()) * 0);
            noteAdd(2, i * 60 / 260 / 2 * 3, Math.round(Math.random()) * 0);
            noteAdd(3, i * 60 / 260 * 2, Math.round(Math.random()) * 0);
        }
        $('#start-but').click(function () {
            startTime = Date.now() + 2000;
            requestAnimationFrame(update);
            $("#music")[0].volume = 0.5;
            setTimeout(() => $("#music")[0].play(), 2000);
            $(this).remove();
        });
    })
    .keydown(function (e) {
        if (e.key in keys) {
            console.log(e.key + " down");
            keys[e.key] = true;
            if (!keys[e.key + "_jud"]) {
                const laneIndex = keyset.indexOf(e.key);
                const firstNote = notes.find(n => n.lane === laneIndex && !n.hit && !n.miss);
                if (firstNote != null) {
                    let t_s = (Date.now() - startTime) / 1000 - firstNote.ti;
                    if (Math.abs(t_s) <= 0.5 && firstNote) {
                        $("#click")[0].currentTime = 0;
                        $("#click")[0].play();
                        hit(firstNote, t_s * 1000);
                    }
                }
                keys[e.key + "_jud"] = true;
            }
        }
    })
    .keyup(function (e) {
        if (e.key in keys) {
            console.log(e.key + " up");
            keys[e.key] = false;
            keys[e.key + "_jud"] = false;
        }
    });

function noteAdd(lane, ti, hold) {
    const id = noteIdCounter++; // 自動分配唯一 id，並自增
    //notes.find(n => n > ti).id
    notes.push({ id, lane, ti, hold, hit: false, miss: false, holdhit: false });
    allNoteNums++;
}


function update() {
    if (notes.find(n => !(n.hit || n.miss)) != null ? StartIndex < notes.find(n => !(n.hit || n.miss)).id : false) {
        StartIndex = notes.find(n => !(n.hit || n.miss)).id;
    }
    $(".combo").css("font-size", 25 + comboAni * 5 + "px");
    $(".jud")
        .css("font-size", 25 + judAni * 5 + "px")
        .css("opacity", Math.log(judAni * 9 + 1));
    $(".fast-late")
        .css("opacity", Math.log(judAni * 9 + 1));
    $("#progress").val(songProgress / allNoteNums);
    comboAni = comboAni * 0.95;
    judAni = judAni * 0.85;
    sp = $("#speeed").val() * 10;
    for (let index = StartIndex; index < (StartIndex + 200 > notes.length ? notes.length : StartIndex + 200); index++) {
        let note = notes[index];
        let lane = $("#r" + (note.lane + 1));
        let t_s = (t - startTime) / 1000 - note.ti;
        if ($("#" + note.id).length == 0 && !(note.hit || note.miss)) {
            lane.append("<div class=\"note hid\" id=\"" + note.id +
                "\"><div class = \"hold\" id = \"h_" + note.id
                + "\"></div></div>");
        }
        let noteObject = $("#" + note.id);
        let holdObject = $("#h_" + note.id);
        if (note.hold != 0) { holdObject = $("#h_" + note.id) };
        if (!(note.hit || note.miss)) {
            if (t_s * sp > -500 - lane.offset().top - noteHeight / 2 && t_s * sp < 50 - lane.offset().top + noteHeight / 2) {
                noteObject
                    .removeClass("hid")
                    .css("z-index", StartIndex + 200 - index);
                if (t_s * sp < -500 - lane.offset().top + noteHeight / 2 || t_s * sp > 50 - lane.offset().top - noteHeight / 2) {

                } else {
                }

            } else if (note.hold != 0) {
                noteObject
                    .removeClass("hid")
                    .css("z-index", StartIndex + 200 - index);
            } else {
                noteObject
                    .addClass("hid");
            }
            noteObject
                .css("top", t_s * sp + noteHeight / 2 + 500 + "px");
            holdObject
                .css("height", (note.hold * sp) + "px")
                .css("top", (note.hold * sp * -1) + noteHeight / 2 + "px");
            /*if (autoplay) {

                if (t_s >= 0) {
                    if (note.hold == 0) {
                        hit(note, 0);
                    } else if (t_s - note.hold > 0) {
                        hit(note, 0);
                    } else {
                        noteObject
                            .css("top", noteHeight / 2 + 500 - lane.offset().top + "px");
                        holdObject
                            .css("height", ((t_s - note.hold) * sp * -1) - lane.offset().top + "px")
                            .css("top", ((t_s - note.hold) * sp) + noteHeight / 2 + "px");
                    }
                }
            }
             else {
                if (Math.abs(t_s) <= 0.5 && firstNote[note.lane] != null) {
                    if (firstNote[note.lane].attr("id") == note.id && keys[keyset[note.lane]]) {
                        if (note.hold == 0) {
                            if (!keys[keyset[note.lane] + "_delay"]) {
                                hit(note, t_s * 1000);
                            }
                        } else if (t_s - note.hold > 0) {
                            hit(note, t_s * 1000);
                        } else {
                            $("#" + note.id)
                                .css("top", 0 + noteHeight / 2 + 500 + "px");
                            $("#h_" + note.id)
                                .css("height", ((t_s - note.hold) * sp * -1) + "px")
                                .css("top", ((t_s - note.hold) * sp) + noteHeight / 2 + "px");
                        }
                    }
                } else */
            if (t_s > 0.5 && !note.hit) {
                $(".jud").text("MISS")
                    .css("color", "lightgray")
                    .css("text-shadow", " 0px 0px 5px black");
                $(".fast-late").text("LATE").css("color", "red");
                judAni = 1;
                noteObject.remove();
                comboUpdate(false);
                StartIndex = notes.find(n => !(n.hit || n.miss)) != null ? notes.find(n => !(n.hit || n.miss)).id : notes.length;
                songProgress++;
                note.miss = true;
            }
            //}
        }
    }
    t = Date.now();
    requestAnimationFrame(update);
}

function hit(note, jud) {
    $("#" + note.id)
        .removeClass("hid")
        .css("top", 0 + noteHeight / 2 + 500 + "px");
    if (note.hold == 0) {
        $("#h_" + note.id)
            .removeClass("hold");
    }

    if (!note.hit) {
        if (Math.abs(jud) < 120) {
            judUpdate(0, jud);
            $("#" + note.id)
                .addClass("hit");
            score += 50;
            comboUpdate(true);
        } else if (Math.abs(jud) < 215) {
            judUpdate(1, jud);
            $("#" + note.id)
                .addClass("hit");
            comboUpdate(true);
            score += 35;
        } else /*if (Math.abs(jud) < 350)*/ {
            judUpdate(2, jud);
            $("#" + note.id)
                .addClass("hit");
            comboUpdate(false);
            score += 15;

        }/* else {
            $(".jud").text("MISS")
                .css("color", "lightgray")
                .css("text-shadow", " 0px 0px 20px black");
            $(".fast-late")
                .text((Math.sign(jud) < 0 ? "FAST " : "LATE ") + Math.floor(jud * -1) + "ms")
                .css("color", Math.sign(jud) < 0 ? "blue" : "red");
            combo = "";
            note.miss = true;
        }*/
        note.hit = true;
        songProgress++;
        StartIndex = notes.find(n => !(n.hit || n.miss)) != null ? notes.find(n => !(n.hit || n.miss)).id : notes.length;
        $("#score").text(score);
    }
    if (!note.miss) {
        setTimeout(function () {
            $("#" + note.id).remove();
        }, 500);
    } else {
        $("#" + note.id).remove();
    }

}

function comboUpdate(plus) {
    if (plus) {
        comboAni = 1;
        combo++;
    } else {
        combo = "";
    }
    $("#combo").text(combo);
}

function judUpdate(type, t_s) {
    judAni = 1;
    let judObject = $(".jud");
    let ftltObj = $(".fast-late");
    switch (type) {
        case 0:
            judObject.text("\!PERFECT\!")
                .css("color", "white")
                .css("text-shadow", " 0px 0px 7px rgb(255, 213, 47)");
            ftltObj.text("");
            break;
        case 1:
            judObject.text("GREAT")
                .css("color", "rgb(118, 244, 255)")
                .css("text-shadow", " 0px 0px 10px #7AE2FF");
            ftltObj
                .text((Math.sign(t_s) < 0 ? "FAST " : "LATE ") + Math.floor(t_s * -1 + 120 * Math.sign(t_s)) + "ms")
                .css("color", Math.sign(t_s) < 0 ? "blue" : "red");
            break;
        case 2:
            judObject.text("BRUH")
                .css("color", "aquamarine")
                .css("text-shadow", " 0px 0px 15px rgb(115, 255, 170)");
            ftltObj
                .text((Math.sign(t_s) < 0 ? "FAST " : "LATE ") + Math.floor(t_s * -1 + 120 * Math.sign(t_s)) + "ms")
                .css("color", Math.sign(t_s) < 0 ? "blue" : "red");
        default:
            break;
    }

}