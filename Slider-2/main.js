// array per la posizione dei punti, si aggiorna ad ogni drag
var point_positions = [];

// array per storare le curve degli utenti
var curves_data = [];

//multiple lines non serve
// var json_data_muliple_lines = [[{"id": "82","x": "50","y": "50"}, {"id": "83","x": "25","y": "110"}, {"id": "97","x": "90","y": "150"}, {"id": "98","x": "150","y": "224"}, {"id": "99","x": "250","y": "150"}, {"id": "100","x": "300","y": "200"}, {"id": "100","x": "320","y": "230"}],[{"id": "1","x": "120","y": "60"}, {"id": "2","x": "30","y": "150"}, {"id": "3","x": "120","y": "170"}, {"id": "4","x": "180","y": "260"}, {"id": "5","x": "300","y": "250"}]];

var json_data = [{
    "x": "100",
    "y": "300"
}, {
    "x": "150",
    "y": "300"
}, {
    "x": "250",
    "y": "300"
}, {
    "x": "350",
    "y": "300"
}, {
    "x": "450",
    "y": "300"
}, {
    "x": "550",
    "y": "300"
}, {
    "x": "650",
    "y": "300"
}, {
    "x": "700",
    "y": "300"
}];

var curva_arrivo = [{
    "x": "100",
    "y": "300"
}, {
    "x": "150",
    "y": "600"
}, {
    "x": "250",
    "y": "600"
}, {
    "x": "350",
    "y": "600"
}, {
    "x": "450",
    "y": "600"
}, {
    "x": "550",
    "y": "600"
}, {
    "x": "650",
    "y": "600"
}, {
    "x": "700",
    "y": "300"
}];

// ----- Raggio delle ellissi e offset delle maniglie per la bezier
var handleRadius = 6;
var handleOffset = 50;

var minYoffset = 300;
var maxYOffset = 600;

var jumpOffset = 60;

// ----- Larghezza e altezza della viewBox dell'SVG
var w = 800;
var h = 850;

// ----- Pusha le posizioni dei punti nell'array point_position nel dato momento
json_data.forEach((el) => {
    var li_x = parseInt(el.x);
    var li_y = parseInt(el.y);

    point_positions.push({
        x: li_x,
        y: li_y
    })
})

// ----- Crea un svg con dimensioni definite
var svg = d3.select('#curves').append('svg').attr("viewBox", "0 0 " + w + ' ' + h).attr("preserveAspectRatio", "none");

// ------------ GRADIENT - crea il gradiente
var defs = svg.append("defs");

var gradient = defs.append("linearGradient")
    .attr("id", "svgGradient")
    .attr("x1", "100%")
    .attr("x2", "100%")
    .attr("y1", "0%")
    .attr("y2", "100%");

gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "blue")
    .attr("stop-opacity", 1);

gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "red")
    .attr("stop-opacity", 1);

// creo un rettangolo che sarà mascherato dalla linea, assegno il gradiente
var rect = svg.append('rect')
    .attr('mask', "url(#mask-line)")
    .attr('x', 0)
    .attr('y', 290)
    .attr('width', '100%')
    .attr('height', '400')
    .attr('fill', "url(#svgGradient)");

