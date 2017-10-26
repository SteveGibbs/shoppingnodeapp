/*
var $acc = $(".accordion");
var i;
for(i=0; i <$acc.length; i++) {
    $acc[i].onclick = function(){
        console.log("this is awesome")
        var panel = this.nextElementSibling;
        //var panel = $(".accordion-sibling");
        if ($(".accordion-sibling").style.display ==="block"){
            console.log("display should be none");
            $(".accordion-sibling").style.display = "none";
        } else {
            $(".accordion-sibling").style.display = "block";
        }
    }
};

console.log("accordion.js has been accessed");

var accordion = $('.accordion');
accordion.onclick = function() {
    console.log('key pressed');
};
*/
var acc = document.getElementsByClassName("accordion");
console.log(acc);
var i;
for (i = 0; i < acc.length; i++) {
    acc[i].onclick = function() {
        console.log("testing");
        this.classList.toggle("active");
        /* Toggle between hiding and showing the active panel */
        var panel = this.nextElementSibling;
        console.log(panel);
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    };
}