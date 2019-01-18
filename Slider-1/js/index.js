var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _objectWithoutProperties(obj, keys) {var target = {};for (var i in obj) {if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];}return target;}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var Component = React.Component;
var render = ReactDOM.render;var

Container = function (_Component) {_inherits(Container, _Component);function Container() {var _ref;var _temp, _this, _ret;_classCallCheck(this, Container);for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {args[_key] = arguments[_key];}return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Container.__proto__ || Object.getPrototypeOf(Container)).call.apply(_ref, [this].concat(args))), _this), _this.
        state = {
            w: 800,
            h: 600,
            grid: {
                show: true,
                snap: true,
                size: 50 },

            ctrl: false,
            points: [
            { x: 100, y: 300 },
            { x: 200, y: 300, q: { x: 150, y: 50 } },
            { x: 300, y: 300, q: { x: 250, y: 550 } },
            { x: 400, y: 300, q: { x: 350, y: 50 } },
            { x: 500, y: 300, c: [{ x: 450, y: 550 }, { x: 450, y: 50 }] },
            { x: 600, y: 300, c: [{ x: 550, y: 50 }, { x: 550, y: 550 }] },
            { x: 700, y: 300, a: { rx: 50, ry: 50, rot: 0, laf: 1, sf: 1 } }],

            activePoint: 2,
            draggedPoint: false,
            draggedQuadratic: false,
            draggedCubic: false,
            closePath: false }, _this.



















        setWidth = function (e) {
            var v = _this.positiveNumber(e.target.value),min = 1;
            if (v < min) v = min;

            _this.setState({ w: v });
        }, _this.

        setHeight = function (e) {
            var v = _this.positiveNumber(e.target.value),min = 1;
            if (v < min) v = min;

            _this.setState({ h: v });
        }, _this.

        setGridSize = function (e) {
            var grid = _this.state.grid;
            var v = _this.positiveNumber(e.target.value);
            var min = 1;
            var max = Math.min(_this.state.w, _this.state.h);

            if (v < min) v = min;
            if (v >= max) v = max / 2;

            grid.size = v;

            _this.setState({ grid: grid });
        }, _this.

        setGridSnap = function (e) {
            var grid = _this.state.grid;
            grid.snap = e.target.checked;

            _this.setState({ grid: grid });
        }, _this.

        setGridShow = function (e) {
            var grid = _this.state.grid;
            grid.show = e.target.checked;

            _this.setState({ grid: grid });
        }, _this.

        setClosePath = function (e) {
            _this.setState({ closePath: e.target.checked });
        }, _this.

        getMouseCoords = function (e) {
            var rect = ReactDOM.findDOMNode(_this.refs.svg).getBoundingClientRect();
            var x = Math.round(e.pageX - rect.left);
            var y = Math.round(e.pageY - rect.top);

            if (_this.state.grid.snap) {
                x = _this.state.grid.size * Math.round(x / _this.state.grid.size);
                y = _this.state.grid.size * Math.round(y / _this.state.grid.size);
            }

            return { x: x, y: y };
        }, _this.

        setPointType = function (e) {
            var points = _this.state.points;
            var active = _this.state.activePoint;

            // not the first point
            if (active !== 0) {
                var v = e.target.value;

                switch (v) {
                    case "l":
                        points[active] = {
                            x: points[active].x,
                            y: points[active].y };

                        break;
                    case "q":
                        points[active] = {
                            x: points[active].x,
                            y: points[active].y,
                            q: {
                                x: (points[active].x + points[active - 1].x) / 2,
                                y: (points[active].y + points[active - 1].y) / 2 } };


                        break;
                    case "c":
                        points[active] = {
                            x: points[active].x,
                            y: points[active].y,
                            c: [
                            {
                                x: (points[active].x + points[active - 1].x - 50) / 2,
                                y: (points[active].y + points[active - 1].y) / 2 },

                            {
                                x: (points[active].x + points[active - 1].x + 50) / 2,
                                y: (points[active].y + points[active - 1].y) / 2 }] };



                        break;
                    case "a":
                        points[active] = {
                            x: points[active].x,
                            y: points[active].y,
                            a: {
                                rx: 50,
                                ry: 50,
                                rot: 0,
                                laf: 1,
                                sf: 1 } };


                        break;}


                _this.setState({ points: points });
            }
        }, _this.

        setPointPosition = function (coord, e) {
            var coords = _this.state.points[_this.state.activePoint];
            var v = _this.positiveNumber(e.target.value);

            if (coord === "x" && v > _this.state.w) v = _this.state.w;
            if (coord === "y" && v > _this.state.h) v = _this.state.h;

            coords[coord] = v;

            _this.setPointCoords(coords);
        }, _this.

        setQuadraticPosition = function (coord, e) {
            var coords = _this.state.points[_this.state.activePoint].q;
            var v = _this.positiveNumber(e.target.value);

            if (coord === "x" && v > _this.state.w) v = _this.state.w;
            if (coord === "y" && v > _this.state.h) v = _this.state.h;

            coords[coord] = v;

            _this.setQuadraticCoords(coords);
        }, _this.

        setCubicPosition = function (coord, anchor, e) {
            var coords = _this.state.points[_this.state.activePoint].c[anchor];
            var v = _this.positiveNumber(e.target.value);

            if (coord === "x" && v > _this.state.w) v = _this.state.w;
            if (coord === "y" && v > _this.state.h) v = _this.state.h;

            coords[coord] = v;

            _this.setCubicCoords(coords, anchor);
        }, _this.

        setPointCoords = function (coords) {
            var points = _this.state.points;
            var active = _this.state.activePoint;

            points[active].x = coords.x;
            points[active].y = coords.y;

            _this.setState({ points: points });
        }, _this.

        setQuadraticCoords = function (coords) {
            var points = _this.state.points;
            var active = _this.state.activePoint;

            points[active].q.x = coords.x;
            points[active].q.y = coords.y;

            _this.setState({ points: points });
        }, _this.

        setArcParam = function (param, e) {
            var points = _this.state.points;
            var active = _this.state.activePoint;
            var v = void 0;

            if (["laf", "sf"].indexOf(param) > -1) {
                v = e.target.checked ? 1 : 0;
            } else {
                v = _this.positiveNumber(e.target.value);
            }

            points[active].a[param] = v;

            _this.setState({ points: points });
        }, _this.

        setCubicCoords = function (coords, anchor) {
            var points = _this.state.points;
            var active = _this.state.activePoint;

            points[active].c[anchor].x = coords.x;
            points[active].c[anchor].y = coords.y;

            _this.setState({ points: points });
        }, _this.

        setDraggedPoint = function (index) {
            if (!_this.state.ctrl) {
                _this.setState({
                    activePoint: index,
                    draggedPoint: true });

            }
        }, _this.

        setDraggedQuadratic = function (index) {
            if (!_this.state.ctrl) {
                _this.setState({
                    activePoint: index,
                    draggedQuadratic: true });

            }
        }, _this.

        setDraggedCubic = function (index, anchor) {
            if (!_this.state.ctrl) {
                _this.setState({
                    activePoint: index,
                    draggedCubic: anchor });

            }
        }, _this.

        cancelDragging = function (e) {
            _this.setState({
                draggedPoint: false,
                draggedQuadratic: false,
                draggedCubic: false });

        }, _this.

        addPoint = function (e) {
            if (_this.state.ctrl) {
                var coords = _this.getMouseCoords(e);
                var points = _this.state.points;

                points.push(coords);

                _this.setState({
                    points: points,
                    activePoint: points.length - 1 });

            }
        }, _this.

        removeActivePoint = function (e) {
            var points = _this.state.points;
            var active = _this.state.activePoint;

            if (points.length > 1 && active !== 0) {
                points.splice(active, 1);

                _this.setState({
                    points: points,
                    activePoint: points.length - 1 });

            }
        }, _this.

        handleMouseMove = function (e) {
            if (!_this.state.ctrl) {
                if (_this.state.draggedPoint) {
                    _this.setPointCoords(_this.getMouseCoords(e));
                } else if (_this.state.draggedQuadratic) {
                    _this.setQuadraticCoords(_this.getMouseCoords(e));
                } else if (_this.state.draggedCubic !== false) {
                    _this.setCubicCoords(_this.getMouseCoords(e), _this.state.draggedCubic);
                }
            }
        }, _this.

        handleKeyDown = function (e) {
            if (e.ctrlKey) _this.setState({ ctrl: true });
        }, _this.

        handleKeyUp = function (e) {
            if (!e.ctrlKey) _this.setState({ ctrl: false });
        }, _this.






























        reset = function (e) {
            var w = _this.state.w,h = _this.state.h;

            _this.setState({
                points: [{ x: w / 2, y: h / 2 }],
                activePoint: 0 });

        }, _temp), _possibleConstructorReturn(_this, _ret);}_createClass(Container, [{ key: "componentWillMount", value: function componentWillMount() {document.addEventListener("keydown", this.handleKeyDown, false);document.addEventListener("keyup", this.handleKeyUp, false);} }, { key: "componentWillUnmount", value: function componentWillUnmount() {document.removeEventListener("keydown");document.removeEventListener("keyup");} }, { key: "positiveNumber", value: function positiveNumber(n) {n = parseInt(n);if (isNaN(n) || n < 0) n = 0;return n;} }, { key: "generatePath", value: function generatePath() {var _state = this.state,points = _state.points,closePath = _state.closePath;var d = "";points.forEach(function (p, i) {if (i === 0) {// first point
                    d += "M ";} else if (p.q) {// quadratic
                    d += "Q " + p.q.x + " " + p.q.y + " ";} else if (p.c) {// cubic
                    d += "C " + p.c[0].x + " " + p.c[0].y + " " + p.c[1].x + " " + p.c[1].y + " ";} else if (p.a) {// arc
                    d += "A " + p.a.rx + " " + p.a.ry + " " + p.a.rot + " " + p.a.laf + " " + p.a.sf + " ";} else {d += "L ";}d += p.x + " " + p.y + " ";});if (closePath) d += "Z";return d;} }, { key: "render", value: function render() {return React.createElement("div", {
                    className: "ad-Container",
                    onMouseUp: this.cancelDragging },
                React.createElement("div", { className: "ad-Container-main" },
                    React.createElement("div", { className: "ad-Container-svg" },
                        React.createElement(SVG, _extends({
                            ref: "svg",
                            path: this.generatePath() },
                        this.state, {
                            addPoint: this.addPoint,
                            setDraggedPoint: this.setDraggedPoint,
                            setDraggedQuadratic: this.setDraggedQuadratic,
                            setDraggedCubic: this.setDraggedCubic,
                            handleMouseMove: this.handleMouseMove }))),

                    React.createElement(Foot, null)),


                React.createElement("div", { className: "ad-Container-controls" },
                    React.createElement(Controls, _extends({},
                    this.state, {
                        reset: this.reset,
                        removeActivePoint: this.removeActivePoint,
                        setPointPosition: this.setPointPosition,
                        setQuadraticPosition: this.setQuadraticPosition,
                        setCubicPosition: this.setCubicPosition,
                        setArcParam: this.setArcParam,
                        setPointType: this.setPointType,
                        setWidth: this.setWidth,
                        setHeight: this.setHeight,
                        setGridSize: this.setGridSize,
                        setGridSnap: this.setGridSnap,
                        setGridShow: this.setGridShow,
                        setClosePath: this.setClosePath })),
                    React.createElement(Result, { path: this.generatePath() })));



        } }]);return Container;}(Component);


