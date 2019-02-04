// ------------ ------------- ------------
// ------------ ANIMATE LINES ------------
// ------------ ------------- ------------

// svg.selectAll("g.users-layer").remove();
var usersLayer = d3.select("#mask-line").append('g').attr('class', 'users-layer');

function animateLines() {
    var p = curva_arrivo;

    const ease = 'easeInOutQuad';
    const duration = 1500;

    // Elabora il d della curva d'arrivo in funzione dei punti
    // ca = [
    //     //x y
    //     'M', parseInt(p[0].x), ',', parseInt(p[0].y),
    //     //x1 y1 x2 y2 x y
    //     'C', +' ' + parseInt(p[0].x) + (handleOffset/4), ',', parseInt(p[0].y), ' ', parseInt(p[1].x) - handleOffset, ',', parseInt(p[1].y), ' ', parseInt(p[1].x), ',', parseInt(p[1].y),
    //     //x2 y2 x y
    //     'S', +' ' + parseInt(p[2].x) - handleOffset, ',', parseInt(p[2].y), ' ', parseInt(p[2].x), ',', parseInt(p[2].y),
    //     ' ', parseInt(p[3].x) - handleOffset, ',', parseInt(p[3].y), ' ', parseInt(p[3].x), ',', parseInt(p[3].y),
    //     ' ', parseInt(p[4].x) - handleOffset, ',', parseInt(p[4].y), ' ', parseInt(p[4].x), ',', parseInt(p[4].y),
    //     ' ', parseInt(p[5].x) - handleOffset, ',', parseInt(p[5].y), ' ', parseInt(p[5].x), ',', parseInt(p[5].y),
    //     ' ', parseInt(p[6].x) - handleOffset, ',', parseInt(p[6].y), ' ', parseInt(p[6].x), ',', parseInt(p[6].y),
    //     ' ', parseInt(p[7].x) - (handleOffset/4), ',', parseInt(p[7].y), ' ', parseInt(p[7].x), ',', parseInt(p[7].y)
    // ].join('');
    

    // -----
    // ----- TIMELINE DECLARATION
    // -----
    var tl = anime.timeline({
        easing: ease,
        duration: duration
    });

    // anima la curva della sessione fino alla curva d'arrivo
    tl.add({
            targets: '.curves',
            d: ca,
        }, 0)
        // le maniglie diventano rosse
        .add({
            targets: '.handle-behind',
            cy: maxYOffset - jumpOffset,
            complete: function () {
                var b = d3.select("body").selectAll(".handle-behind");

                b[0].forEach((pt) => {
                    pt.style.pointerEvents = "none";
                    pt.getAttribute("cy") > maxYOffset - jumpOffset - 100 ? pt.classList.add("redHandleBehind") : pt.classList.remove("redHandleBehind");
                })
            }
        }, 0)
        .add({
            targets: '.handle',
            cy: maxYOffset - jumpOffset,
            complete: function () {
                var a = d3.select("body").selectAll(".handle");

                a[0].forEach((pt) => {
                    pt.style.pointerEvents = "none";
                    pt.getAttribute("cy") > maxYOffset - jumpOffset - 100 ? pt.classList.add("redHandle") : pt.classList.remove("redHandle")
                })
            }
        }, 0)
        // rende visibili le curve delle altre sessioni e le anima
        .add({
            targets: '.users-curve',
            d: function (el, i) {
                return curves_data[i].d
            },
            begin: function () {
                var a = usersLayer.selectAll('path.users-curve');
                a[0].forEach((pt) => {
                    pt.classList.add("user-curve-anim")
                })
            }, 
            delay: anime.stagger(100)
        }, '+=' + duration)
        .add({
            targets: '.curves',
            d: d3.select('.curves').attr('d')
        }, '-=' + duration)
        .add({
            targets: '.handle',
            opacity: 0,
            duration: 500,
            easing: 'linear'
        }, '-=' + (duration + 500))
        .add({
            targets: ' .handle-behind',
            opacity: 0,
            duration: 500,
            easing: 'linear'
        }, '-=' + (duration + 500));

}



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

            var resultsLink = document.createElement("A");
            resultsLink.href = 'results.html';
            resultsLink.innerHTML = 'See the results';
            resultsLink.style.pointerEvents = 'all';
            resultsLink.style.textDecoration = 'underline';
            msgEl.append(resultsLink);

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
