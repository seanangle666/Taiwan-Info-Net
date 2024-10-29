let i = 0;
let q =[];
let r =[];

$(document).ready(function () {
    
    for (let index = 0; index < $('input[name="field2"][type="checkbox"]').length; index++) {
        q.push(0);
    }
    for (let index = 0; index < $('input[name="field2"][type="radio"]').length; index++) {
        r.push([0,0,Math.random()*10-5,0]);
    }
    $("body").append("<p id=\"arrar\">hii</p>");
    setInterval(update,15)
    $("body").append("<p id=\"launch\">bhbc</p>");
});

function update(e) {
    i++;
    $("p")
    .css("left",Math.pow(Math.sin(i/30),2)*100+"%");
    $("#sel1")
    .css("rotate","y "+Math.pow(Math.sin(i/17),2)*360+"deg")
    .css("width",Math.pow(Math.sin(i/7),2)*200+100+"px");
    $("input[bruh]")
    .css("rotate","y "+Math.sin(i/5)*180+"deg")
    .css("text-shadow","1px 1px 5px black");
    $("div[ua]")
    .css("text-shadow",Math.sin(i/3)*5+"px "+Math.cos(i/3)*5+"px 5px rgb(255, 221, 0)")
    .css("rotate",(i*1.4)%360+"deg")
    .css("font-size",Math.pow(Math.sin(i/50),2)*10+10+"px");
    let v = $('input[name="field2"][type="checkbox"]').first();
    for (let index = 0; index < $('input[name="field2"][type="checkbox"]').length; index++) {
        v.css("rotate",q[index]+"deg");
        if(v.prop('checked')){
            q[index]=q[index]*1.1+1;
            if(q[index]>1000){
                q[index] = q[index] / 10;
            }
        }else{
            q[index]=q[index]*0.75;
            q[index] = q[index]%360;
        }
        v = v.next();
    }
    let w = $('input[name="field2"][type="radio"]').first();
    for (let index = 0; index < $('input[name="field2"][type="radio"]').length; index++) {
        if(w.prop('checked')){
            r[index][3]+=0.5;
            r[index][1]+=r[index][3];
            r[index][0]+=r[index][2];
            if(r[index][1]>=400){
                r[index][1]=400;
                r[index][3]=r[index][3]*-0.8;
                r[index][2]=r[index][2]*0.8;
            }
            w.css("top",r[index][1]+"px");
            w.css("left",r[index][0]+"px");
        }else{

        }
        w = w.next();
    }
}