function Foot(props) {
    return (
        React.createElement("div", { className: "ad-Foot" },
            React.createElement("ul", { className: "ad-Foot-list" },
                React.createElement("li", { className: "ad-Foot-item" },
                    React.createElement("span", { className: "ad-Foot-highlight" }, "Click"), " to select a point"),

                React.createElement("li", { className: "ad-Foot-item" },
                    React.createElement("span", { className: "ad-Foot-highlight" }, "Ctrl + Click"), " to add a point")),


            React.createElement("div", { className: "ad-Foot-meta" },
                React.createElement("a", { href: "https://twitter.com/a_dugois" }, "Follow me on Twitter"), React.createElement("br", null), "or ",
                React.createElement("a", { href: "http://anthonydugois.com/svg-path-builder/" }, "check the online version"))));



}

function Result(props) {
    return (
        React.createElement("div", { className: "ad-Result" },
            React.createElement("textarea", {
                className: "ad-Result-textarea",
                value: props.path,
                onFocus: function onFocus(e) {return e.target.select();} })));


}

/**
   * SVG rendering
   */var

SVG = function (_Component2) {_inherits(SVG, _Component2);function SVG() {_classCallCheck(this, SVG);return _possibleConstructorReturn(this, (SVG.__proto__ || Object.getPrototypeOf(SVG)).apply(this, arguments));}_createClass(SVG, [{ key: "render", value: function render()
        {var _props2 =












            this.props,path = _props2.path,w = _props2.w,h = _props2.h,grid = _props2.grid,points = _props2.points,activePoint = _props2.activePoint,addPoint = _props2.addPoint,handleMouseMove = _props2.handleMouseMove,setDraggedPoint = _props2.setDraggedPoint,setDraggedQuadratic = _props2.setDraggedQuadratic,setDraggedCubic = _props2.setDraggedCubic;

            var circles = points.map(function (p, i, a) {
                var anchors = [];

                if (p.q) {
                    anchors.push(
                    React.createElement(Quadratic, {
                        index: i,
                        p1x: a[i - 1].x,
                        p1y: a[i - 1].y,
                        p2x: p.x,
                        p2y: p.y,
                        x: p.q.x,
                        y: p.q.y,
                        setDraggedQuadratic: setDraggedQuadratic }));

                } else if (p.c) {
                    anchors.push(
                    React.createElement(Cubic, {
                        index: i,
                        p1x: a[i - 1].x,
                        p1y: a[i - 1].y,
                        p2x: p.x,
                        p2y: p.y,
                        x1: p.c[0].x,
                        y1: p.c[0].y,
                        x2: p.c[1].x,
                        y2: p.c[1].y,
                        setDraggedCubic: setDraggedCubic }));

                }

                return (
                    React.createElement("g", { className:
                            "ad-PointGroup" + (
                            i === 0 ? "  ad-PointGroup--first" : "") + (
                            activePoint === i ? "  is-active" : "") },

                        React.createElement(Point, {
                            index: i,
                            x: p.x,
                            y: p.y,
                            setDraggedPoint: setDraggedPoint }),
                        anchors));


            });

            return (
                React.createElement("svg", {
                        className: "ad-SVG",
                        width: w,
                        height: h,
                        onClick: function onClick(e) {return addPoint(e);},
                        onMouseMove: function onMouseMove(e) {return handleMouseMove(e);} },
                    React.createElement(Grid, {
                        w: w,
                        h: h,
                        grid: grid }),
                    React.createElement("path", {
                        className: "ad-Path",
                        d: path }),
                    React.createElement("g", { className: "ad-Points" },
                        circles)));



        } }]);return SVG;}(Component);


