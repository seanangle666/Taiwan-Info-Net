let i = 0;
let q = [];
let r = [];
let s = [];
let sliderval;
$(document).ready(function () {
    sliderval = [$("#myRange"), 0, 0, false];
    console.log(sliderval[0].val());
    for (let index = 0; index < $('input[name="field2"][type="checkbox"]').length; index++) {
        q.push(0);
    }
    for (let index = 0; index < $('input[name="field2"][type="radio"]').length; index++) {
        r.push([0, 0, Math.random() * 5 - 2.5, 0]);
    }
    $("body").append("<p id=\"arrar\">hii</p>");
    setInterval(update, 20)
    setInterval(function (e) {

        let name = $("input[name='inp1']");
        if (name.val() != "") {
            let uuuu = Math.random() * 1000
            $("body").append("<p id=\"launch\" name='" + uuuu + "'>" + name.val()[0] + "</p>");
            s.push([uuuu, $(name).offset().top + 45, 0, 10, Math.random() * -2]);
        }
        name.val(name.val().slice(1));

    }, 50)
    $("#sendout").hover(
        function () {
            if (Math.random() < 0.5) {
                $(this)
                    .css("top", Math.random() * 200 - 100)
                    .css("left", Math.random() * 200);
            }
        }
    );
    $("#sendout").click(function () {
        let tempalert = "";
        if ($("input[name='inp1']").val() == "") {
            tempalert = tempalert + "null";
        } else {
            tempalert = tempalert + "你的名字是" + $("input[name='inp1']").val();
        }
        if ($("input[name='field3'][type=\"radio\"]").first().prop('checked')) {
            tempalert = tempalert + "，你確定你要報名志願役嗎？？"; let h = confirm(tempalert);
            if (h) {
                let ydwutf = Math.floor(Math.random() * 10);
                for (let i = 0; i < ydwutf; i++) {
                    let qqq = Math.floor(Math.random() * 5);
                    switch (qqq) {
                        case 0:
                            h = confirm("你確定？？？")
                            break;
                        case 1:
                            h = confirm("要確定喔？？？")
                            break;
                        case 2:
                            h = confirm("你要確欸？？？")
                            break;
                        case 3:
                            h = confirm("Are you serious???")
                            break;
                        case 4:
                            h = confirm("真的確定嗎？？？")
                            break;
                        default:
                            break;
                    }

                    if (!h) {
                        window.location.href = "https://rdrc.mnd.gov.tw/RdrcWeb/Schedule/Soldier";
                        break;
                    }
                }
                window.location.href = "https://rdrc.mnd.gov.tw/RdrcWeb/Schedule/Soldier";
            }
        }
        window.location.href = "https://rdrc.mnd.gov.tw/RdrcWeb/Schedule/Soldier";

    });
    $("#myRange").focus(function () {
        sliderval[3] = true;
        console.log(sliderval[0].val());
        
    });
    $("#myRange").blur(function () {
        sliderval[1] = 0;
        console.log(sliderval[0].val());
        sliderval[2] = parseFloat(sliderval[0].val());
        console.log(sliderval[2]);
        console.log(sliderval[1]);
        sliderval[3] = false;
    });
});

function update(e) {
    $("#agge").text(sliderval[0].val());
    if (!sliderval[3]) {
        console.log([sliderval[0].val(),sliderval[1],sliderval[2],sliderval[3]]);
        sliderval[1] += 0.1;
        sliderval[2] += sliderval[1];
        sliderval[2] = parseFloat(sliderval[2]);
        sliderval[0].val(sliderval[2]);
        if(sliderval[2] > sliderval[0].attr("max")){
            sliderval[2] = sliderval[0].attr("max");
            sliderval[1] = sliderval[1]*-0.7;
        }
    }

    i++;
    $("#arrar")
        .css("left", Math.pow(Math.sin(i / 30), 2) * 100 + "%");
    $("input[name='inp1']")
        .css("rotate", "x " + i * 9 % 360 + "deg")
        .css("rotate", "z " + -10 + "deg");
    $("#sel1")
        .css("rotate", "y " + Math.pow(Math.sin(i / 100), 2) * 360 + "deg")
        .css("width", Math.pow(Math.sin(i / 7), 2) * 200 + 100 + "px")
        ;
    $("input[bruh]")
        .css("rotate", "y " + i * 128 % 360 + "deg")
        .css("text-shadow", "1px 1px 5px black");

    $("div[ua]")
        .css("text-shadow", Math.sin(i / 3) * 5 + "px " + Math.cos(i / 3) * 5 + "px 1px rgb(255, 221, 0)")
        .css("rotate", (i * 1.4) % 360 + "deg")
        .css("font-size", Math.pow(Math.sin(i / 50), 2) * 10 + 10 + "px");
    for (let index = 0; index < s.length; index++) {
        $("#launch[name='" + s[index][0] + "']").css("top", s[index][1] + "px");
        $("#launch[name='" + s[index][0] + "']").css("left", s[index][3] + "px");
        s[index][2] += 0.3;
        s[index][1] += s[index][2];
        s[index][3] += s[index][4];
        if (s[index][3] < 0) {
            s[index][4] = s[index][4] * -1;
            s[index][3] = 0;
        }
        if (s[index][1] > $(window).height() - 20) {
            $("#launch[name='" + s[index][0] + "']").remove();
            s[index].pop();
        }
    }
    let v = $('input[name="field2"][type="checkbox"]').first();
    for (let index = 0; index < $('input[name="field2"][type="checkbox"]').length; index++) {
        v.css("rotate", q[index] + "deg");
        if (v.prop('checked')) {
            q[index] = q[index] * 1.1 + 1;
            if (q[index] > 1000) {
                q[index] = q[index] / 10;
            }
        } else {
            q[index] = q[index] * 0.75;
            q[index] = q[index] % 360;
        }
        v = v.next();
    }

    let w = $('input[name="field2"][type="radio"]').first();
    for (let index = 0; index < $('input[name="field2"][type="radio"]').length; index++) {
        if (w.prop('checked')) {
            r[index][3] += 0.5;
            r[index][1] += r[index][3];
            r[index][0] += r[index][2];
            if (r[index][1] >= 400) {
                r[index][1] = 400;
                r[index][3] = r[index][3] * -0.8;
                r[index][2] = r[index][2] * 0.8;
            }
            w.css("top", r[index][1] + "px");
            w.css("left", r[index][0] + "px");
        } else {

        }
        w = w.next();
    }

}
