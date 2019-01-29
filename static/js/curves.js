var point_positions = [];
//multiple lines non serve
// var json_data_muliple_lines = [[{"id": "82","x": "50","y": "50"}, {"id": "83","x": "25","y": "110"}, {"id": "97","x": "90","y": "150"}, {"id": "98","x": "150","y": "224"}, {"id": "99","x": "250","y": "150"}, {"id": "100","x": "300","y": "200"}, {"id": "100","x": "320","y": "230"}],[{"id": "1","x": "120","y": "60"}, {"id": "2","x": "30","y": "150"}, {"id": "3","x": "120","y": "170"}, {"id": "4","x": "180","y": "260"}, {"id": "5","x": "300","y": "250"}]];

var json_data = [{
    "x": "50",
    "y": "0"
}, {
    "x": "150",
    "y": "0"
}, {
    "x": "250",
    "y": "0"
}, {
    "x": "350",
    "y": "0"
}, {
    "x": "450",
    "y": "0"
}, {
    "x": "550",
    "y": "0"
}, {
    "x": "650",
    "y": "0"
}, {
    "x": "750",
    "y": "0"
}];

var curva_arrivo = [{
    "x": "50",
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
    "x": "750",
    "y": "300"
}];

// console.log("dati iniziali");
// console.log(json_data);

var handleRadius = 6;
var handleOffset = 50;
var minYoffset = 0;
var maxYOffset = 380;

//----- Pusha le posizioni dei punti nell'array point_position nel dato momento
json_data.forEach((el) => {
    var li_x = parseInt(el.x);
    var li_y = parseInt(el.y);

    point_positions.push({
        x: li_x,
        y: li_y
    })
})

// $.each(json_data, function(i, item) {
//     line_response = json_data[i];
//     // var line_pi_id = line_response.line_pi_id;
//     var li_x = parseInt(line_response.x);
//     var li_y = parseInt(line_response.y);

//     point_positions.push({
//         x: li_x,
//         y: li_y
//     })
// })



//----- Crea un svg con dimensioni definite
var svg = d3.select('#curves').append('svg').attr({
    viewBox: '50 -3 700 700',
    preserveAspectRatio: "none"
});

// preserveAspectRatio="none"

// questo da mettere nel path
// vector-effect = "non-scaling-stroke"
// https://codepen.io/Zeaklous/pen/ONGJab


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
    .attr("stop-color", "white")
    .attr("stop-opacity", 1);

// creo un rettangolo che uso come gradiente di sfondo, lo taglio con la maschera
var rect = svg.append('rect')
    .attr('mask', "url(#mask-line)")
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', '150%')
    .attr('height', '100%')
    .attr('fill', "url(#svgGradient)");




function curves_init(point_positions) {
    var curves = [{
        type: 'Q',
        points: point_positions
    }];
    // console.log("curves", curves);

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

    // elementi draggabili, funzione che controlla il drag delle maniglie
    function dragmove(d) {
        // d.x = d3.event.x;
        d.y = clamp(d3.event.y, minYoffset, maxYOffset);

        // se il mouse è inferiore a un certo valore y, non eseguire la funzione
        // da problemi, la curva si aggiorna comunque
        // if (d.y > 300) {

        // pallino maniglia
        if (d.y < maxYOffset - 20) {
            d3.select(this).attr({
                // cx: d.x,
                cy: d.y
            });

            d3.select(this).classed("redHandle", false);

            handleTextLayer.selectAll('text.handle-text.path' + d.pathID + '.p' + (d.handleID + 1))
                .attr({
                    // x: d.x,
                    y: d.y
                }).text(handleText(d, d.handleID));

        } else {
            d3.select(this).attr({
                // cx: d.x,
                cy: maxYOffset
            });

            d3.select(this).classed("redHandle", true);

            handleTextLayer.selectAll('text.handle-text.path' + d.pathID + '.p' + (d.handleID + 1))
                .attr({
                    // x: d.x,
                    y: maxYOffset
                }).text(handleText(d, d.handleID));

        }

        playback.setContentVolume();

        // aggiorna la curva
        d.pathElem.attr('d', pathData);

        // }
    }

    show_curves(mainLayer, handleTextLayer, handleLayer, curves, drag);
}

//----- Prima curva deve essere C
//----- C x1 y1,             x2 y2,           x y
//-----   maniglia partenza, maniglia arrivo, punto arrivo

//----- bezier quadratica, maniglia partenza specchia arrivo punto precedente
//----- viene definita solo quella di arrivo con x2,y2
//----- S x2 y2,             x y
//-----   maniglia partenza, punto arrivo

//----- in sintesi, dopo aver definito la prima C, saranno tutte S come a seguire
//----- M coord(mX) coord(mY)
//----- C offset,coord(mY)          coord(cX)-offset,coord(cY)      coord(cX),coord(cY)
//----- S coord(X)-offset,coord(Y)      coord(X) coordY

