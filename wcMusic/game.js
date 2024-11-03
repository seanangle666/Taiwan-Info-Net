let note = [];
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
    "d_delay": false,
    "f_delay": false,
    "j_delay": false,
    "k_delay": false
};
let t = Date.now();
let noteHeight = 25;

$(document)
    .ready(function () {
        $("#jdline")
            .css("top", $("#r1").offset().top + 500 - noteHeight / 2);
        for (let i = 0; i < 10000; i++) {
            noteAdd(Math.floor(Math.random() * 0.999999 * 4), i, i * 60 / 260, Math.round(Math.random()) * 0);
        }
        $('#start-but').click(function () {
            console.log("yee");
            startTime = Date.now() + 2000;
            setInterval(update, 15);
            setTimeout(function () { $("#music")[0].play() }, 2000);
            $(this).remove();
        });
    })
    .keydown(function (e) {
        let ka = e.key;
        if (e.keyCode == 38) {
            t += 50;
        }
        if (e.keyCode == 40) {
            t -= 50;
        }
        if (!keys[ka] && keys[ka] != null) {
            console.log(ka + " down");
            keys[ka] = true;
            setTimeout(function () {
                console.log(ka + " down delay");
                keys[ka + "_delay"] = true;
            }
                , 14);
        }

    })
    .keyup(function (e) {
        if (keys[e.key] && keys[e.key] != null) {
            console.log(e.key + " up");
            keys[e.key] = false;
            keys[e.key + "_delay"] = false;
        }

    });

function noteAdd(r, id, ti, hold) {
    note.push([id, r, ti, hold, false]);
}

function update() {
    $(".combo").css("font-size", 25 + comboAni * 5 + "px");
    $(".jud")
        .css("font-size", 25 + judAni * 5 + "px")
        .css("opacity", Math.log(judAni * 9 + 1));
    $(".fast-late")
        .css("opacity", Math.log(judAni * 9 + 1));
    comboAni = comboAni * 0.95;
    judAni = judAni * 0.85;
    sp = $("#speeed").val() * 10;
    let firstNote = [find($("#r" + 1)), find($("#r" + 2)), find($("#r" + 3)), find($("#r" + 4))];
    for (let index = StartIndex; index < (StartIndex + 200 > note.length ? note.length : StartIndex + 200); index++) {
        let noteprp = note[index];
        let noteid = noteprp[0];
        let notepos = noteprp[1];
        let notehold = noteprp[3];
        let lane = $("#r" + (notepos + 1));
        let t_s = (Date.now() - startTime) / 1000 - noteprp[2];
        if ($("#" + noteid).length == 0 && !noteprp[4]) {
            lane.append("<div class=\"note hid\" id=\"" + noteid +
                "\"><div class = \"hold\" id = \"h_" + noteid
                + "\"></div></div>");
        }

        if (!$("#" + noteid).hasClass("hit")) {
            if (t_s * sp > -500 && t_s * sp < 50) {
                $("#" + noteid)
                    .removeClass("hid")
                    .css("z-index", StartIndex + 200 - index);

            } else if (notehold != 0) {
                $("#" + noteid)
                    .removeClass("hid")
                    .css("z-index", StartIndex + 200 - index);
            } else {
                $("#" + noteid)
                    .addClass("hid");
            }
            $("#" + noteid)
                .css("top", t_s * sp + noteHeight / 2 + 500 + "px");
            $("#h_" + noteid)
                .css("height", (notehold * sp) + "px")
                .css("top", (notehold * sp * -1) + noteHeight / 2 + "px");
            if (autoplay) {
                if (t_s >= 0) {
                    if (notehold == 0) {
                        hit(noteprp, 0);
                    } else if (t_s - notehold > 0) {
                        hit(noteprp, 0);
                    } else {
                        $("#" + noteid)
                            .css("top", 0 + noteHeight / 2 + 500 + "px");
                        $("#h_" + noteid)
                            .css("height", ((t_s - notehold) * sp * -1) + "px")
                            .css("top", ((t_s - notehold) * sp) + noteHeight / 2 + "px");
                    }
                }
            } else {
                if (Math.abs(t_s) <= 0.5 && firstNote[notepos] != null) {
                    if (firstNote[notepos].attr("id") == noteid && keys[keyset[notepos]]) {
                        if (notehold == 0) {
                            if (!keys[keyset[notepos] + "_delay"]) {
                                hit(noteprp, t_s * 1000);
                            }
                        } else if (t_s - notehold > 0) {
                            hit(noteprp, t_s * 1000);
                        } else {
                            $("#" + noteid)
                                .css("top", 0 + noteHeight / 2 + 500 + "px");
                            $("#h_" + noteid)
                                .css("height", ((t_s - notehold) * sp * -1) + "px")
                                .css("top", ((t_s - notehold) * sp) + noteHeight / 2 + "px");
                        }
                    }
                } else if (t_s > 0.5 && !noteprp[4]) {
                    combo = "";
                    $(".jud").text("MISS")
                        .css("color", "lightgray")
                        .css("text-shadow", " 0px 0px 5px black");
                    $(".fast-late").text("LATE");
                    judAni = 1;
                    $("#" + noteprp[0]).remove();
                    $("#combo").text(combo);
                    StartIndex = getnote();
                    noteprp[4] = true;
                }
            }

        }
    }
}

