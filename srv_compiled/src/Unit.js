"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });

var Unit = function () {
    function Unit(name, type, movement, position, player, used, attackWeak, attackStrong, defenseWeak, defenseStrong, health, range, action, hasAttacked) {
        _classCallCheck(this, Unit);

        this.name = name;
        this.type = type;
        this.movement = movement;
        this.position = position;
        this.player = player;
        this.used = used;
        this.attackWeak = attackWeak;
        this.attackStrong = attackStrong;
        this.defenseWeak = defenseWeak;
        this.defenseStrong = defenseStrong;
        this.health = health;
        this.range = range;
        this.hasAttacked = hasAttacked ? hasAttacked : false;
        this.action = action;
    }
    // Esta función calculará la cantidad de vida eliminada de la unidad defendiendo.


    _createClass(Unit, [{
        key: "calculateAttack",
        value: function calculateAttack(defendingUnit) {
            var healthRemoved = 0;
            if (this.attackWeak > defendingUnit.defenseWeak) {
                healthRemoved += this.attackWeak - defendingUnit.defenseWeak;
            }
            if (this.attackStrong > defendingUnit.defenseStrong) {
                healthRemoved += this.attackStrong - defendingUnit.defenseStrong;
            }
            return healthRemoved;
        }
    }]);

    return Unit;
}();

exports.Unit = Unit;

var Infantry = function (_Unit) {
    _inherits(Infantry, _Unit);

    function Infantry() {
        _classCallCheck(this, Infantry);

        return _possibleConstructorReturn(this, (Infantry.__proto__ || Object.getPrototypeOf(Infantry)).apply(this, arguments));
    }

    _createClass(Infantry, null, [{
        key: "create",
        value: function create(position, player) {
            return new Unit("Infantry", "infantry", 2, position, player, false,
            // Características de ataque débil y fuerte
            2, 2,
            // Características de defensa débil y fuerte
            1, 2,
            // Vida
            2,
            // Alcance
            1, 0);
        }
    }]);

    return Infantry;
}(Unit);

exports.Infantry = Infantry;

var Tank = function (_Unit2) {
    _inherits(Tank, _Unit2);

    function Tank() {
        _classCallCheck(this, Tank);

        return _possibleConstructorReturn(this, (Tank.__proto__ || Object.getPrototypeOf(Tank)).apply(this, arguments));
    }

    _createClass(Tank, null, [{
        key: "create",
        value: function create(position, player) {
            return new Unit("Tank", "tank", 1, position, player, false,
            // Características de ataque débil y fuerte
            2, 3,
            // Características de defensa débil y fuerte
            2, 1,
            // Vida
            4,
            // Alcance
            1, 0);
        }
    }]);

    return Tank;
}(Unit);

exports.Tank = Tank;

var General = function (_Unit3) {
    _inherits(General, _Unit3);

    function General() {
        _classCallCheck(this, General);

        return _possibleConstructorReturn(this, (General.__proto__ || Object.getPrototypeOf(General)).apply(this, arguments));
    }

    _createClass(General, null, [{
        key: "create",
        value: function create(position, player) {
            return new Unit("General", "general", 1, position, player, false,
            // Características de ataque débil y fuerte
            1, 0,
            // Características de defensa débil y fuerte
            1, 2,
            // Vida
            2,
            // Alcance
            0, 0);
        }
    }]);

    return General;
}(Unit);

exports.General = General;

var Paratrooper = function (_Unit4) {
    _inherits(Paratrooper, _Unit4);

    function Paratrooper() {
        _classCallCheck(this, Paratrooper);

        return _possibleConstructorReturn(this, (Paratrooper.__proto__ || Object.getPrototypeOf(Paratrooper)).apply(this, arguments));
    }

    _createClass(Paratrooper, null, [{
        key: "create",
        value: function create(position, player) {
            return new Unit("Paratrooper", "paratrooper", 5, position, player, false,
            // Características de ataque débil y fuerte
            3, 4,
            // Características de defensa débil y fuerte
            1, 2,
            // Vida
            3,
            // Alcance
            1, 0);
        }
    }]);

    return Paratrooper;
}(Unit);

exports.Paratrooper = Paratrooper;

var Artillery = function (_Unit5) {
    _inherits(Artillery, _Unit5);

    function Artillery() {
        _classCallCheck(this, Artillery);

        return _possibleConstructorReturn(this, (Artillery.__proto__ || Object.getPrototypeOf(Artillery)).apply(this, arguments));
    }

    _createClass(Artillery, null, [{
        key: "create",
        value: function create(position, player) {
            return new Unit("Artillery", "artillery", 2, position, player, false,
            // Características de ataque débil y fuerte
            2, 3,
            // Características de defensa débil y fuerte
            2, 2,
            // Vida
            3,
            // Alcance
            3, 0);
        }
    }]);

    return Artillery;
}(Unit);

exports.Artillery = Artillery;
exports.UNITS = ["General", "Infantry", "Tank", "Artillery", "Paratrooper"];
exports.UNITS_ESP = ["General", "Infantería", "Tanque", "Artillería", "Paracaidista"];