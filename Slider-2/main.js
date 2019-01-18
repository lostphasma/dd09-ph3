var point_positions = [];
// var json_data_muliple_lines = [[{"id": "82","x": "50","y": "50"}, {"id": "83","x": "25","y": "110"}, {"id": "97","x": "90","y": "150"}, {"id": "98","x": "150","y": "224"}, {"id": "99","x": "250","y": "150"}, {"id": "100","x": "300","y": "200"}, {"id": "100","x": "320","y": "230"}],[{"id": "1","x": "120","y": "60"}, {"id": "2","x": "30","y": "150"}, {"id": "3","x": "120","y": "170"}, {"id": "4","x": "180","y": "260"}, {"id": "5","x": "300","y": "250"}]];
var json_data = [{
    "x": "50",
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
}];

var handleRadius = 8;


//-----Pusha le posizioni dei punti nell'array nel dato momento
$.each(json_data, function(i, item) {
    line_response = json_data[i];
    // var line_pi_id = line_response.line_pi_id;
    var li_x = parseInt(line_response.x);
    var li_y = parseInt(line_response.y);

    point_positions.push({
        x: li_x,
        y: li_y
    })
})

//-----Crea un svg con dimensioni definite
var svg = d3.select('#curves').append('svg').attr({width: 1000,height: 1000});


function curves_init(point_positions) {
    var curves = [{
        type: 'Q',
        points: point_positions
    }];
    console.log("curves", curves);

    //crea dei gruppi nell'svg e da attributi
    var controlLineLayer = svg.append('g').attr('class', 'control-line-layer');
    var mainLayer = svg.append('g').attr('class', 'main-layer');
    var handleTextLayer = svg.append('g').attr('class', 'handle-text-layer');
    var handleLayer = svg.append('g').attr('class', 'handle-layer');

    var drag = d3.behavior.drag()
        .origin(function(d) {
            return d;
        })
        .on('drag', dragmove);

    //elementi draggabili, funzione che controlla il drag
    function dragmove(d) {
        // d.x = d3.event.x;
        d.y = d3.event.y;
        d3.select(this).attr({
            // cx: d.x,
            cy: d.y
        });
        d.pathElem.attr('d', pathData);
        if (d.controlLineElem) {
            d.controlLineElem.attr('d', controlLinePath);
        }
        handleTextLayer.selectAll('text.handle-text.path' + d.pathID + '.p' + (d.handleID + 1))
            .attr({
                // x: d.x,
                y: d.y
            }).text(handleText(d, d.handleID));
    }
    show_curves(controlLineLayer, mainLayer, handleTextLayer, handleLayer, curves, drag);
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
    curve = [
        'M', p[0].x, ' ', p[0].y,
        ' ', p[1].x, ' ', p[1].y,
        ' ', p[2].x, ' ', p[2].y,
        ' ', p[3].x, ' ', p[3].y,
        ' ', p[4].x, ' ', p[4].y,
        ' ', p[5].x, ' ', p[5].y,
		' ', p[6].x, ' ', p[6].y
    ].join('');

    console.log("curve", curve);
    return curve;
}

// function controlLinePath(d) {
//     var values = [];
//     d.points.forEach(function(p) {
//         values.push(p.x);
//         values.push(p.y);
//     });
//     return 'M' + values.join(' ');
// }

function handleText(d, i) {
    return 'p' + (i + 1) + ': ' + d.x + '/' + d.y;
}


//----Disegna le curve

function show_curves(controlLineLayer, mainLayer, handleTextLayer, handleLayer, curves, drag) {
    mainLayer.selectAll('path.curves').data(curves)
        .enter().append('path')
        .attr({
            'class': function(d, i) {
                return 'curves path' + i;
            },
            d: pathData
        })
                .each(function(d, i) {
            var pathElem = d3.select(this),
                controlLineElem,
                handleTextElem;
                
    handleLayer.selectAll('circle.handle.path' + i)
        .data(d.points).enter().append('circle')
        .attr({
            'class': 'handle path' + i,
            cx: function(d) {
                return d.x
            },
            cy: function(d) {
                return d.y
            },
            r: handleRadius
        })
        .each(function(d, handleI) {
            d.pathID = i;
            d.handleID = handleI;
            d.pathElem = pathElem;
            d.controlLineElem = controlLineElem;
        })
        .call(drag);
    });
}

// //----Disegna le curve

// function show_curves(controlLineLayer, mainLayer, handleTextLayer, handleLayer, curves, drag) {
//     mainLayer.selectAll('path.curves').data(curves)
//         .enter().append('path')
//         .attr({
//             'class': function(d, i) {
//                 return 'curves path' + i;
//             },
//             d: pathData
//         })
//                 .each(function(d, i) {
//             var pathElem = d3.select(this),
//                 controlLineElem,
//                 handleTextElem;
//             if (d.type !== 'L') {
//                 controlLineElem = controlLineLayer.selectAll('path.control-line.path' + i)
//                     .data([d]).enter().append('path')
//                     .attr({
//                         'class': 'control-line path' + i,
//                         d: controlLinePath(d)
//                     });
//             }

//             handleTextElem = handleTextLayer.selectAll('text.handle-text.path' + i)
//                 .data(d.points).enter().append('text')
//                 .attr({
//                     'class': function(handleD, handleI) {
//                         return 'handle-text path' + i + ' p' + (handleI + 1);
//                     },
//                     x: function(d) {
//                         return d.x
//                     },
//                     y: function(d) {
//                         return d.y
//                     },
//                     dx: 10,
//                     dy: 0
//                 })
//                 .text(handleText);

//             handleLayer.selectAll('circle.handle.path' + i)
//                 .data(d.points).enter().append('circle')
//                 .attr({
//                     'class': 'handle path' + i,
//                     cx: function(d) {
//                         return d.x
//                     },
//                     cy: function(d) {
//                         return d.y
//                     },
//                     r: handleRadius
//                 })
//                 .each(function(d, handleI) {
//                     d.pathID = i;
//                     d.handleID = handleI;
//                     d.pathElem = pathElem;
//                     d.controlLineElem = controlLineElem;
//                 })
//                 .call(drag);
//         });
// }



curves_init(point_positions);