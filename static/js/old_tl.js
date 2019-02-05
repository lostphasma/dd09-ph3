function old_endSession() {
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
            endSession();
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
