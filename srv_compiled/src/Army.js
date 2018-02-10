"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });

var Army = function Army(army, name) {
    _classCallCheck(this, Army);

    this.unitList = army;
    this.name = name;
};

exports.Army = Army;