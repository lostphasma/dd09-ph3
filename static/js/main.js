var playback = {
    playbackElement: document.getElementById("playback-content"),
    path: 'static/assets/',
    category: 1,
    contents: [
        {
            src: '1.mp4', subs: '1.vtt', volume: 1
        },
        {
            src: '2.mp4', subs: '2.vtt', volume: 1
        },
        {
            src: '3.mp4', subs: '3.vtt', volume: 1
        },
        {
            src: '4.mp4', subs: '4.vtt', volume: 1
        },
        {
            src: '5.mp4', subs: '5.vtt', volume: 1
        },
        {
            src: '6.mp4', subs: '6.vtt', volume: 1
        }
    ],
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
        return this.path + this.category + '/' + this.contents[this.current].src;
    },
    set src(i) {
        this.playbackElement.src = this.path + this.category + '/' + this.contents[i].src;
    },
    // setContentVolume: function(bool) {
    //     const incr = 0.1;
        
    //     if (bool == true) {
    //         this.playbackElement.volume = clamp(this.playbackElement.volume + incr, 0, 1).toFixed(2);
    //     } else if (bool == false) {
    //         this.playbackElement.volume = clamp(this.playbackElement.volume - incr, 0, 1).toFixed(2);
    //     } else {
    //         this.src = this.current;
    //         this.playbackElement.volume = this.contents[this.current].volume;        
    //     }

    //     this.contents[this.current].volume = this.playbackElement.volume;
    // },
    setContentVolume: function() {

        const mapper = (num, in_min, in_max, out_min, out_max) => {
            return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
        }

        var a = [].slice.call(document.querySelectorAll(".handle"));
        
        Array.prototype.forEach.call(a, (pt, i) => {
            var attr = pt.getAttribute("cy");
            this.contents[i].volume = clamp(mapper(attr, 0, maxYOffset - jumpOffset, 1, 0), 0, 1);
        })

        this.playbackElement.volume = this.contents[this.current].volume;

    },
    makeCursor: function (DOMelement) {
        var el = document.createElement("DIV");
        el.id = "cursor";
        el.style.visibility = 'hidden';
        document.getElementById(DOMelement).appendChild(el);
        return el;
    },
    setCurrentTime: function(currentTime) {
        this.playbackElement.currentTime = currentTime;
    },
}



//initializing playback object
var cursor = playback.makeCursor("timeline-line");

var PREV_BTN = document.getElementById("previous");
var PLAY_BTN = document.getElementById("play");
var NEXT_BTN = document.getElementById("next");

var HELP_BTN = document.getElementById("help");
var tut = document.getElementById("tutorial");
var trn = parseFloat(getComputedStyle(tut).transitionDuration) * 1000;

var DONE_BTN = document.getElementById("playback-endbutton");

// // object that controls session data recording consent
// var dataConsent = {
//     approvalBtn: document.getElementById("data-yes"),
//     denialBtn: document.getElementById("data-no"),

//     approval: true,

//     // waits for user input by placing 

//     setApproval: function(bool = true, callback = function() {}) {
//         this.approval = bool;
//         this.removeListeners();
//         callback();
//         console.log(`You chose ${bool}`);
//     },

//     init: function(callback = function(){}) {
//         this.approvalBtn.addEventListener('click', () => {
//             this.setApproval(true, callback());
//         });
//         this.denialBtn.addEventListener('click', () => {
//             this.setApproval(false, callback());
//         });
//     },

//     removeListeners: function() {
//         this.approvalBtn.style.pointerEvents = 'none';
//         this.denialBtn.style.pointerEvents = 'none';
//     },

//     saveSessionData: function() {
//         this.approval == true ? {
//             // save the data
//         } : {
//             // don't save the data
//         }
//     }
// };



// object that controls session data recording consent
var dataConsent = {
    approvalBtn: document.getElementById("data-yes"),
    denialBtn: document.getElementById("data-no"),

    approval: true,

    // waits for user input by placing 

    setApproval: function(bool = true, callback = function() {}) {
        this.approval = bool;
        this.removeListeners();
        callback();
        console.log(`You chose ${bool}`);
    },

    init: function(callback = function(){}) {
        this.approvalBtn.addEventListener('click', () => {
            this.setApproval(true, callback());
        });
        this.denialBtn.addEventListener('click', () => {
            this.setApproval(false, callback());
        });
    },

    removeListeners: function() {
        this.approvalBtn.style.pointerEvents = 'none';
        this.denialBtn.style.pointerEvents = 'none';
    },

    saveSessionData: function(callback = function() {}) {
        if (this.approval == true) {
            // save the data
            callback();
            console.log('Data saved!');
        } else {
            // don't save the data
            console.log('Data not saved');
        }
    }
};


