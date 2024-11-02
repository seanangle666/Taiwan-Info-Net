let note = [];
let startTime = Date.now();
let sp = $("#speed").val() * 10;
let objNums = 0;
let combo = 0;
let comboAni = 0;
let StartIndex = 0;
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
$(document)
    .ready(function () {
        $("#jdline")
            .css("top", $("#r1").offset().top + 500)
            .css("width", $(window).innerWidth());

        for (let i = 0; i < 100; i++) {
            noteAdd(Math.floor(Math.random() * 0.999999 * 4), i, i / 1, Math.round(Math.random()) * 0);
        }
        setInterval(update, 15)
    })
    .keydown(function (e) {
        let ka = e.key;
        if (!keys[ka] && keys[ka] != null) {
            console.log(ka + " down");
            keys[ka] = true;
            setTimeout(function () {
                console.log(ka + " down delay");
                keys[ka + "_delay"] = true;
            }
                , 10);
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
    comboAni = comboAni * 0.95;
    sp = $("#speeed").val() * 10;
    for (let index = StartIndex; index < (StartIndex + 200 > note.length ? note.length : StartIndex + 200); index++) {
        let noteprp = note[index];
        let noteid = noteprp[0];
        let notepos = noteprp[1];
        let notehold = noteprp[3];let lane = $("#r" + (notepos + 1));
        let t_s = (Date.now() - startTime) / 1000 - noteprp[2];
        if ($("#" + noteid).length == 0 && !noteprp[4]) {
            lane.append("<div class=\"note hid\" id=\"" + noteid +
                "\"><div class = \"hold\" id = \"h_" + noteid
                + "\"></div></div>");
        }
        if (t_s * sp > -500 && t_s * sp < 50) {
            $("#" + noteid)
                .removeClass("hid")
                .css("z-index", StartIndex + 200 - index);
        } else {
            $("#" + noteid)
                .addClass("hid");
        }
        if (!$("#" + noteid).hasClass("hit")) {
            $("#" + noteid)
                .css("top", t_s * sp + 15 + 500 + "px");
            $("#h_" + noteid)
                .css("height", (notehold * sp) + "px")
                .css("top", (notehold * sp * -1) + 15 + "px");
            if (Math.abs(t_s) <= 1 && keys[keyset[notepos]] && lane.children().first().attr("id") == noteid) {

                if (notehold == 0) {
                    if (!keys[keyset[notepos] + "_delay"]) {
                        hit(noteprp);
                    }
                } else if (t_s - notehold > 0) {
                    hit(noteprp);
                } else {
                    $("#" + noteid)
                        .css("top", 0 + 15 + 500 + "px");
                    $("#h_" + noteid)
                        .css("height", ((t_s - notehold) * sp * -1) + "px")
                        .css("top", ((t_s - notehold) * sp) + 15 + "px");
                }

            } else if (t_s > 1 && !noteprp[4]) {
                combo = "";
                $("#" + noteprp[0]).remove();
                $("#combo").text(combo);
                StartIndex = getnote();
                noteprp[4] = true;
            }
        }
    }
}

function hit(noteprp) {
    $("#" + noteprp[0])
        .removeClass("note")
        .addClass("hit")
        .css("top", 0 + 15 + 500 + "px");
    $("#h_" + noteprp[0])
        .removeClass("hold");
    if (!noteprp[4]) {
        comboAni = 1;
        combo++;
        StartIndex = getnote();
        $("#combo").text(combo);
    }
    noteprp[4] = true;
    setTimeout(function () {
        $("#" + noteprp[0]).remove();
    }, 500);
}

function getnote() {
    let t = -1;
    for (let i = 0; i < note.length; i++) {
        if (!note[i][4]) {
            t = i;
            break;
        }
    }
    return t;
}