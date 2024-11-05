
let notes = [];
let score = 0;
let startTime = 0;
let sp = $("#speed").val() * 10;
let objNums = 0;
let combo = 0;
let comboAni = 0;
let judAni = 0;
let StartIndex = 0;
let autoplay = false;
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
let t = Date.now();
let noteHeight = 25;
let noteIdCounter = 0; // 用來自動生成 id 的全域變數
let songProgress = 0;

$(document)
    .ready(function () {
        const lanes = [$("#r1"), $("#r2"), $("#r3"), $("#r4")];
        $("#jdline")
            .css("top", lanes[0].offset().top + 500 - noteHeight / 2);
        for (let i = 0; i < 100; i++) {
            noteAdd(0, i * 60 / 260, Math.round(Math.random()) * 0);
            noteAdd(1, i * 60 / 260, Math.round(Math.random()) * 0);
            noteAdd(2, i * 60 / 260, Math.round(Math.random()) * 0);
            noteAdd(3, i * 60 / 260, Math.round(Math.random()) * 0);
        }
        $('#start-but').click(function () {
            console.log("yee");
            startTime = Date.now() + 2000;
            requestAnimationFrame(update);
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
    notes.push({ id, lane, ti, hold, hit: false, miss: false });
}


function update() {
    if (StartIndex < notes.find(n => !(n.hit || n.miss)).id) {
        StartIndex = notes.find(n => !(n.hit || n.miss)).id;
    }
    $(".combo").css("font-size", 25 + comboAni * 5 + "px");
    $(".jud")
        .css("font-size", 25 + judAni * 5 + "px")
        .css("opacity", Math.log(judAni * 9 + 1));
    $(".fast-late")
        .css("opacity", Math.log(judAni * 9 + 1));
    $("#progress").val(songProgress / 400);
    comboAni = comboAni * 0.95;
    judAni = judAni * 0.85;
    sp = $("#speeed").val() * 10;
    for (let index = StartIndex; index < (StartIndex + 200 > notes.length ? notes.length : StartIndex + 200); index++) {
        let note = notes[index];
        let lane = $("#r" + (note.lane + 1));
        let t_s = (Date.now() - startTime) / 1000 - note.ti;
        if ($("#" + note.id).length == 0 && !(note.hit || note.miss)) {
            lane.append("<div class=\"note hid\" id=\"" + note.id +
                "\"><div class = \"hold\" id = \"h_" + note.id
                + "\"></div></div>");
        }

        if (!(note.hit || note.miss)) {
            if (t_s * sp > -500 && t_s * sp < 50) {
                $("#" + note.id)
                    .removeClass("hid")
                    .css("z-index", StartIndex + 200 - index);

            } else if (note.hold != 0) {
                $("#" + note.id)
                    .removeClass("hid")
                    .css("z-index", StartIndex + 200 - index);
            } else {
                $("#" + note.id)
                    .addClass("hid");
            }
            $("#" + note.id)
                .css("top", t_s * sp + noteHeight / 2 + 500 + "px");
            $("#h_" + note.id)
                .css("height", (note.hold * sp) + "px")
                .css("top", (note.hold * sp * -1) + noteHeight / 2 + "px");
            if (autoplay) {
                if (t_s >= 0) {
                    if (note.hold == 0) {
                        hit(note, 0);
                    } else if (t_s - note.hold > 0) {
                        hit(note, 0);
                    } else {
                        $("#" + noteid)
                            .css("top", 0 + noteHeight / 2 + 500 + "px");
                        $("#h_" + noteid)
                            .css("height", ((t_s - note.hold) * sp * -1) + "px")
                            .css("top", ((t_s - note.hold) * sp) + noteHeight / 2 + "px");
                    }
                }
            }
            /* else {
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
                combo = "";
                $(".jud").text("MISS")
                    .css("color", "lightgray")
                    .css("text-shadow", " 0px 0px 5px black");
                $(".fast-late").text("LATE").css("color", "red");
                judAni = 1;
                $("#" + note.id).remove();
                $("#combo").text(combo);
                StartIndex = notes.find(n => !(n.hit || n.miss)).id;
                console.log(StartIndex);
                songProgress++;
                note.miss = true;
            }
            //}

        }
    }
    requestAnimationFrame(update);
}

function hit(note, jud) {
    $("#" + note.hit)
        .removeClass("note")
        .removeClass("hid")
        .css("top", 0 + noteHeight / 2 + 500 + "px");
    $("#h_" + note.id)
        .removeClass("hold");
    if (!note.hit) {
        if (Math.abs(jud) < 80) {
            $(".jud").text("\!PERFECT\!")
                .css("color", "white")
                .css("text-shadow", " 0px 0px 7px rgb(255, 213, 47)");
            $("#" + note.id)
                .addClass("hit");
            $(".fast-late").text("");
            comboAni = 1;
            score += 50;
            combo++;
            note.hit = true;
        } else if (Math.abs(jud) < 185) {
            $(".jud").text("GREAT")
                .css("color", "rgb(118, 244, 255)")
                .css("text-shadow", " 0px 0px 10px #7AE2FF");
            $(".fast-late")
                .text((Math.sign(jud) < 0 ? "FAST " : "LATE ") + Math.floor(jud * -1) + "ms")
                .css("color", Math.sign(jud) < 0 ? "blue" : "red");
            $("#" + note.id)
                .addClass("hit");
            comboAni = 1;
            score += 35;
            combo++;
            note.hit = true;
        } else if (Math.abs(jud) < 350) {
            $(".jud").text("BRUH")
                .css("color", "aquamarine")
                .css("text-shadow", " 0px 0px 15px rgb(115, 255, 170)");
            $(".fast-late")
                .text((Math.sign(jud) < 0 ? "FAST " : "LATE ") + Math.floor(jud * -1) + "ms")
                .css("color", Math.sign(jud) < 0 ? "blue" : "red");
            $("#" + note.id)
                .addClass("hit");
            comboAni = 1;
            score += 15;
            combo++;
            note.hit = true;
        } else {
            $(".jud").text("MISS")
                .css("color", "lightgray")
                .css("text-shadow", " 0px 0px 20px black");
            $(".fast-late")
                .text((Math.sign(jud) < 0 ? "FAST " : "LATE ") + Math.floor(jud * -1) + "ms")
                .css("color", Math.sign(jud) < 0 ? "blue" : "red");
            combo = "";
            note.miss = true;
        }
        judAni = 1;
        songProgress++;
        StartIndex = notes.find(n => !(n.hit || n.miss)).id;
        $("#combo").text(combo);
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

function getnote() {
    for (let i = 0; i < notes.length; i++) {
        if (!notes[i].hit) {
            return i;
        }
    }
    return -1;
}