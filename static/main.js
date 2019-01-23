var playback = {
    playbackElement: document.getElementById("playback-content"),
    path: 'static/assets/1/',
    contents: ['1.mp4', '2.3.mp4', '3.mp4', '4.mp4', '5.mp4', '6.mp4'],
    volumes: [1, 1, 1, 1, 1, 1],
    current: 0,
    get contentsLength() {
        return this.contents.length;
    },
    get currentTime() {
        return this.playbackElement.currentTime;
    },
    get totalTime() {
        return this.playbackElement.duration;
    },
    get src() {
        return this.path + this.contents[this.current];
    },
    set src(i) {
        this.playbackElement.src = this.path + this.contents[i];
        this.current = i;
    },
    // TO-DO: volume function?
    set contentVolume(i) {
        this.playbackElement.volume = i;
    },
    makeCursor: function (DOMelement) {
        var el = document.createElement("DIV");
        el.id = "cursor";
        el.style.visibility = 'hidden';
        document.getElementById(DOMelement).appendChild(el);
        return el;
    },
    setCurrentTime: function (currentTime) {
        this.playbackElement.currentTime = currentTime;
    },
}
//initializing playback object
var cursor = playback.makeCursor("timeline-line");
playback.src = 0;

var PREV_BTN = document.getElementById("previous");
var PLAY_BTN = document.getElementById("play");
var NEXT_BTN = document.getElementById("next");

/* --------------- ========= --------------- */
/* ---------------- EVENTS ----------------- */

window.onresize = () => {
    playPause();
    playPause();
    // e fammi resizare sta benedetta finestra
    console.clear();
}

PREV_BTN.onclick = () => {
    playPreviousContent();
}

PLAY_BTN.onclick = () => {
    playPause();
}

playback.playbackElement.onended = () => {
    playNextContent();
};

NEXT_BTN.onclick = () => {
    playNextContent();
}

// playback runtime
var stepper; // entity used to update cursor position every 100 milliseconds
playback.playbackElement.addEventListener('play', () => {

    var c = playback.current;

    var start = getStartingPoint(c);
    stepper = setInterval(() => {
        var t = playback.currentTime;
        var d = playback.totalTime;
        var w = document.querySelectorAll(".timeline-line-section")[1].clientWidth * 2;
        var r = (start + mapper(t, 0, d, 0, w)).toFixed(2);
        cursor.style.left = `${r}px`;

        // function n(n){
        //     return n > 9 ? "" + Math.round(n): "0" + Math.round(n);
        // }

        // document.getElementById("timecode").innerHTML = `${n(t)}`;

    }, 100);

    cursor.classList.remove("blink");

    setTimeout(() => {
        setTimeline(c);
        if (cursor.style.visibility != 'visible') {
            cursor.style.visibility = 'visible';
        } else return;
    }, 100);

}, false);

playback.playbackElement.addEventListener('pause', () => {
    // clearing interval every event change (also next and previous content)
    // otherwise we fire multiple setInterval
    clearInterval(stepper);

    cursor.classList.add("blink");

}, false);

// keyboard support
document.body.onkeyup = (e) => {
    switch (e.keyCode) {
        case 32:
            playPause();
            return;
        case 37:
            playPreviousContent();
            return;
        case 39:
            playNextContent();
            return;
        case 77:
            // current volume as a parameter
            mutePlayback(playback.playbackElement.volume);
            return;
        default:
            // console.log(e.keyCode);
            return;
    }
}

/* --------------- ========= --------------- */



/* --------------- ========= --------------- */
/* --------------- FUNCTIONS --------------- */

function playPause() {
    if (playback.playbackElement.paused) {
        playback.playbackElement.play().catch((error) => {
            console.log("Error: " + error);
        });
    } else {
        playback.playbackElement.pause();
    }
}

function setSrc() {
    playback.src = playback.current;
    playPause();
}

function playPreviousContent() {
    clearInterval(stepper);

    const skipThreshold = 0.5;
    if (playback.currentTime > skipThreshold) {
        playback.setCurrentTime(0);

    } else if (playback.currentTime <= skipThreshold) {

        if (playback.current <= 0) {
            playback.current = playback.contents.length - 1;
        } else {
            playback.current -= 1;
        };

    }

    setSrc();
}

function playNextContent() {
    clearInterval(stepper);

    if (playback.current >= playback.contents.length - 1) {
        playback.current = 0;

    } else playback.current += 1;

    setSrc();
}

function hightlightTimelineMarker(markerClassName) {
    var els = document.getElementsByClassName('timeline-line-section');

    Array.prototype.forEach.call(els, (el) => {
        var attribute = el.getAttribute("js-spacer");

        if (attribute == markerClassName) {
            el.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';

        } else el.style.backgroundColor = 'transparent';
    })
}

function setTimeline(which) {
    // updateCursorPos(which);
    switch (which) {
        case 0:
            hightlightTimelineMarker('first');
            return;
        case 1:
            hightlightTimelineMarker('second');
            return;
        case 2:
            hightlightTimelineMarker('third');
            return;
        case 3:
            hightlightTimelineMarker('fourth');
            return;
        case 4:
            hightlightTimelineMarker('fifth');
            return;
        case 5:
            hightlightTimelineMarker('sixth');
            return;
        default:
            console.log('something\'s wrong!');
            return;
    }
}

// plug playback.current to get current timeline starting point 
// for incrementing cursor position
function getStartingPoint(index) {
    var els = document.getElementsByClassName("timeline-line-section");
    var result;

    Array.prototype.forEach.call(els, (el, i) => {
        if (i == (index * 2) + 1) {
            // getting coordinate of given section starting (leftmost) point
            result = el.offsetLeft;
        }
    })
    return result;
}

function updateCursorPos(index) {
    var els = document.getElementsByClassName("timeline-line-section");

    Array.prototype.forEach.call(els, (el, i) => {
        if (i == (index * 2) + 1) {
            // setting position of cursor
            cursor.style.left = `${el.offsetLeft}px`;
        }
    })
    cursor.style.visibility = 'visible';
}

function mutePlayback(currVol) {
    currVol == 0 ? playback.playbackElement.volume = 1 : playback.playbackElement.volume = 0;
}

const mapper = (num, in_min, in_max, out_min, out_max) => {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

/* --------------- ========= --------------- */