function Cubic(props) {
    return (
        React.createElement("g", { className: "ad-Anchor" },
            React.createElement("line", {
                className: "ad-Anchor-line",
                x1: props.p1x,
                y1: props.p1y,
                x2: props.x1,
                y2: props.y1 }),
            React.createElement("line", {
                className: "ad-Anchor-line",
                x1: props.p2x,
                y1: props.p2y,
                x2: props.x2,
                y2: props.y2 }),
            React.createElement("circle", {
                className: "ad-Anchor-point",
                onMouseDown: function onMouseDown(e) {return props.setDraggedCubic(props.index, 0);},
                cx: props.x1,
                cy: props.y1,
                r: 6 }),
            React.createElement("circle", {
                className: "ad-Anchor-point",
                onMouseDown: function onMouseDown(e) {return props.setDraggedCubic(props.index, 1);},
                cx: props.x2,
                cy: props.y2,
                r: 6 })));


}

function Quadratic(props) {
    return (
        React.createElement("g", { className: "ad-Anchor" },
            React.createElement("line", {
                className: "ad-Anchor-line",
                x1: props.p1x,
                y1: props.p1y,
                x2: props.x,
                y2: props.y }),
            React.createElement("line", {
                className: "ad-Anchor-line",
                x1: props.x,
                y1: props.y,
                x2: props.p2x,
                y2: props.p2y }),
            React.createElement("circle", {
                className: "ad-Anchor-point",
                onMouseDown: function onMouseDown(e) {return props.setDraggedQuadratic(props.index);},
                cx: props.x,
                cy: props.y,
                r: 6 })));


}

