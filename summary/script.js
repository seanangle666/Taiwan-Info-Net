let i = 0;
let q = [];
let r = [];
let s = [];
$(document).ready(function () {

    for (let index = 0; index < $('input[name="field2"][type="checkbox"]').length; index++) {
        q.push(0);
    }
    for (let index = 0; index < $('input[name="field2"][type="radio"]').length; index++) {
        r.push([0, 0, Math.random() * 5 - 2.5, 0]);
    }
    $("body").append("<p id=\"arrar\">hii</p>");
    setInterval(update, 20)
    setInterval(function(e){
        
        let name = $("input[name='inp1']");
        if(name.val() != ""){
            let uuuu = Math.random()*1000
            $("body").append("<p id=\"launch\" name='"+uuuu+"'>"+name.val()[0]+"</p>");
            s.push([uuuu,$(name).offset().top+45,0,10,Math.random()*-2]);
        }
        name.val(name.val().slice(1));
        
    }, 50)
    $("#sendout").hover(
        function() {
            console.log("hbdwbhed");
          $(this)
          .css("top",Math.random()*200-100)
          .css("left",Math.random()*200);
        }
      );
});

function update(e) {
    i++;
    $("#arrar")
        .css("left", Math.pow(Math.sin(i / 30), 2) * 100 + "%");
    $("input[name='inp1']")
        .css("rotate", "x "+i * 9 % 360+"deg")
        .css("rotate", "z "+-10+"deg");
    $("#sel1")
        .css("rotate", "y " + Math.pow(Math.sin(i / 100), 2) * 360 + "deg")
        .css("width", Math.pow(Math.sin(i / 7), 2) * 200 + 100 + "px")
        ;
    $("input[bruh]")
        .css("rotate", "y " + i * 128 % 360+ "deg")
        .css("text-shadow", "1px 1px 5px black");

    $("div[ua]")
        .css("text-shadow", Math.sin(i / 3) * 5 + "px " + Math.cos(i / 3) * 5 + "px 5px rgb(255, 221, 0)")
        .css("rotate", (i * 1.4) % 360 + "deg")
        .css("font-size", Math.pow(Math.sin(i / 50), 2) * 10 + 10 + "px");
    for (let index = 0; index < s.length; index++) {
        $("#launch[name='"+s[index][0]+"']").css("top",s[index][1]+"px");
        $("#launch[name='"+s[index][0]+"']").css("left",s[index][3]+"px");
        s[index][2] += 0.3;
        s[index][1] += s[index][2];
        s[index][3] += s[index][4];
        if(s[index][3] < 0){
            s[index][4] = s[index][4]*-1;
            s[index][3] = 0;
        }
        if(s[index][1] > $(window).height()-20){
            $("#launch[name='"+s[index][0]+"']").remove();
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
