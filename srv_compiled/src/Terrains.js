"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });

var Terrain = function Terrain(name, image, movement_penalty, position, defenseWeak, defenseStrong) {
    _classCallCheck(this, Terrain);

    this.name = name;
    this.image = image;
    this.movement_penalty = movement_penalty;
    this.position = position;
    this.defenseWeak = defenseWeak;
    this.defenseStrong = defenseStrong;
};

exports.Terrain = Terrain;

var Plains = function (_Terrain) {
    _inherits(Plains, _Terrain);

    function Plains() {
        _classCallCheck(this, Plains);

        return _possibleConstructorReturn(this, (Plains.__proto__ || Object.getPrototypeOf(Plains)).apply(this, arguments));
    }

    _createClass(Plains, null, [{
        key: "create",
        value: function create(position) {
            return new Terrain("Plains", "imgs/terrain_plains.png", 1, position, 0, 0);
        }
    }]);

    return Plains;
}(Terrain);

exports.Plains = Plains;

var ImpassableMountain = function (_Terrain2) {
    _inherits(ImpassableMountain, _Terrain2);

    function ImpassableMountain() {
        _classCallCheck(this, ImpassableMountain);

        return _possibleConstructorReturn(this, (ImpassableMountain.__proto__ || Object.getPrototypeOf(ImpassableMountain)).apply(this, arguments));
    }

    _createClass(ImpassableMountain, null, [{
        key: "create",
        value: function create(position) {
            // Al no ser accesible, la defensa es innecesaria
            return new Terrain("Mountains", "imgs/terrain_mountain.png", -1, position, 0, 0);
        }
    }]);

    return ImpassableMountain;
}(Terrain);

exports.ImpassableMountain = ImpassableMountain;

var Hills = function (_Terrain3) {
    _inherits(Hills, _Terrain3);

    function Hills() {
        _classCallCheck(this, Hills);

        return _possibleConstructorReturn(this, (Hills.__proto__ || Object.getPrototypeOf(Hills)).apply(this, arguments));
    }

    _createClass(Hills, null, [{
        key: "create",
        value: function create(position) {
            return new Terrain("Hills", "imgs/terrain_hills.png", 2, position, 1, 1);
        }
    }]);

    return Hills;
}(Terrain);

exports.Hills = Hills;

var Forest = function (_Terrain4) {
    _inherits(Forest, _Terrain4);

    function Forest() {
        _classCallCheck(this, Forest);

        return _possibleConstructorReturn(this, (Forest.__proto__ || Object.getPrototypeOf(Forest)).apply(this, arguments));
    }

    _createClass(Forest, null, [{
        key: "create",
        value: function create(position) {
            return new Terrain("Forest", "imgs/terrain_forest.png", 1, position, 2, 0);
        }
    }]);

    return Forest;
}(Terrain);

exports.Forest = Forest;
exports.TERRAINS = ["Plains", "Mountains", "Hills", "Forest"];
exports.TERRAINS_ESP = ["Llanura", "Montaña", "Colina", "Bosque"];