// ----- CURVES INIT
function curves_init(point_positions) {
    var curves = [{
        type: 'Q',
        points: point_positions
    }];

    // crea dei gruppi nell'svg e da attributi
    // var controlLineLayer = svg.append('g').attr('class', 'control-line-layer');
    var mainLayer = svg.append('g').attr('class', 'main-layer');
    var handleTextLayer = svg.append('g').attr('class', 'handle-text-layer');
    var handleLayer = svg.append('g').attr('class', 'handle-layer');

    var drag = d3.behavior.drag()
        .origin(function (d) {
            return d;
        })
        .on('drag', dragmove);

    // ----- DRAGMOVE
    // Elementi draggabili, funzione che controlla il drag delle maniglie
    function dragmove(d, i) {
        // Qui assegna il valore y e aggiorna la posizione dei punti
        // d.x = d3.event.x;
        d.y = clamp(d3.event.y, minYoffset, maxYOffset - jumpOffset);

        // Se il mouse è inferiore a un certo valore y (maxYoffset), eseguire la funzione
        if (d.y < maxYOffset - jumpOffset) {
            d3.select(this).attr({
                // cx: d.x,
                cy: d.y
            });

            circlesToResizeB.attr("cy", function (d, ind) {
                if (ind == i) {
                    d3.select(this).classed("redHandleBehind", false)
                    return d.y
                } else {
                    return this.getAttribute("cy");
                }
            })

            d3.select(this).classed("redHandle", false);

            handleTextLayer.selectAll('text.handle-text.path' + d.pathID + '.p' + (d.handleID + 1))
                .attr({
                    // x: d.x,
                    y: d.y
                }).text(handleText(d, d.handleID));

        } else {
            d3.select(this).attr({
                // cx: d.x,
                cy: maxYOffset - jumpOffset
            });

            circlesToResizeB.attr("cy", function (d, ind) {
                if (ind == i) {
                    d3.select(this).classed("redHandleBehind", true)
                    return maxYOffset - jumpOffset
                } else {
                    return this.getAttribute("cy");
                }
            })

            d3.select(this).classed("redHandle", true);

            handleTextLayer.selectAll('text.handle-text.path' + d.pathID + '.p' + (d.handleID + 1))
                .attr({
                    // x: d.x,
                    y: maxYOffset - jumpOffset
                }).text(handleText(d, d.handleID));
        }

        // Aggiorna la curva
        d.pathElem.attr('d', pathData);
    }
    show_curves(mainLayer, handleTextLayer, handleLayer, curves, drag);
}

//----- ------------------------- -----
//----- PATH DATA e PATH SPEZZATA -----
//----- ------------------------- -----

//----- Prima curva deve essere C
//----- C x1 y1,             x2 y2,           x y
//-----   maniglia partenza, maniglia arrivo, punto arrivo

//----- Bezier quadratica, maniglia partenza specchia arrivo punto precedente
//----- viene definita solo quella di arrivo con x2,y2
//----- S x2 y2,             x y
//-----   maniglia partenza, punto arrivo

//----- In sintesi, dopo aver definito la prima C, saranno tutte S come a seguire
//----- M coord(mX) coord(mY)
//----- C offset,coord(mY)          coord(cX)-offset,coord(cY)      coord(cX),coord(cY)
//----- S coord(X)-offset,coord(Y)      coord(X) coordY

function pathData(d) {

    var p = d.points;

    d.points.forEach(el => {
        // console.log(el);
        el.y = clamp(el.y, minYoffset, maxYOffset);
        if (el.y >= maxYOffset - jumpOffset) {
            el.y = maxYOffset;
        }
    });

    curve = [
        //x y
        'M', parseInt(p[0].x), ',', parseInt(p[0].y),
        //x1 y1 x2 y2 x y
        'C', + ' ' + parseInt(p[0].x + (handleOffset/4)), ',', parseInt(p[0].y), ' ', parseInt(p[1].x - handleOffset), ',', parseInt(p[1].y), ' ', parseInt(p[1].x), ',', parseInt(p[1].y),
        //x2 y2 x y
        'S', + ' ' + parseInt(p[2].x - handleOffset), ',', parseInt(p[2].y), ' ', parseInt(p[2].x), ',', parseInt(p[2].y),
        ' ', parseInt(p[3].x - handleOffset), ',', parseInt(p[3].y), ' ', parseInt(p[3].x), ',', parseInt(p[3].y),
        ' ', parseInt(p[4].x - handleOffset), ',', parseInt(p[4].y), ' ', parseInt(p[4].x), ',', parseInt(p[4].y),
        ' ', parseInt(p[5].x - handleOffset), ',', parseInt(p[5].y), ' ', parseInt(p[5].x), ',', parseInt(p[5].y),
        ' ', parseInt(p[6].x - handleOffset), ',', parseInt(p[6].y), ' ', parseInt(p[6].x), ',', parseInt(p[6].y),
        ' ', parseInt(p[7].x - (handleOffset/4)), ',', parseInt(p[7].y), ' ', parseInt(p[7].x), ',', parseInt(p[7].y)
    ].join('');

    return curve;
}

// ----- Scrive il testo nel tooltip
function handleText(d, i) {
    if (0 < i < 7) {
        return 'volume' + (i + 0) + ': ' + d.y;
    }
}


// ------------ ----------- ------------
// ------------ SHOW CURVES ------------
// ------------ ----------- ------------