function hit(noteprp, jud) {
    $("#" + noteprp[0])
        .removeClass("note")
        .removeClass("hid")
        .css("top", 0 + noteHeight / 2 + 500 + "px");
    $("#h_" + noteprp[0])
        .removeClass("hold");
    if (!noteprp[4]) {
        if (Math.abs(jud) < 80) {
            $(".jud").text("\!PERFECT\!")
                .css("color", "white")
                .css("text-shadow", " 0px 0px 7px rgb(255, 213, 47)");
            $("#" + noteprp[0])
                .addClass("hit");
            $(".fast-late").text("");
            comboAni = 1;
            score += 50;
            combo++;
        } else if (Math.abs(jud) < 185) {
            $(".jud").text("GREAT")
                .css("color", "rgb(118, 244, 255)")
                .css("text-shadow", " 0px 0px 10px #7AE2FF");
            $(".fast-late")
                .text((Math.sign(jud) < 0 ? "FAST " : "LATE ") + Math.floor(jud * -1) + "ms")
                .css("color", Math.sign(jud) < 0 ? "blue" : "red");
            $("#" + noteprp[0])
                .addClass("hit");
            comboAni = 1;
            score += 35;
            combo++;
        } else if (Math.abs(jud) < 350) {
            $(".jud").text("BRUH")
                .css("color", "aquamarine")
                .css("text-shadow", " 0px 0px 15px rgb(115, 255, 170)");
            $(".fast-late")
                .text((Math.sign(jud) < 0 ? "FAST " : "LATE ") + Math.floor(jud * -1) + "ms")
                .css("color", Math.sign(jud) < 0 ? "blue" : "red");
            $("#" + noteprp[0])
                .addClass("hit");
            comboAni = 1;
            score += 15;
            combo++;
        } else {
            $(".jud").text("MISS")
                .css("color", "lightgray")
                .css("text-shadow", " 0px 0px 20px black");
            $(".fast-late")
                .text((Math.sign(jud) < 0 ? "FAST " : "LATE ") + Math.floor(jud * -1) + "ms")
                .css("color", Math.sign(jud) < 0 ? "blue" : "red");
            combo = "";
        }
        judAni = 1;
        StartIndex = getnote();
        $("#combo").text(combo);
        $("#score").text(score);
    }
    noteprp[4] = true;
    setTimeout(function () {
        $("#" + noteprp[0]).remove();
    }, 500);
}

function getnote() {
    for (let i = 0; i < note.length; i++) {
        if (!note[i][4]) {
            return i;
        }
    }
    return -1;
}

function find(lane) {
    let a = lane.children();
    for (let i = 0; i < lane.children().length; i++) {
        if (!a.hasClass("hit") && a.hasClass("note")) {
            return a.first();
        }
        a = a.nextAll();
    }
    return -1;
}