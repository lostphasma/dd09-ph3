var point_positions = [];
var curves_results_data = [{
        d: "M100,300C117,300 100,300 150,300S200,387 250,387 300,353 350,353 400,300 450,300 500,300 550,300 600,300 650,300 682,300 700,300"
    }, {
        d: "M100,300C112,300 100,368 150,368S200,458 250,458 300,536 350,536 400,407 450,407 500,337 550,337 600,441 650,441 687,300 700,300"    
    }, {
        d: "M100,300C112,300 100,483 150,483S200,410 250,410 300,376 350,376 400,391 450,391 500,430 550,430 600,377 650,377 687,300 700,300"
    }, {
        d: "M100,300C112,300 100,425 150,425S200,443 250,443 300,410 350,410 400,401 450,401 500,469 550,469 600,392 650,392 687,300 700,300"
    }, {
        d: "M100,300C112,300 100,332 150,332S200,370 250,370 300,435 350,435 400,383 450,383 500,498 550,498 600,427 650,427 687,300 700,300"
    }, {
        d: "M100,300C112,300 100,431 150,431S200,347 250,347 300,396 350,396 400,425 450,425 500,389 550,389 600,448 650,448 687,300 700,300"
    }, {
        d: "M100,300C117,300 100,436 150,436S200,328 250,328 300,393 350,393 400,343 450,343 500,440 550,440 600,366 650,366 682,300 700,300"
    }, {
        d: "M100,300C117,300 100,436 150,436S200,394 250,394 300,364 350,364 400,450 450,450 500,384 550,384 600,431 650,431 682,300 700,300"
    }];

var results_start = [{
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
var h = 850;

// ----- Pusha le posizioni dei punti nell'array point_position nel dato momento
results_start.forEach((el) => {
    var li_x = parseInt(el.x);
    var li_y = parseInt(el.y);

    point_positions.push({
        x: li_x,
        y: li_y
    })
})

// ----- Crea un svg con dimensioni definite
var svg = d3.select('#results-curves').append('svg').attr("viewBox", "0 0 " + w + ' ' + h).attr("preserveAspectRatio", "none").attr("id", "users-results");

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
        .attr('data', pathData)
        // .attr({
        //     'class': function (d, i) {
        //         return 'curves path' + i;
        //     },
        //     d: pathData,
        //     'vector-effect': 'non-scaling-stroke'
        // })
}

// ----- inizializza la funzione
curves_init(point_positions);


// ------------ ------------- ------------
// ------------ ANIMATE LINES ------------
// ------------ ------------- ------------

function animateLines() {

    const ease = 'easeInOutQuad';
    const duration = 1500;

    var cd = curves_results_data;

    // crea un nuovo gruppo svg in cui inserire le curve
    svg.selectAll("g.users-layer").remove();
    var usersLayer = d3.select("#mask-line").append('g').attr('class', 'users-layer');

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
        opacity: .4,
        duration: 1000,
        delay: anime.stagger(100)
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