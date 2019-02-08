var resized = false;

window.onload = () => {
    var b = document.body;
    checkClientSize(b.clientWidth, b.clientHeight);    
}

window.addEventListener('resize', () => {
    var b = document.body;
    checkClientSize(b.clientWidth, b.clientHeight);    
})

function checkClientSize(w, h) {
    var el = document.getElementById("content");

    if (w <= 640 || h <= 720 && resized == false) {
        el.style.visibility = 'hidden';
        makeWall();
        resized = true;

    } else if (w >= 640 || h >= 720 && resized == true) {
        el.style.visibility = 'visible';
        breakWall();
        resized = false;
    };

    function makeWall() {
        var div = document.createElement("div");
        div.id = 'wall';
        document.getElementById("wrapper").appendChild(div);
    };
    
    function breakWall() {
        div.classList.add('hidden');
    }

}