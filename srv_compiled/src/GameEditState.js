"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var Utils_1 = require("./Utils");
//Funciona igual que GameState solo que tiene acciones de edición

var EditActions = function () {
    function EditActions() {
        _classCallCheck(this, EditActions);
    }

    _createClass(EditActions, null, [{
        key: "selected",
        value: function selected(map, evt) {
            return {
                map: map,
                selected: evt,
                type: "SELECTED"
            };
        }
    }, {
        key: "onClickCreateTerrain",
        value: function onClickCreateTerrain(map) {
            return {
                map: map,
                type: "CREATE_TERRAIN"
            };
        }
    }, {
        key: "generateSetListener",
        value: function generateSetListener(map) {
            return {
                map: map,
                type: "SET_LISTENER"
            };
        }
    }, {
        key: "saveState",
        value: function saveState(map, side, terrains, cursorPosition, selected, type) {
            return {
                map: map,
                side: side,
                terrains: terrains,
                cursorPosition: cursorPosition,
                selected: selected,
                type: "SAVE"
            };
        }
    }]);

    return EditActions;
}();

exports.EditActions = EditActions;
function getInitialStateEdit() {
    return {
        map: null,
        side: true,
        terrains: new Array(),
        cursorPosition: new Utils_1.Pair(0, 0),
        selected: null,
        type: "SET_LISTENER"
    };
}
exports.InitialStateEdit = getInitialStateEdit();
//Se actualizan cada uno de los estados, está puesto un forceUpdate ya que no se actualizaba
exports.ReducerEdit = function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : exports.InitialStateEdit;
    var action = arguments[1];

    switch (action.type) {
        case "SELECTED":
            action.map.forceUpdate();
            return {
                map: action.map,
                side: state.side,
                terrains: state.terrains,
                cursorPosition: state.cursorPosition,
                selected: action.selected,
                type: state.type
            };
        case "CREATE_TERRAIN":
            action.map.forceUpdate();
            return {
                map: action.map,
                side: state.side,
                terrains: state.terrains,
                cursorPosition: state.cursorPosition,
                selected: state.selected,
                type: action.type
            };
        case "SAVE":
            action.map.forceUpdate();
            return {
                map: action.map,
                side: action.side,
                terrains: action.terrains,
                cursorPosition: action.cursorPosition,
                selected: action.selected,
                type: state.type
            };
        case "SET_LISTENER":
            action.map.forceUpdate();
            return {
                map: action.map,
                side: state.side,
                terrains: state.terrains,
                cursorPosition: state.cursorPosition,
                selected: state.selected,
                type: action.type
            };
        default:
            return state;
    }
};