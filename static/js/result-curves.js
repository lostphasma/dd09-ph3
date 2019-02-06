var point_positions = [];

// var curves_data = [{
//         d: "M0,0C17,0 -4,485 66,485S129,561 199,561 263,309 333,309 396,323 466,323 529,425 599,425 663,122 733,122 782,0 800,0"
//     }, {
//         d: "M0,0C17,0 -4,276 66,276S129,136 199,136 263,396 333,396 396,61 466,61 529,1060 599,1060 663,0 733,0 782,0 800,0"    
//     }, {
//         d: "M0,0C17,0 -4,603 66,603S129,335 199,335 263,857 333,857 396,437 466,437 529,471 599,471 663,195 733,195 782,0 800,0"
//     }, {
//         d: "M0,0C17,0 -4,481 66,481S129,469 199,469 263,201 333,201 396,309 466,309 529,530 599,530 663,465 733,465 782,0 800,0"
//     }, {
//         d: "M0,0C17,0 -4,364 66,364S129,1060 199,1060 263,692 333,692 396,455 466,455 529,759 599,759 663,169 733,169 782,0 800,0"
//     }, {
//         d: "M0,0C17,0 -4,609 66,609S129,106 199,106 263,1060 333,1060 396,425 466,425 529,765 599,765 663,220 733,220 782,0 800,0"
//     }, {
//         d: "M0,0C17,0 -4,1060 66,1060S129,264 199,264 263,761 333,761 396,439 466,439 529,652 599,652 663,143 733,143 782,0 800,0"
//     }, {
//         d: "M0,0C17,0 -4,595 66,595S129,210 199,210 263,191 333,191 396,191 466,191 529,262 599,262 663,668 733,668 782,0 800,0"
//     }];

var curves_data = [];

var results_start = [{
    "x": "0",
    "y": "0"
}, {
    "x": "66",
    "y": "0"
}, {
    "x": "199",
    "y": "0"
}, {
    "x": "333",
    "y": "0"
}, {
    "x": "466",
    "y": "0"
}, {
    "x": "599",
    "y": "0"
}, {
    "x": "733",
    "y": "0"
}, {
    "x": "800",
    "y": "0"
}];

// ----- Raggio delle ellissi e offset delle maniglie per la bezier
var handleRadius = 6;
var handleOffset = 70;

// ----- Moltiplicatore del raggio per la funzione resized()
var multiplier = 10;
var multiplier2 = 18;

var minYoffset = 0;
var maxYOffset = 1060;

var jumpOffset = 80;

// ----- Larghezza e altezza della viewBox dell'SVG
var w = 800;
var h = 982;

// ----- Colore di path e maniglie
var sessionColor = setColor();

// ----- Pusha le posizioni dei punti nell'array point_position nel dato momento
results_start.forEach((el) => {
    var li_x = parseInt(el.x);
    var li_y = parseInt(el.y);

    point_positions.push({
        x: li_x,
        y: li_y
    })
})

var usersLayer;

// ----- Crea un svg con dimensioni definite
var svg = d3.select('#content-svg').append('svg')
.attr("viewBox", "0 0 " + w + ' ' + h)
.attr("preserveAspectRatio", "none")
.attr("id", "users-results")
.attr("height", function() {return d3.select("#content-grid").node().getBoundingClientRect().height});

window.onresize = function () {
    d3.select('#users-results').attr("height", function(){return d3.select("#content-grid").node().getBoundingClientRect().height});   
}

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
    .attr("stop-color", sessionColor)
    .attr("stop-opacity", 1);

gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "red")
    .attr("stop-opacity", 1);

// creo un rettangolo che sarà mascherato dalla linea, assegno il gradiente
var rect = svg.append('rect')
    .attr('mask', "url(#mask-line)")
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('fill', "url(#svgGradient)");

    function curves_init(point_positions) {
        var curves = [{
            type: 'Q',
            points: point_positions
        }];
    
        // crea dei gruppi nell'svg e da attributi
        // var controlLineLayer = svg.append('g').attr('class', 'control-line-layer');
        var mainLayer = svg.append('g').attr('class', 'main-layer');

        // playback.setContentVolume();

        // Aggiorna la curva
        // d.pathElem.attr('d', pathData);

        show_curves(mainLayer, curves);
    }

//----- ------------------------- -----
//----- PATH DATA e PATH SPEZZATA -----
//----- ------------------------- -----

function pathData(d) {

    var p = d.points;

    d.points.forEach(el => {
        // console.log(el);
        el.y = clamp(el.y, minYoffset, maxYOffset);
        if (el.y >= maxYOffset - jumpOffset) {
            el.y = maxYOffset;
        }
    });


    //è sempre uguale, si puòevitare di calcolare
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

// ------------ ----------- ------------
// ------------ SHOW CURVES ------------
// ------------ ----------- ------------

function show_curves(mainLayer, curves) {

    mainLayer.selectAll('path.curves').data(curves)
        .enter().append('defs').append('mask').attr('id', 'mask-line').append('path')
        .attr({
            'class': function (d, i) {
                return 'curves path' + i;
            },
            d: pathData,
            'vector-effect': 'non-scaling-stroke'
        })
}

// ----- inizializza la funzione
curves_init(point_positions);


// ------------ ------------- ------------
// ------------ ANIMATE LINES ------------
// ------------ ------------- ------------

function animateLinesResults() {

    const ease = 'easeInOutQuad';
    const duration = 1500;

    var cd = curves_data;

    // crea un nuovo gruppo svg in cui inserire le curve
    svg.selectAll("g.users-layer").remove();
    usersLayer = d3.select("#mask-line").append('g').attr('class', 'users-layer');

    // crea n curve in base al JSON, le imposta uguali alla curva d'arrivo
    usersLayer.selectAll('path.curves-layer').data(cd)
    .enter().append('path')
    .attr({
        'class': function (d, i) {
            return 'users-curve users-path' + i;
        },
        'd': curve,
        'vector-effect': 'non-scaling-stroke'
    })

    // var asd = d3.select('.curves').attr('d');

    var tl = anime.timeline({
        easing: ease,
        duration: duration
    });

    tl.add({
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
        duration: 1000,
        delay: anime.stagger(30)
    }, 0)
}

// ------------ ----------------- ------------
// ------------ UTILITY FUNCTIONS ------------
// ------------ ----------------- ------------

// ----- Clamp function
function clamp(val, min, max) {
    return val > max ? max : val < min ? min : val;
}

// ----- Setta il colore di maniglie e linea on page load
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