//----- PATH DATA e PATH SPEZZATA
function pathData(d) {

    var p = d.points;

    d.points.forEach(el => {
        // console.log(el);
        el.y = clamp(el.y, minYoffset, maxYOffset);
        if (el.y >= maxYOffset - 20) {
            el.y = maxYOffset;
        }
    });

    curve = [
        //x y
        'M', parseInt(p[0].x), ',', parseInt(p[0].y),
        //x1 y1 x2 y2 x y
        'C', +' ' + parseInt(p[0].x + handleOffset), ',', parseInt(p[0].y), ' ', parseInt(p[1].x - handleOffset), ',', parseInt(p[1].y), ' ', parseInt(p[1].x), ',', parseInt(p[1].y),
        //x2 y2 x y
        'S', +' ' + parseInt(p[2].x - handleOffset), ',', parseInt(p[2].y), ' ', parseInt(p[2].x), ',', parseInt(p[2].y),
        ' ', parseInt(p[3].x - handleOffset), ',', parseInt(p[3].y), ' ', parseInt(p[3].x), ',', parseInt(p[3].y),
        ' ', parseInt(p[4].x - handleOffset), ',', parseInt(p[4].y), ' ', parseInt(p[4].x), ',', parseInt(p[4].y),
        ' ', parseInt(p[5].x - handleOffset), ',', parseInt(p[5].y), ' ', parseInt(p[5].x), ',', parseInt(p[5].y),
        ' ', parseInt(p[6].x - handleOffset), ',', parseInt(p[6].y), ' ', parseInt(p[6].x), ',', parseInt(p[6].y),
        ' ', parseInt(p[7].x - handleOffset), ',', parseInt(p[7].y), ' ', parseInt(p[7].x), ',', parseInt(p[7].y)
    ].join('');

    // console.log("curve", curve);
    return curve;
}

function handleText(d, i) {
    if (0 < i < 7) {
        return 'volume' + (i + 0) + ': ' + d.y;
    }
    // return 'volume' + (i + 1) + ': ' + d.x + '/' + d.y;
}

// ------------ Disegna le curve

function show_curves(mainLayer, handleTextLayer, handleLayer, curves, drag) {

    mainLayer.selectAll('path.curves').data(curves)
        .enter().append('defs').append('mask').attr('id', 'mask-line').append('path')
        .attr({
            'class': function (d, i) {
                return 'curves path' + i;
            },
            d: pathData
        }).attr("vector-effect", "non-scaling-stroke")
        .each(function (d, i) {
            var pathElem = d3.select(this),
                controlLineElem,
                handleTextElem;

            handleTextElem = handleTextLayer.selectAll('text.handle-text.path' + i)
                .data(d.points).enter().append('text')
                .attr({
                    'class': function (handleD, handleI) {
                        return 'handle-text path' + i + ' p' + (handleI + 1);
                    },
                    x: function (d) {
                        return d.x
                    },
                    y: function (d) {
                        return d.y
                    },

                    //controlla quanto distante è il testo dai pallini
                    dx: -30,
                    dy: 30
                })
                .text(handleText);

            //sposta le maniglie cerchietti
            handleLayer.selectAll('circle.handle.path' + i)
                .data(d.points).enter().append('circle')
                .attr({
                    'class': 'handle path' + i,
                    cx: function (d) {
                        return d.x
                    },
                    cy: function (d) {
                        return d.y;
                    },

                    r: handleRadius
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

curves_init(point_positions);


// ------------ STORE JSON
var inc = 0;
var curves_data = [];

function storeJSON() {

    var obj = {
        "curveID": inc,
        "curve ": curve
    }

    console.log("Da storare nel JSON")
    curves_data[inc] = obj;
    console.log(curves_data);
    inc++;
}

// ------------ ANIMATE LINES
function animateLines() {
    var p = curva_arrivo;
    const ease = 'easeInOutQuad';
    const duration = 1500;

    ca = [
        //x y
        'M', parseInt(p[0].x), ',', parseInt(p[0].y),
        //x1 y1 x2 y2 x y
        'C', +' ' + parseInt(p[0].x) + handleOffset, ',', parseInt(p[0].y), ' ', parseInt(p[1].x) - handleOffset, ',', parseInt(p[1].y), ' ', parseInt(p[1].x), ',', parseInt(p[1].y),
        //x2 y2 x y
        'S', +' ' + parseInt(p[2].x) - handleOffset, ',', parseInt(p[2].y), ' ', parseInt(p[2].x), ',', parseInt(p[2].y),
        ' ', parseInt(p[3].x) - handleOffset, ',', parseInt(p[3].y), ' ', parseInt(p[3].x), ',', parseInt(p[3].y),
        ' ', parseInt(p[4].x) - handleOffset, ',', parseInt(p[4].y), ' ', parseInt(p[4].x), ',', parseInt(p[4].y),
        ' ', parseInt(p[5].x) - handleOffset, ',', parseInt(p[5].y), ' ', parseInt(p[5].x), ',', parseInt(p[5].y),
        ' ', parseInt(p[6].x) - handleOffset, ',', parseInt(p[6].y), ' ', parseInt(p[6].x), ',', parseInt(p[6].y),
        ' ', parseInt(p[7].x) - handleOffset, ',', parseInt(p[7].y), ' ', parseInt(p[7].x), ',', parseInt(p[7].y)
    ].join('');

    var asd = d3.select('.curves').attr('d');
    // console.log(asd);
    // console.log(ca);

    var tl = anime.timeline({
        easing: ease,
        duration: duration
    });


    tl.add({
            targets: '.curves',
            d: ca,
        }, 0)
        .add({
            targets: '.handle',
            cy: maxYOffset,
            update: function () {
                var a = d3.select("body").selectAll(".handle");

                a[0].forEach((pt) => {
                    pt.getAttribute("cy") > maxYOffset - 20 ? pt.classList.add("redHandle") : pt.classList.remove("redHandle")
                })
            }
        }, 0)
        .add({
            targets: '.curves',
            d: asd,
        }, '+=' + duration)
        .add({
            targets: '.handle',
            cy: 300
        }, '-=' + duration);

}

// ------------ UTILITY FUNCTIONS
function clamp(val, min, max) {
    return val > max ? max : val < min ? min : val;
}