// "use strict";
/* global d3, document */
var playButton = {
    el: document.getElementById("play"),

    states: {
        playing: {
            nextState: "paused",
            iconEl: document.querySelector("#pause-icon")
        },
        paused:  {
            nextState: "playing",
            iconEl: document.querySelector("#play-icon")
        }
    },

    animationDuration: 350,

    init: function () {
        this.setInitialState();
        this.replaceUseEl();
        this.el.addEventListener("click", this.goToNextState.bind(this));
    },

    setInitialState: function () {
      var initialIconRef = this.el.querySelector("use").getAttribute("xlink:href");
      var stateName = this.el.querySelector(initialIconRef).getAttribute("data-state");
      this.setState(stateName);
    },

    replaceUseEl: function () {
        d3.select(this.el.querySelector("use")).remove();
        d3.select(this.el.querySelector("svg")).append("path")
            .attr("class", "js-icon")
            .attr("d", this.stateIconPath());
    },

    goToNextState: function () {
        this.setState(this.state.nextState);
    },

    setState: function (stateName) {
        this.state = this.states[stateName];

        // moved transition from goToNextState to here
        // so that setState function can be used with animation
        // and not just cycling
        d3.select(this.el.querySelector(".js-icon")).transition()
            .duration(this.animationDuration)
            .attr("d", this.stateIconPath());
    },

    stateIconPath: function () {
        return this.state.iconEl.getAttribute("d");
    }
};





/* --------------- ======== ---------------- */
/* ---------------- EVENTS ----------------- */

window.onload = () => {
    setSessionid();

    // this function is called only after clicking on either one
    // of the buttons for data collection
    dataConsent.init(() => {
        tut.classList.add("hidden");
        tut.classList.add("translated");
        HELP_BTN.classList.remove('disabled');

        // trick the browser into thinking that the user pressed play
        // then we start the playback after the tutorial closing transition
        playPause();
        playPause();
        
        setTimeout(() => {
            dataConsent.approvalBtn.parentElement.removeChild(dataConsent.approvalBtn);
            dataConsent.denialBtn.parentElement.removeChild(dataConsent.denialBtn);
            
            var cnstxt = document.getElementById("consent-text");
            cnstxt.parentElement.removeChild(cnstxt);
            tut.childNodes[1].style.gridTemplateRows = '1fr 1fr';
            
            // start the audio after the tutorial dialog closes
            playPause();
        }, trn);
    });

    playback.src = 0;
    playback.setContentVolume();
    playButton.init();

    // get entries of last sessions
    getLastEntries();
}

