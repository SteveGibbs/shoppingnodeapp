
var $acc = $(".accordion");
var i;
for(i=0; i <$acc.length; i++) {
    $acc[i].onclick = function(){
        console.log("this is awesome")
        var panel = this.nextElementSibling;
        if (panel.style.display ==="block"){
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    }
};

console.log("accordion.js has been accessed");

var accordion = $('.accordion');
accordion.onclick = function() {
    console.log('key pressed');
};
