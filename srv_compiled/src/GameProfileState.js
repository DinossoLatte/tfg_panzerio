"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });

var ProfileActions = function () {
    function ProfileActions() {
        _classCallCheck(this, ProfileActions);
    }

    _createClass(ProfileActions, null, [{
        key: "save",
        value: function save(profile, armies, selectedArmy, selected, type) {
            return {
                profile: profile,
                armies: armies,
                selectedArmy: selectedArmy,
                selected: selected,
                type: type,
                actionType: "SAVE"
            };
        }
    }]);

    return ProfileActions;
}();

exports.ProfileActions = ProfileActions;
function getInitialStateProfile() {
    return {
        profile: null,
        armies: new Array(),
        selectedArmy: null,
        selected: null,
        type: "0"
    };
}
exports.InitialStateProfile = getInitialStateProfile();
//Se actualizan cada uno de los estados, está puesto un forceUpdate ya que no se actualizaba
exports.ReducerProfile = function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : exports.InitialStateProfile;
    var action = arguments[1];

    switch (action.actionType) {
        case "SAVE":
            action.profile.forceUpdate();
            return {
                profile: action.profile,
                armies: action.armies,
                selectedArmy: action.selectedArmy,
                selected: action.selected,
                type: action.type
            };
        default:
            return state;
    }
};