window.onresize = () => {
    playPause();
    playPause();
    // e fammi resizare sta benedetta finestra
    // console.clear();
    resized();
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


HELP_BTN.onclick = () => {
    // console.log(HELP_BTN);
    if (tut.classList.contains("hidden")) {
        tut.classList.remove("hidden");
        tut.classList.remove("translated");
        setTimeout(() => {
            HELP_BTN.innerHTML = 'close';
        }, trn);
    } else {
        tut.classList.add("hidden");
        tut.classList.add("translated");
        HELP_BTN.classList.remove('disabled');
        setTimeout(() => {
            HELP_BTN.innerHTML = 'help';
        }, trn);
    }
};

DONE_BTN.onclick = () => {
    // limit user interaction
    DONE_BTN.style.pointerEvents = 'none';
    document.body.onkeyup = '';

    dataConsent.saveSessionData(function () {

        // animate end of session
        endSession();

        // what do we do after ?

        // dataConsent.saveSessionData(() => {
        //     var data = []
        //     playback.contents.forEach((content) => {
        //         data.push(content.volume.toFixed(2));
        //     })
        //     writeEntry(curve, data);
        // });


    });
}


/* ----------- PLAYBACK RUNTIME ------------ */

// entity used to update cursor position every 100 milliseconds
var stepper;

// stuff to do when playing
playback.playbackElement.addEventListener('play', () => {

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
playback.playbackElement.addEventListener('pause', () => {

    // clearing interval every event change (also next and previous content)
    // otherwise we fire multiple setInterval
    clearInterval(stepper);

    // start to blink
    cursor.classList.add("blink");

    // animate play button to pause state
    playButton.setState('paused');

}, false);



/* ----------- KEYBOARD SUPPORT ------------ */


// TO-DO: Stop listening for keyboard events once DONE_BTN has been clicked
document.body.onkeyup = (e) => {
    switch (e.keyCode) {
        case 32:
            playPause();
            return;
        case 37:
            playPreviousContent();
            return;
        case 38:
            playback.setContentVolume(true);
            return;
        case 39:
            playNextContent();
            return;
        case 40:
            playback.setContentVolume(false);
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


function setSessionid() {
    let url = new URLSearchParams(window.location.search);
    let param = parseInt(url.get('category'));
    playback.category = param;

    var title = document.getElementById("session-title");
    switch (param) {
        case 1:
            title.innerHTML = 'Race';
            return;
        case 2:
            title.innerHTML = 'Gender';
            return;
        case 3:
            title.innerHTML = 'Disability';
            return;
        case 4:
            title.innerHTML = 'Religion';
            return;
        default:
            playback.category = 1;
            title.innerHTML = 'Race';
            return;
    }
}


/* ----------- PLAYBACK FUNCTIONS ---------- */

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
    playback.setContentVolume();
}

function playPreviousContent() {
    clearInterval(stepper);

    const skipThreshold = 0.75;
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

/* --------------- ========= --------------- */


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



/* --------------- NO LONGER USED? --------------- */
// function updateCursorPosition(index) {
//     var els = document.getElementsByClassName("timeline-line-section");
    
//     Array.prototype.forEach.call(els, (el, i) => {
//         if (i == (index * 2) + 1) {
//             // setting position of cursor
//             cursor.style.left = `${el.offsetLeft}px`;
//         }
//     })
    
//     if (cursor.style.visibility != 'visible') {
//         console.log('setting visible');
//         cursor.style.visibility = 'visible';
        
//     } else return;
// }
/* --------------- NO LONGER USED? --------------- */



function endSession() {
    const target = document.getElementById("playback");
    var els = target.children;
    var timing = 1.2;
    var bezier = 'cubic-bezier(0.77, 0, 0.175, 1)';
    var msgEl = document.createElement("DIV");
    msgEl.style.padding = 'var(--sp)';
    msgEl.style.margin = '0px';

    var ops = [{
        fn: function () {
            playback.playbackElement.pause();
            cursor.style.visibility = 'hidden';

            var els = document.getElementsByClassName('timeline-line-section');
            Array.prototype.forEach.call(els, (el) => {
                el.style.backgroundColor = 'transparent';
            })
            DONE_BTN.style.maxHeight = `${DONE_BTN.clientHeight}px`;
        },
        start: 0
    }, {
        fn: function () {
            // remove first two elements that are Children of target
            for (var i = 0; i < 2; i++) {
                els[i].classList.add("hidden");
            }
        },
        start: 0
    }, {
        fn: function () {
            for (var i = 0; i < 2; i++) {
                target.removeChild(els[0]);
            }
            target.style.gridTemplateRows = '1fr';
            DONE_BTN.style.transform = `translateY(${target.clientHeight - (DONE_BTN.clientHeight)}px)`;
        },
        start: 0.5
    }, {
        fn: function () {
            DONE_BTN.style.transition = `max-height ${timing}s ${bezier}, transform ${timing}s ${bezier}`;
            DONE_BTN.style.transform = `translateY(0px)`;
            DONE_BTN.style.maxHeight = '100%';
            DONE_BTN.style.width = '100%';

            DONE_BTN.children[0].style.opacity = '0';
        },
        start: 1
    }, {
        fn: function () {
            DONE_BTN.removeChild(DONE_BTN.children[0]);
            msgEl.style.opacity = '0';
            msgEl.style.transition = `opacity ${timing / 3}s linear`;
            DONE_BTN.appendChild(msgEl);
        },
        start: 1.5
    }, {
        fn: function () {
            msgEl.style.opacity = '1';
            msgEl.innerHTML = `
            <p>This is how an IT company that uses traditional filtering methods would moderate the same&nbsp;contents.</p>
            <p>No shades, no debates, just one point of view and it does not depend on&nbsp;you.</p>
            <p>Do you like the noise of&nbsp;silence?</p>`;

            // anima linee (curves.js)
            animateLines();
        },
        start: 3
    }, {
        fn: function () {
            msgEl.style.opacity = '0';
        },
        start: 9
    }, {
        fn: function () {
            msgEl.innerHTML = `
            <p>Let us introduce you to our alternative contents regulation&nbsp;method.</p>
            <p>With this approach nothing will be censored. The&nbsp;community will decide how much visibility to give to each&nbsp;content, helping to create a civic&nbsp;moderation.</p>
            <p>Don’t&nbsp;mute! Down-Vote!</p><br>`;
            msgEl.style.opacity = '1';
        },
        start: 10
    }]

    // micro-function to compute timers?
    // maybe: forEach obj.start in ops
    // calculate timeout by adding previous
    // objects in endOps array
    ops.forEach((op) => {
        setTimeout(() => {
            op.fn();
        }, op.start * 1000);
    });
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

function mutePlayback(currVol) {
    currVol == 0 ? playback.playbackElement.volume = 1 : playback.playbackElement.volume = 0;
}

const mapper = (num, in_min, in_max, out_min, out_max) => {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function clamp(val, min, max) {
    return val > max ? max : val < min ? min : val;
}

/* --------------- ========= --------------- */