var TL = document.getElementById("content-grid");
var SLKTR = document.getElementById("content-selector");
var AVG = [];


window.onload = () => {
    document.title = setSessionid();
    getAverages(AVG);
    getLastEntries(30, false);

    playback.current = 0;
    SLKTR.children[playback.current].classList.add("playing");
    playback.playbackElement.play();
    playback.setSrc();

    hightlightTimelineMarker(playback.current);
};

window.onresize = () => {
//     playback.playPause();
//     playback.playPause();
//     // e fammi resizare sta benedetta finestra, Per Diana || che bello edo quando trovo ste cose nel codice <3
//     console.clear();
    resized();
}

SLKTR.onclick = (e) => {
    // really not elegant way of getting content index
    var ci = parseInt(e.target.innerHTML) - 1;
    setResultSrc(e, ci);
}



TL.onclick = (e) => {
    // content index
    var ci = Math.floor(getChildIndex(e) / 2);
    setResultSrc(e, ci);
}



/* ----------- PLAYBACK RUNTIME ------------ */

playback.playbackElement.addEventListener('ended', () => {
    document.querySelector(".selector.playing").classList.remove("playing");
    document.querySelector(".selector.playing").classList.add("paused");
},false)

// stuff to do when playing
// playback.playbackElement.addEventListener('play', () => {

// }, false);


// stuff to do when paused
// playback.playbackElement.addEventListener('pause', () => {

    // clearing interval every event change (also next and previous content)
    // otherwise we fire multiple setInterval
    // clearInterval(stepper);

    // start to blink
    // cursor.classList.add("blink");

    // animate play button to pause state
    // playButton.setState('paused');

// }, false);



/* ----------- TIMELINE FUNCTIONS ---------- */

function hightlightTimelineMarker(which) {
    var els = document.getElementById("content-grid");
    var pla = document.querySelectorAll(".content-grid-bar.playing");

    for (var i = 0; i < pla.length; i++) {
        pla[i].classList.remove("playing");
    }

    els.children[which * 2].classList.add("playing");
    els.children[which * 2 + 1].classList.add("playing");

    return which;
}






// ---------------------------------------------------------
// ------------------------ FUNCTIONS
// ---------------------------------------------------------

function setSessionid() {
    let url = new URLSearchParams(window.location.search);
    let param = parseInt(url.get('category'));
    var pageStr = 'Results for category ';
    playback.category = param;

    switch (param) {
        case 1:
            return pageStr + 'Race';
        case 2:
            return pageStr + 'Gender';
        case 3:
            return pageStr + 'Disability';
        case 4:
            return pageStr + 'Religion';
        default:
            return pageStr + 'Race';
    }
}

function setColor() {
    var url = new URLSearchParams(window.location.search);
    var param = parseInt(url.get('category'));

    var color = (function(param) {
        switch (param) {
            case 1:
                return '#003aff';
            case 2:
                return '#f3c605';
            case 3:
                return '#56efb6';
            case 4:
                return '#fa8b2e';
            default:
                return '#003aff';
        }
    })(param);

    // setto all'elemento :root per maniglie
    document.documentElement.style.setProperty('--strc', color);

    // ritorno valore per assegnare colore a linea tramite d3
    return color;
}

function setResultSrc(e, ci) {
    playback.current = ci;

    // content element
    var ce = SLKTR.children[ci];
    
    // if click on selector that's playing
    if (e.target.classList.contains("playing") && !playback.playbackElement.paused) {
        ce.classList.remove("playing");

        ce.classList.add("paused");
        playback.playbackElement.pause();

    } else if (e.target.classList.contains("paused") && playback.playbackElement.paused) {
        ce.classList.remove("paused");

        ce.classList.add("playing");
        playback.playbackElement.play();

    // if click on selector that's NOT playing
    } else {
        for (var i = 0; i < SLKTR.children.length; i++) {
            SLKTR.children[i].classList.remove("playing");
            SLKTR.children[i].classList.remove("paused");
        }
        playback.setSrc();
        SLKTR.children[ci].classList.add("playing");
    }

    hightlightTimelineMarker(ci);

    computeAvg(ci);
}

function getChildIndex(e) {
    var p = e.target.parentElement;
    var c = p.children;
    
    for (var i = 0; i < c.length; i++) {
        if (c[i] == e.target) {
            return i;
        }
    }
}

function computeAvg(i) {
    var cavg = Math.round(getContentAverage(AVG, i+1) * 100);
    isNaN(cavg) ? cavg = 'n.a.' : cavg;
    document.getElementById("content-info").children[2].innerHTML = `${cavg}%`;
}

function showContentInfo(c = 0) {
    return c+1;
}