function show_curves(mainLayer, handleTextLayer, handleLayer, curves, drag) {

    mainLayer.selectAll('path.curves').data(curves)
        .enter().append('defs').append('mask').attr('id', 'mask-line').append('path')
        .attr({
            'class': function (d, i) {
                return 'curves path' + i;
            },
            d: pathData,
            'vector-effect': 'non-scaling-stroke'
        })
        .each(function (d, i) {
            var pathElem = d3.select(this),
                controlLineElem,
                handleTextElem;

            // handleTextElem = handleTextLayer.selectAll('text.handle-text.path' + i)
            //     .data(d.points).enter().append('text').filter(function (d, i) {
            //         if (i != 0 && i != 7) return d
            //     })
            //     .attr({
            //         'class': function (handleD, handleI) {
            //             return 'handle-text path' + i + ' p' + (handleI + 1);
            //         },
            //         x: function (d) {
            //             return d.x
            //         },
            //         y: function (d) {
            //             return d.y
            //         },

            //         // Controlla quanto distante è il testo dai pallini
            //         dx: -30,
            //         dy: 30
            //     })
            //     .text(handleText);

            // // Sposta le maniglie cerchietti
            // handleLayer.selectAll('circle.handle.path' + i)
            //     .data(d.points).enter().append('ellipse').filter(function (d, i) {
            //         if (i != 0 && i != 7) return d
            //     })
            //     .attr({
            //         'class': 'handle path' + i,
            //         cx: function (d) {
            //             return d.x
            //         },
            //         cy: function (d) {
            //             return d.y;
            //         },

            //         rx: handleRadius,
            //         ry: handleRadius,
            //         'vector-effect': 'non-scaling-stroke'
            //     })
            //     .each(function (d, handleI) {
            //         d.pathID = i;
            //         d.handleID = handleI;
            //         d.pathElem = pathElem;
            //         d.controlLineElem = controlLineElem;
            //     })
            //     .call(drag);

            // Sposta le maniglie cerchietti
            var handles = handleLayer.selectAll('circle.handle.path' + i).data(d.points)
            var handlesEnter = handles.enter().append("g");
            
            handlesEnter.append('ellipse').filter(function (d, i) {
                    if (i != 0 && i != 7) return d
                })
                .attr({
                    'class': 'handle-behind path' + i,
                    cx: function (d) {
                        return d.x
                    },
                    cy: function (d) {
                        return d.y;
                    },

                    rx: handleRadius,
                    ry: handleRadius,
                    'vector-effect': 'non-scaling-stroke'
                })
                .each(function (d, handleI) {
                    d.pathID = i;
                    d.handleID = handleI;
                    d.pathElem = pathElem;
                    d.controlLineElem = controlLineElem;
                })
                .call(drag);

                handlesEnter.append('ellipse').filter(function (d, i) {
                    if (i != 0 && i != 7) return d
                })
                .attr({
                    'class': 'handle path' + i,
                    cx: function (d) {
                        return d.x
                    },
                    cy: function (d) {
                        return d.y;
                    },

                    rx: handleRadius,
                    ry: handleRadius,
                    'vector-effect': 'non-scaling-stroke'
                })
                .each(function (d, handleI) {
                    d.pathID = i;
                    d.handleID = handleI;
                    d.pathElem = pathElem;
                    d.controlLineElem = controlLineElem;
                })
                .call(drag);
        });
}

// ----- inizializza la funzione
curves_init(point_positions);

// ------------ ------------- ------------
// ------------ ANIMATE LINES ------------
// ------------ ------------- ------------

