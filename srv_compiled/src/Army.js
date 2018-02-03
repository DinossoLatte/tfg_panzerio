"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });

var Army = function () {
    function Army(army, name) {
        _classCallCheck(this, Army);

        this.army = army;
        this.name = name;
    }

    _createClass(Army, [{
        key: "getArmy",
        value: function getArmy() {
            return this.army;
        }
    }, {
        key: "getName",
        value: function getName() {
            return this.name;
        }
    }, {
        key: "setArmy",
        value: function setArmy(army) {
            this.army = army;
        }
    }, {
        key: "setName",
        value: function setName(name) {
            this.name = name;
        }
    }]);

    return Army;
}();

exports.Army = Army;