window.onload = () => {
    document.title = setSessionid();
};

window.onresize = () => {
    playback.playPause();
    playback.playPause();
    // e fammi resizare sta benedetta finestra || che bello edo quando trovo ste cose nel codice <3
    // console.clear();
    resized();
}

playback.playbackElement.onended = () => {
    playback.playNextContent();
};






/* ----------- PLAYBACK RUNTIME ------------ */

// entity used to update cursor position every 100 milliseconds
var stepper;

// stuff to do when playing
playback.playbackElement.addEventListener('play', () => {

    playback.setContentVolume();

    // save current track index
    var c = playback.current;

    // compute left coordinate for cursor position
    var start = getStartingPoint(c);
    
    // setTimeout interval constant
    const ms = 100;

    stepper = setInterval(() => {
        // update cursor position and increment it 
        stepOn(start);
    }, ms);

    // stop blinking (interrupt pause state)
    cursor.classList.remove("blink");

    setTimeout(() => {

        // highlight current track's area
        setTimeline(c);

        // if hidden, show playback cursor
        if (cursor.style.visibility != 'visible') {
            cursor.style.visibility = 'visible';
        } else return;

    }, ms);

    // animate play button to play state 
    playButton.setState('playing');

}, false);


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

function hightlightTimelineMarker(markerClassName) {
    var els = document.getElementsByClassName('timeline-line-section');

    Array.prototype.forEach.call(els, (el) => {
        var attribute = el.getAttribute("js-spacer");

        if (attribute == markerClassName) {
            el.style.backgroundColor = 'var(--c-bg)';

        } else el.style.backgroundColor = 'transparent';
    })
}

function setTimeline(which) {
    // updateCursorPosition(which);
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

// increments cursor position, given a point to start from
function stepOn(startPoint) {
    var t = playback.currentTime;
    var d = playback.totalTime;
    var w = document.querySelectorAll(".timeline-line-section.bar")[0].clientWidth * 2;
    var r = (startPoint + mapper(t, 0, d, 0, w)).toFixed(2);
    cursor.style.left = `${r}px`;

    // function n(n){
    //     return n > 9 ? "" + Math.round(n): "0" + Math.round(n);
    // }

    // document.getElementById("timecode").innerHTML = `${n(t)}`;
}






// ---------------------------------------------------------
// ------------------------ FUNCTIONS
// ---------------------------------------------------------

function setSessionid() {
    let url = new URLSearchParams(window.location.search);
    let param = parseInt(url.get('category'));
    var pageStr = 'Results for category ';

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