function animateLines() {
    var p = curva_arrivo;

    const ease = 'easeInOutQuad';
    const duration = 1500;

    var cd = curves_data;

    // Elabora il d della curva d'arrivo
    ca = [
        //x y
        'M', parseInt(p[0].x), ',', parseInt(p[0].y),
        //x1 y1 x2 y2 x y
        'C', +' ' + parseInt(p[0].x) + (handleOffset/4), ',', parseInt(p[0].y), ' ', parseInt(p[1].x) - handleOffset, ',', parseInt(p[1].y), ' ', parseInt(p[1].x), ',', parseInt(p[1].y),
        //x2 y2 x y
        'S', +' ' + parseInt(p[2].x) - handleOffset, ',', parseInt(p[2].y), ' ', parseInt(p[2].x), ',', parseInt(p[2].y),
        ' ', parseInt(p[3].x) - handleOffset, ',', parseInt(p[3].y), ' ', parseInt(p[3].x), ',', parseInt(p[3].y),
        ' ', parseInt(p[4].x) - handleOffset, ',', parseInt(p[4].y), ' ', parseInt(p[4].x), ',', parseInt(p[4].y),
        ' ', parseInt(p[5].x) - handleOffset, ',', parseInt(p[5].y), ' ', parseInt(p[5].x), ',', parseInt(p[5].y),
        ' ', parseInt(p[6].x) - handleOffset, ',', parseInt(p[6].y), ' ', parseInt(p[6].x), ',', parseInt(p[6].y),
        ' ', parseInt(p[7].x) - (handleOffset/4), ',', parseInt(p[7].y), ' ', parseInt(p[7].x), ',', parseInt(p[7].y)
    ].join('');

    // crea un nuovo gruppo svg in cui inserire le curve
    svg.selectAll("g.users-layer").remove();
    var usersLayer = svg.append('g').attr('class', 'users-layer');

    // crea n curve in base al json, le imposta uguali alla curva d'arrivo
    usersLayer.selectAll('path.curves-layer').data(cd)
    .enter().append('path')
    .attr({
        'class': function (d, i) {
            return 'users-curve users-path' + i;
        },
        'd': ca,
        'vector-effect': 'non-scaling-stroke'
    })

    var asd = d3.select('.curves').attr('d');

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
            cy: maxYOffset,
            update: function () {
                var b = d3.select("body").selectAll(".handle-behind");

                b[0].forEach((pt) => {
                    pt.getAttribute("cy") > maxYOffset - jumpOffset ? pt.classList.add("redHandleBehind") : pt.classList.remove("redHandleBehind")
                })
            }
        }, 0)
        .add({
            targets: '.handle',
            cy: maxYOffset,
            update: function () {
                var a = d3.select("body").selectAll(".handle");

                a[0].forEach((pt) => {
                    pt.getAttribute("cy") > maxYOffset - jumpOffset ? pt.classList.add("redHandle") : pt.classList.remove("redHandle")
                })
            }
        }, 0)
        // rende visibili le curve delle altre sessioni e le anima
        .add({
            targets: '.users-curve',
            d: function (el, i) {
                return cd[i].d
            },
            update: function () {
                var a = usersLayer.selectAll('path.users-curve');
                a[0].forEach((pt) => {
                    pt.classList.add("user-curve-anim")
                })
            },
            delay: anime.stagger(200)
        }, '+=' + duration)
        .add({
            targets: '.curves',
            d: asd,
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

// ------------ ----------------- ------------
// ------------ UTILITY FUNCTIONS ------------
// ------------ ----------------- ------------

// ----- Clamp function
function clamp(val, min, max) {
    return val > max ? max : val < min ? min : val;
}

// ----- Store JSON
var userID = 0;

function storeJSON() {

    var obj = {
        "curveID": userID,
        "d": curve,
        "timestamp": Date(Date.now())
    }

    console.log("Da storare nel JSON")
    curves_data[userID] = obj;
    console.log(curves_data);
    userID++;
}


// ----- Resize ellipses
window.onresize = resized;

var circlesToResize = svg.selectAll(".handle");
var circlesToResizeB = svg.selectAll(".handle-behind");

//la chiama la prima volta per resizare subito i cerchi appena vengono creati
resized();

function resized() {
    var scaleX = w / d3.select('svg').node().getBoundingClientRect().width;
    var scaleY = h / d3.select('svg').node().getBoundingClientRect().height;

    console.log(d3.select('svg').node().getBoundingClientRect().width);
    console.log(d3.select('svg').node().getBoundingClientRect().height);

    var multiplier = 6;
    var multiplier2 = 10;

    // cerchi frontali con stroke
    circlesToResize.each(function (d, i) {
        // if (i != 0 && i != 7) {
            var circleSize = d3.select(this);

            // circleSize.style("stroke-width", multiplier / 4 + "px");

            circleSize.attr({
                rx: (scaleX * multiplier),
                ry: (scaleY * multiplier)
            });
        // }
    })

    // cerchi dietro
    circlesToResizeB.each(function (d, i) {
        // if (i != 0 && i != 7) {
            var circleSize = d3.select(this);

            // circleSize.style("stroke-width", multiplier / 2 + "px");

            circleSize.attr({
                rx: (scaleX * multiplier2),
                ry: (scaleY * multiplier2)
            });
        // }
    })
}