function Point(props) {
    return (
        React.createElement("circle", {
            className: "ad-Point",
            onMouseDown: function onMouseDown(e) {return props.setDraggedPoint(props.index);},
            cx: props.x,
            cy: props.y,
            r: 8 }));

}

function Grid(props) {var _props$grid =
    props.grid,show = _props$grid.show,snap = _props$grid.snap,size = _props$grid.size;

    var grid = [];

    for (var i = 1; i < props.w / size; i++) {
        grid.push(
        React.createElement("line", {
            x1: i * size,
            y1: 0,
            x2: i * size,
            y2: props.h }));

    }

    for (var _i = 1; _i < props.h / size; _i++) {
        grid.push(
        React.createElement("line", {
            x1: 0,
            y1: _i * size,
            x2: props.w,
            y2: _i * size }));

    }

    return (
        React.createElement("g", { className:
                "ad-Grid" + (
                !show ? "  is-hidden" : "") },

            grid));


}

/**
   * Controls
   */

function Controls(props) {
    var active = props.points[props.activePoint];
    var step = props.grid.snap ? props.grid.size : 1;

    var params = [];

    if (active.q) {
        params.push(
        React.createElement("div", { className: "ad-Controls-container" },
            React.createElement(Control, {
                name: "Control point X position",
                type: "range",
                min: 0,
                max: props.w,
                step: step,
                value: active.q.x,
                onChange: function onChange(e) {return props.setQuadraticPosition("x", e);} })));


        params.push(
        React.createElement("div", { className: "ad-Controls-container" },
            React.createElement(Control, {
                name: "Control point Y position",
                type: "range",
                min: 0,
                max: props.h,
                step: step,
                value: active.q.y,
                onChange: function onChange(e) {return props.setQuadraticPosition("y", e);} })));


    } else if (active.c) {
        params.push(
        React.createElement("div", { className: "ad-Controls-container" },
            React.createElement(Control, {
                name: "First control point X position",
                type: "range",
                min: 0,
                max: props.w,
                step: step,
                value: active.c[0].x,
                onChange: function onChange(e) {return props.setCubicPosition("x", 0, e);} })));


        params.push(
        React.createElement("div", { className: "ad-Controls-container" },
            React.createElement(Control, {
                name: "First control point Y position",
                type: "range",
                min: 0,
                max: props.h,
                step: step,
                value: active.c[0].y,
                onChange: function onChange(e) {return props.setCubicPosition("y", 0, e);} })));


        params.push(
        React.createElement("div", { className: "ad-Controls-container" },
            React.createElement(Control, {
                name: "Second control point X position",
                type: "range",
                min: 0,
                max: props.w,
                step: step,
                value: active.c[1].x,
                onChange: function onChange(e) {return props.setCubicPosition("x", 1, e);} })));


        params.push(
        React.createElement("div", { className: "ad-Controls-container" },
            React.createElement(Control, {
                name: "Second control point Y position",
                type: "range",
                min: 0,
                max: props.h,
                step: step,
                value: active.c[1].y,
                onChange: function onChange(e) {return props.setCubicPosition("y", 1, e);} })));


    } else if (active.a) {
        params.push(
        React.createElement("div", { className: "ad-Controls-container" },
            React.createElement(Control, {
                name: "X Radius",
                type: "range",
                min: 0,
                max: props.w,
                step: step,
                value: active.a.rx,
                onChange: function onChange(e) {return props.setArcParam("rx", e);} })));


        params.push(
        React.createElement("div", { className: "ad-Controls-container" },
            React.createElement(Control, {
                name: "Y Radius",
                type: "range",
                min: 0,
                max: props.h,
                step: step,
                value: active.a.ry,
                onChange: function onChange(e) {return props.setArcParam("ry", e);} })));


        params.push(
        React.createElement("div", { className: "ad-Controls-container" },
            React.createElement(Control, {
                name: "Rotation",
                type: "range",
                min: 0,
                max: 360,
                step: 1,
                value: active.a.rot,
                onChange: function onChange(e) {return props.setArcParam("rot", e);} })));


        params.push(
        React.createElement("div", { className: "ad-Controls-container" },
            React.createElement(Control, {
                name: "Large arc sweep flag",
                type: "checkbox",
                checked: active.a.laf,
                onChange: function onChange(e) {return props.setArcParam("laf", e);} })));


        params.push(
        React.createElement("div", { className: "ad-Controls-container" },
            React.createElement(Control, {
                name: "Sweep flag",
                type: "checkbox",
                checked: active.a.sf,
                onChange: function onChange(e) {return props.setArcParam("sf", e);} })));


    }

    return (
        React.createElement("div", { className: "ad-Controls" },
            React.createElement("h3", { className: "ad-Controls-title" }, "Parameters"),



            React.createElement("div", { className: "ad-Controls-container" },
                React.createElement(Control, {
                    name: "Width",
                    type: "text",
                    value: props.w,
                    onChange: function onChange(e) {return props.setWidth(e);} }),
                React.createElement(Control, {
                    name: "Height",
                    type: "text",
                    value: props.h,
                    onChange: function onChange(e) {return props.setHeight(e);} }),
                React.createElement(Control, {
                    name: "Close path",
                    type: "checkbox",
                    value: props.closePath,
                    onChange: function onChange(e) {return props.setClosePath(e);} })),

            React.createElement("div", { className: "ad-Controls-container" },
                React.createElement(Control, {
                    name: "Grid size",
                    type: "text",
                    value: props.grid.size,
                    onChange: function onChange(e) {return props.setGridSize(e);} }),
                React.createElement(Control, {
                    name: "Snap grid",
                    type: "checkbox",
                    checked: props.grid.snap,
                    onChange: function onChange(e) {return props.setGridSnap(e);} }),
                React.createElement(Control, {
                    name: "Show grid",
                    type: "checkbox",
                    checked: props.grid.show,
                    onChange: function onChange(e) {return props.setGridShow(e);} })),

            React.createElement("div", { className: "ad-Controls-container" },
                React.createElement(Control, {
                    type: "button",
                    action: "reset",
                    value: "Reset path",
                    onClick: function onClick(e) {return props.reset(e);} })),


            React.createElement("h3", { className: "ad-Controls-title" }, "Selected point"),



            props.activePoint !== 0 &&
            React.createElement("div", { className: "ad-Controls-container" },
                React.createElement(Control, {
                    name: "Point type",
                    type: "choices",
                    id: "pointType",
                    choices: [
                    { name: "L", value: "l", checked: !active.q && !active.c && !active.a },
                    { name: "Q", value: "q", checked: !!active.q },
                    { name: "C", value: "c", checked: !!active.c },
                    { name: "A", value: "a", checked: !!active.a }],

                    onChange: function onChange(e) {return props.setPointType(e);} })),


            React.createElement("div", { className: "ad-Controls-container" },
                React.createElement(Control, {
                    name: "Point X position",
                    type: "range",
                    min: 0,
                    max: props.w,
                    step: step,
                    value: active.x,
                    onChange: function onChange(e) {return props.setPointPosition("x", e);} })),

            React.createElement("div", { className: "ad-Controls-container" },
                React.createElement(Control, {
                    name: "Point Y position",
                    type: "range",
                    min: 0,
                    max: props.h,
                    step: step,
                    value: active.y,
                    onChange: function onChange(e) {return props.setPointPosition("y", e);} })),


            params,

            props.activePoint !== 0 &&
            React.createElement("div", { className: "ad-Controls-container" },
                React.createElement(Control, {
                    type: "button",
                    action: "delete",
                    value: "Remove this point",
                    onClick: function onClick(e) {return props.removeActivePoint(e);} }))));




}

function Control(props) {var

    name =


    props.name,type = props.type,_props = _objectWithoutProperties(props, ["name", "type"]);

    var control = "",label = "";

    switch (type) {
        case "range":control = React.createElement(Range, _props);
            break;
        case "text":control = React.createElement(Text, _props);
            break;
        case "checkbox":control = React.createElement(Checkbox, _props);
            break;
        case "button":control = React.createElement(Button, _props);
            break;
        case "choices":control = React.createElement(Choices, _props);
            break;}


    if (name) {
        label =
        React.createElement("label", { className: "ad-Control-label" },
            name);


    }

    return (
        React.createElement("div", { className: "ad-Control" },
            label,
            control));


}

function Choices(props) {
    var choices = props.choices.map(function (c, i) {
        return (
            React.createElement("label", { className: "ad-Choice" },
                React.createElement("input", {
                    className: "ad-Choice-input",
                    type: "radio",
                    value: c.value,
                    checked: c.checked,
                    name: props.id,
                    onChange: props.onChange }),
                React.createElement("div", { className: "ad-Choice-fake" },
                    c.name)));



    });

    return (
        React.createElement("div", { className: "ad-Choices" },
            choices));


}

function Button(props) {
    return (
        React.createElement("button", {
                className:
                "ad-Button" + (
                props.action ? "  ad-Button--" + props.action : ""),

                type: "button",
                onClick: props.onClick },
            props.value));


}

function Checkbox(props) {
    return (
        React.createElement("label", { className: "ad-Checkbox" },
            React.createElement("input", {
                className: "ad-Checkbox-input",
                type: "checkbox",
                onChange: props.onChange,
                checked: props.checked }),
            React.createElement("div", { className: "ad-Checkbox-fake" })));


}

function Text(props) {
    return (
        React.createElement("input", {
            className: "ad-Text",
            type: "text",
            value: props.value,
            onChange: props.onChange }));

}

function Range(props) {
    return (
        React.createElement("div", { className: "ad-Range" },
            React.createElement("input", {
                className: "ad-Range-input",
                type: "range",
                min: props.min,
                max: props.max,
                step: props.step,
                value: props.value,
                onChange: props.onChange }),
            React.createElement("input", {
                className: "ad-Range-text  ad-Text",
                type: "text",
                value: props.value,
                onChange: props.onChange })));


}

render(
React.createElement(Container, null),
document.querySelector("#app"));