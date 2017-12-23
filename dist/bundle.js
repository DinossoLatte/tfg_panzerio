/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Pair = /** @class */ (function () {
    function Pair(x, y) {
        this.row = x;
        this.column = y;
    }
    Pair.prototype.getColumn = function () {
        return this.column;
    };
    Pair.prototype.getRow = function () {
        return this.row;
    };
    Pair.prototype.setColumn = function (x) {
        this.column = x;
    };
    Pair.prototype.setRow = function (y) {
        this.row = y;
    };
    Pair.prototype.add = function (pair) {
        var new_pair = new Pair(0, 0);
        new_pair.row = this.row + pair.row;
        new_pair.column = this.column + pair.column;
        return new_pair;
    };
    Pair.prototype.equals = function (pair) {
        return this.row == pair.row && this.column == pair.column;
    };
    Pair.prototype.toString = function () {
        return "(" + this.row + ", " + this.column + ")";
    };
    return Pair;
}());
exports.Pair = Pair;
/* Representación cúbica del hexágono */
var Cubic = /** @class */ (function () {
    // TODO: Este constructor debe sólo admitir x,y y z. Se debe poner un método estático de conversión!!!
    function Cubic(pair) {
        this.x = pair.column;
        this.z = pair.row - (pair.column - (pair.column & 1)) / 2;
        this.y = -this.x - this.z;
    }
    /* Calcula la distancia Manhattan */
    Cubic.prototype.distanceTo = function (cubic) {
        return Math.max(Math.abs(this.x - cubic.x), Math.abs(this.y - cubic.y), Math.abs(this.z - cubic.z));
    };
    Cubic.prototype.getPair = function () {
        return new Pair(this.z + (this.x - (this.x & 1)) / 2, this.x);
    };
    Cubic.prototype.getX = function () {
        return this.x;
    };
    Cubic.prototype.getY = function () {
        return this.y;
    };
    Cubic.prototype.getZ = function () {
        return this.z;
    };
    Cubic.prototype.add = function (cubic) {
        var new_cubic = Object.create(this);
        new_cubic.sum(cubic);
        return new_cubic;
    };
    Cubic.prototype.sum = function (cubic) {
        this.x = this.x + cubic.getX();
        this.y = this.y + cubic.getY();
        this.z = this.z + cubic.getZ();
    };
    Cubic.prototype.toString = function () {
        return "(" + this.x + ", " + this.y + ", " + this.z + ")";
    };
    return Cubic;
}());
exports.Cubic = Cubic;
exports.cubic_directions = [
    new Cubic(new Pair(0, 1)), new Cubic(new Pair(-1, 1)), new Cubic(new Pair(-1, 0)),
    new Cubic(new Pair(-1, -1)), new Cubic(new Pair(0, -1)), new Cubic(new Pair(1, 0))
];
//Debido a que indexOf de los array iguala con ===, no es posible saber si un objeto está dentro de un array sino es identicamente el mismo objeto
//por eso se ha creado este método auxiliar para ayudar al cálculo
function myIndexOf(arr, o) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].column == o.column && arr[i].row == o.row) {
            return i;
        }
    }
    return -1;
}
exports.myIndexOf = myIndexOf;
//Igual que el de arriba pero para cúbica
function myIndexOfCubic(arr, o) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].getX() == o.getX() && arr[i].getY() == o.getY() && arr[i].getZ() == o.getZ()) {
            return i;
        }
    }
    return -1;
}
exports.myIndexOfCubic = myIndexOfCubic;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Redux = __webpack_require__(16);
var GameState_1 = __webpack_require__(10);
exports.store = Redux.createStore(GameState_1.Reducer);
function saveState(action) {
    exports.store.dispatch(action);
    // Refresca el mapa y el resto de variables del estado
    var map = exports.store.getState().map;
    var units = exports.store.getState().units;
    var terrains = exports.store.getState().terrains;
    var selectedUnit = exports.store.getState().selectedUnit;
    var cursorPosition = exports.store.getState().cursorPosition;
    var type = exports.store.getState().type;
    map.setState({});
}
exports.saveState = saveState;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ActionTypes; });
/* harmony export (immutable) */ __webpack_exports__["b"] = createStore;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_es_isPlainObject__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_symbol_observable__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_symbol_observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_symbol_observable__);



/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var ActionTypes = {
  INIT: '@@redux/INIT'

  /**
   * Creates a Redux store that holds the state tree.
   * The only way to change the data in the store is to call `dispatch()` on it.
   *
   * There should only be a single store in your app. To specify how different
   * parts of the state tree respond to actions, you may combine several reducers
   * into a single reducer function by using `combineReducers`.
   *
   * @param {Function} reducer A function that returns the next state tree, given
   * the current state tree and the action to handle.
   *
   * @param {any} [preloadedState] The initial state. You may optionally specify it
   * to hydrate the state from the server in universal apps, or to restore a
   * previously serialized user session.
   * If you use `combineReducers` to produce the root reducer function, this must be
   * an object with the same shape as `combineReducers` keys.
   *
   * @param {Function} [enhancer] The store enhancer. You may optionally specify it
   * to enhance the store with third-party capabilities such as middleware,
   * time travel, persistence, etc. The only store enhancer that ships with Redux
   * is `applyMiddleware()`.
   *
   * @returns {Store} A Redux store that lets you read the state, dispatch actions
   * and subscribe to changes.
   */
};function createStore(reducer, preloadedState, enhancer) {
  var _ref2;

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */
  function getState() {
    return currentState;
  }

  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.');
    }

    var isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      isSubscribed = false;

      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }

  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */
  function dispatch(action) {
    if (!Object(__WEBPACK_IMPORTED_MODULE_0_lodash_es_isPlainObject__["a" /* default */])(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }

    return action;
  }

  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer;
    dispatch({ type: ActionTypes.INIT });
  }

  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/tc39/proposal-observable
   */
  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe(observer) {
        if (typeof observer !== 'object') {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return { unsubscribe: unsubscribe };
      }
    }, _ref[__WEBPACK_IMPORTED_MODULE_1_symbol_observable___default.a] = function () {
      return this;
    }, _ref;
  }

  // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.
  dispatch({ type: ActionTypes.INIT });

  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[__WEBPACK_IMPORTED_MODULE_1_symbol_observable___default.a] = observable, _ref2;
}

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__baseGetTag_js__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__getPrototype_js__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__isObjectLike_js__ = __webpack_require__(24);




/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!Object(__WEBPACK_IMPORTED_MODULE_2__isObjectLike_js__["a" /* default */])(value) || Object(__WEBPACK_IMPORTED_MODULE_0__baseGetTag_js__["a" /* default */])(value) != objectTag) {
    return false;
  }
  var proto = Object(__WEBPACK_IMPORTED_MODULE_1__getPrototype_js__["a" /* default */])(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

/* harmony default export */ __webpack_exports__["a"] = (isPlainObject);


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__root_js__ = __webpack_require__(18);


/** Built-in value references. */
var Symbol = __WEBPACK_IMPORTED_MODULE_0__root_js__["a" /* default */].Symbol;

/* harmony default export */ __webpack_exports__["a"] = (Symbol);


/***/ }),
/* 7 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = warning;
/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */
  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */
}

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = compose;
/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

function compose() {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(function (a, b) {
    return function () {
      return a(b.apply(undefined, arguments));
    };
  });
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Utils_1 = __webpack_require__(1);
var Unit_1 = __webpack_require__(32);
var Terrains_1 = __webpack_require__(11);
var Actions = /** @class */ (function () {
    function Actions() {
    }
    //Estos son los estados posibles
    Actions.generateChangeUnitPos = function (unit_id, new_position, selectedUnit, player) {
        //Este estado es el de cambiar la posición (justo cuando hace clic de a donde quiere ir)
        return {
            type: "CHANGE_UNIT_POS",
            unit_id: unit_id,
            new_position: new_position,
            selectedUnit: selectedUnit,
            player: player
        };
    };
    Actions.generateMove = function (unit_id, player) {
        //ESte estado es el de mantener la unidad seleccionada
        return {
            type: "MOVE",
            unit_id: unit_id,
            player: player
        };
    };
    Actions.generateCursorMovement = function (new_position) {
        return {
            type: "CURSOR_MOVE",
            position: new_position
        };
    };
    Actions.generateSetListener = function (map) {
        //Este es el estado de espera para seleccionar una unidad
        return {
            type: "SET_LISTENER",
            map: map
        };
    };
    Actions.attack = function (unit_id, player) {
        //Este estado se envía la unidad a atacar (se eliminará del array) y si es del jugador o no
        return {
            type: "ATTACK",
            unit_id: unit_id,
            player: player
        };
    };
    Actions.finish = function () {
        //Este estado por ahora simplemente hace que no se pueda jugar hasta que se reinicie la partida
        return {
            type: "FINISH"
        };
    };
    return Actions;
}());
exports.Actions = Actions;
//El estado inicial será este (selectedUnit es el valor del indice en la lista de unidades(position) de la unidad seleccionada)
exports.InitialState = {
    units: [Unit_1.General.create(new Utils_1.Pair(0, 0), true), Unit_1.Infantry.create(new Utils_1.Pair(0, 1), true), Unit_1.Tank.create(new Utils_1.Pair(1, 0), true), Unit_1.General.create(new Utils_1.Pair(0, 4), false),
        Unit_1.Infantry.create(new Utils_1.Pair(1, 4), false), Unit_1.Tank.create(new Utils_1.Pair(0, 3), false)],
    visitables: null,
    terrains: [Terrains_1.ImpassableMountain.create(new Utils_1.Pair(2, 2)), Terrains_1.ImpassableMountain.create(new Utils_1.Pair(3, 2)), Terrains_1.Hills.create(new Utils_1.Pair(2, 3)), Terrains_1.Forest.create(new Utils_1.Pair(3, 3))],
    cursorPosition: new Utils_1.Pair(0, 0),
    map: null,
    selectedUnit: null,
    type: "SET_LISTENER"
};
//Y aquí se producirá el cambio
exports.Reducer = function (state, action) {
    if (state === void 0) { state = exports.InitialState; }
    //Dependiendo del tipo se cambiarán las variables del estado
    switch (action.type) {
        case "CHANGE_UNIT_POS":
            if (action.player == state.units[action.unit_id].player) {
                state.units[action.unit_id].position = action.new_position;
            }
            return {
                units: state.units,
                visitables: state.visitables,
                terrains: state.terrains,
                map: state.map,
                selectedUnit: action.selectedUnit,
                cursorPosition: state.cursorPosition,
                type: "SET_LISTENER"
            };
        case "MOVE":
            // Para reducir los cálculos del movimiento, vamos a realizar en este punto el cálculo de las celdas visitables
            var visitables_cubic = [new Utils_1.Cubic(state.units[action.unit_id].position)];
            var movements = state.units[action.unit_id].movement;
            // Los vecinos estarán compuestos por la posición cúbica y el número de movimientos para pasar la posición
            var neighbours = new Array();
            // Primero, iteraremos desde 0 hasta el número de movimientos
            for (var i = 0; i <= movements; i++) {
                // Añadimos los vecinos que queden, son celdas visitables:
                visitables_cubic = visitables_cubic.concat(neighbours.filter(function (possible_tuple) { return possible_tuple[1] == 0; }).map(function (x) { return x[0]; }));
                // Calculamos los próximos vecinos:
                var new_neighbours = [];
                for (var index_directions = 0; index_directions < Utils_1.cubic_directions.length; index_directions++) {
                    visitables_cubic.forEach(function (cubic) {
                        var new_cubic = cubic.add(Utils_1.cubic_directions[index_directions]);
                        // Siempre que la nueva casilla no esté en la lista de visitables ni sea una posición no alcanzable.
                        if (Utils_1.myIndexOfCubic(visitables_cubic, new_cubic) == -1) {
                            var indexOfNeighbours = Utils_1.myIndexOfCubic(neighbours.map(function (x) { return x[0]; }), new_cubic);
                            // Para añadir la posición, comprobamos primero que no esté la posición:
                            if (indexOfNeighbours == -1) {
                                // Si es el caso, debemos comprobar que la posición no esté ocupada por una de las unidades del jugador
                                var positionIndex = state.units
                                    .filter(function (x) { return x.player == action.player; }) // Si debe estar ocupada por una unidad, que sea únicamente la enemigas
                                    .map(function (y) { return y.position; });
                                if (Utils_1.myIndexOf(positionIndex, new_cubic.getPair()) == -1) {
                                    // Obtenemos el índice del obstáculo si está en la lista.
                                    var indexOfObstacle = Utils_1.myIndexOf(state.terrains.map(function (x) { return x.position; }), new_cubic.getPair());
                                    // Si se admite, añadimos la posición y la cantidad de movimientos para pasar por la casilla
                                    new_neighbours.push([new_cubic,
                                        // Por ahora se comprueba si está en la lista de obstáculos, en cuyo caso coge la cantidad. En caso contrario, asumimos Plains
                                        indexOfObstacle > -1 ? state.terrains[indexOfObstacle].movement_penalty : 0]);
                                }
                            }
                            else {
                                // Actualizamos el movimiento de la unidad, si es el caso.
                                var cell = neighbours[indexOfNeighbours];
                                new_neighbours.push([cell[0], cell[1] - 1]);
                            }
                        }
                    });
                }
                neighbours = new_neighbours;
            }
            // Finalmente convertimos el resultado a Pair:
            var visitables_pair = visitables_cubic.map(function (cubic) { return cubic.getPair(); });
            return {
                units: state.units,
                visitables: visitables_pair,
                terrains: state.terrains,
                map: state.map,
                selectedUnit: action.unit_id,
                cursorPosition: state.cursorPosition,
                type: "MOVE"
            };
        case "SET_LISTENER":
            return {
                units: state.units,
                visitables: state.visitables,
                terrains: state.terrains,
                map: action.map,
                selectedUnit: state.selectedUnit,
                cursorPosition: state.cursorPosition,
                type: "SET_LISTENER"
            };
        case "CURSOR_MOVE":
            return {
                units: state.units,
                visitables: state.visitables,
                terrains: state.terrains,
                map: state.map,
                cursorPosition: action.position,
                selectedUnit: state.selectedUnit,
                type: state.type
            };
        case "ATTACK":
            state.units.splice(action.unit_id, 1);
            return {
                units: state.units,
                visitables: state.visitables,
                terrains: state.terrains,
                map: state.map,
                cursorPosition: state.cursorPosition,
                selectedUnit: state.selectedUnit,
                type: "MOVE"
            };
        case "FINISH":
            return {
                units: state.units,
                visitables: state.visitables,
                terrains: state.terrains,
                map: state.map,
                cursorPosition: state.cursorPosition,
                selectedUnit: state.selectedUnit,
                type: action.type
            };
        default:
            return state;
    }
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Terrain = /** @class */ (function () {
    function Terrain(name, image, movement_penalty, position) {
        this.name = name;
        this.image = image;
        this.movement_penalty = movement_penalty;
        this.position = position;
    }
    return Terrain;
}());
exports.Terrain = Terrain;
var Plains = /** @class */ (function (_super) {
    __extends(Plains, _super);
    function Plains() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Plains.create = function (position) {
        return new Terrain("Plains", "imgs/terrain_plains.png", 0, position);
    };
    return Plains;
}(Terrain));
exports.Plains = Plains;
var ImpassableMountain = /** @class */ (function (_super) {
    __extends(ImpassableMountain, _super);
    function ImpassableMountain() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ImpassableMountain.create = function (position) {
        return new Terrain("Mountains (impassable)", "imgs/terrain_mountain.png", -1, position);
    };
    return ImpassableMountain;
}(Terrain));
exports.ImpassableMountain = ImpassableMountain;
var Hills = /** @class */ (function (_super) {
    __extends(Hills, _super);
    function Hills() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Hills.create = function (position) {
        return new Terrain("Hills", "imgs/terrain_hills.png", 2, position);
    };
    return Hills;
}(Terrain));
exports.Hills = Hills;
var Forest = /** @class */ (function (_super) {
    __extends(Forest, _super);
    function Forest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Forest.create = function (position) {
        return new Terrain("Forest", "imgs/terrain_forest.png", 1, position);
    };
    return Forest;
}(Terrain));
exports.Forest = Forest;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
var ReactDOM = __webpack_require__(13);
var Game_1 = __webpack_require__(14);
// Representa la aplicación, por ahora únicamente el mapa
ReactDOM.render(React.createElement(Game_1.Game, null), document.getElementById("root"));


/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
var Map_1 = __webpack_require__(15);
var EnterGameButton = /** @class */ (function (_super) {
    __extends(EnterGameButton, _super);
    function EnterGameButton(props) {
        return _super.call(this, props) || this;
    }
    EnterGameButton.prototype.render = function () {
        return React.createElement("button", { id: "enterGame", name: "enterGame", className: "enterGameButton", onClick: this.onClick.bind(this) }, "Jugar");
    };
    EnterGameButton.prototype.onClick = function () {
        this.props.parentObject.changeGameState(2);
    };
    return EnterGameButton;
}(React.Component));
var OptionsMenuButton = /** @class */ (function (_super) {
    __extends(OptionsMenuButton, _super);
    function OptionsMenuButton(props) {
        return _super.call(this, props) || this;
    }
    OptionsMenuButton.prototype.render = function () {
        return React.createElement("button", { id: "optionsMenu", name: "optionsMenu", className: "optionsMenuButton", onClick: this.onClick.bind(this) }, "Acceder al menu de opciones");
    };
    OptionsMenuButton.prototype.onClick = function () {
        this.props.parentObject.changeGameState(1);
    };
    return OptionsMenuButton;
}(React.Component));
var OptionsMenu = /** @class */ (function (_super) {
    __extends(OptionsMenu, _super);
    function OptionsMenu(props) {
        return _super.call(this, props) || this;
    }
    OptionsMenu.prototype.render = function () {
        return React.createElement("div", { className: "optionsMenu" },
            React.createElement("button", null, "Test"),
            React.createElement("button", null, "Test"),
            React.createElement("button", { id: "exitButton", name: "exitButton", onClick: this.onClick.bind(this) }, "Volver al menu"));
    };
    OptionsMenu.prototype.onClick = function (clickEvent) {
        this.props.parentObject.changeGameState(0);
    };
    return OptionsMenu;
}(React.Component));
var Game = /** @class */ (function (_super) {
    __extends(Game, _super);
    function Game(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { gameState: 0 }; // 0 es el menu del juego, 1 será el menú de opciones y 2 será el juego
        return _this;
    }
    Game.prototype.render = function () {
        var result;
        if (this.state.gameState == 2) {
            result = React.createElement(Map_1.Map, { horizontal: "6", vertical: "6", parentObject: this });
        }
        else if (this.state.gameState == 1) {
            result = React.createElement(OptionsMenu, { parentObject: this });
        }
        else {
            result = (React.createElement("div", { className: "menu" },
                React.createElement(EnterGameButton, { parentObject: this }),
                React.createElement("br", null),
                React.createElement(OptionsMenuButton, { parentObject: this }),
                React.createElement("br", null)));
        }
        return result;
    };
    Game.prototype.changeGameState = function (stateNumber) {
        this.setState({ gameState: stateNumber });
    };
    return Game;
}(React.Component));
exports.Game = Game;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
var Store_1 = __webpack_require__(2);
var GameState_1 = __webpack_require__(10);
var Cell_1 = __webpack_require__(33);
var Utils_1 = __webpack_require__(1);
/** Representa el mapa que contendrá las unidades y las casillas **/
var Map = /** @class */ (function (_super) {
    __extends(Map, _super);
    /** @constructor  Deben introducirse los elementos horizontal y vertical **/
    function Map(props) {
        var _this = _super.call(this, props) || this;
        _this.turn = 0;
        _this.actualstate = 0;
        _this.state = { cells: new Array(_this.props.horizontal), rows: _this.props.vertical, columns: _this.props.horizontal };
        Store_1.store.dispatch(GameState_1.Actions.generateSetListener(_this));
        return _this;
    }
    /** Renderiza el mapa **/
    Map.prototype.render = function () {
        // El mapa se renderizará en un div con estilo, por ello debemos usar className="map"
        return (React.createElement("div", null,
            React.createElement("p", null,
                "Turno del ",
                this.turn % 2 == 0 ? "Jugador" : "Enemigo",
                ". D\u00EDa ",
                this.turn,
                this.actualstate == 1 ? ". Victoria" : this.actualstate == 2 ? ". Derrota" : ""),
            React.createElement("button", { id: "exitButton", name: "exitButton", onClick: this.onClickExit.bind(this) }, "Salir del juego"),
            React.createElement("button", { id: "nextTurn", name: "nextTurn", onClick: this.onClickTurn.bind(this) }, "Pasar turno"),
            React.createElement("div", { id: "map", className: "map", onClick: this.onClick.bind(this), tabIndex: 0, onKeyDown: this.onKey.bind(this) }, this.generateMap.bind(this)().map(function (a) {
                return a;
            }))));
    };
    Map.prototype.onClickExit = function (event) {
        this.props.parentObject.changeGameState(0); // Salir de la partida.
    };
    Map.prototype.onClickTurn = function (event) {
        //Si se pulsa al botón se pasa de turno esto se hace para asegurar que el jugador no quiere hacer nada o no puede en su turno
        //Evitando pasar turno automaticamente ya que el jugador quiera ver alguna cosa de sus unidades o algo aunque no tenga movimientos posibles
        //Esto pasa en muchos otros juegos
        this.turn++;
        Store_1.saveState(GameState_1.Actions.generateSetListener(this));
    };
    Map.prototype.onKey = function (keyEvent) {
        var keyCode = keyEvent.key;
        var cursorPosition, newCursorPosition;
        console.log("KeyCode: " + keyCode);
        switch (keyCode) {
            case 'Escape':
                this.props.parentObject.changeGameState(0); // Retornamos al menu.
                break;
            // Los siguientes casos corresponden con las teclas del numpad, para mover el cursor
            case '1':
                // La tecla 1 del numpad (-1,+1)
                // Primero, obtenemos la posición de la casilla
                cursorPosition = Store_1.store.getState().cursorPosition;
                // Crearemos una nueva posición resultado
                newCursorPosition = new Utils_1.Pair(cursorPosition.row + (cursorPosition.column & 1 ? 1 : 0), cursorPosition.column - 1);
                // Llamamos a la acción para cambiarlo
                break;
            case '2':
                // La tecla 2 del numpad (0,+1)
                cursorPosition = Store_1.store.getState().cursorPosition;
                newCursorPosition = new Utils_1.Pair(cursorPosition.row + 1, cursorPosition.column);
                break;
            case '3':
                // La tecla 3 del numpad (+1,+1)
                cursorPosition = Store_1.store.getState().cursorPosition;
                newCursorPosition = new Utils_1.Pair(cursorPosition.row + (cursorPosition.column & 1 ? 1 : 0), cursorPosition.column + 1);
                break;
            case '7':
                // La tecla 7 del numpad (-1,-1)
                cursorPosition = Store_1.store.getState().cursorPosition;
                newCursorPosition = new Utils_1.Pair(cursorPosition.row - (cursorPosition.column & 1 ? 0 : 1), cursorPosition.column - 1);
                break;
            case '8':
                // La tecla 8 del numpad (0, -1)
                cursorPosition = Store_1.store.getState().cursorPosition;
                newCursorPosition = new Utils_1.Pair(cursorPosition.row - 1, cursorPosition.column);
                break;
            case '9':
                // La tecla 9 del numpad (+1, -1)
                cursorPosition = Store_1.store.getState().cursorPosition;
                newCursorPosition = new Utils_1.Pair(cursorPosition.row - (cursorPosition.column & 1 ? 0 : 1), cursorPosition.column + 1);
                break;
            case '5':
            case ' ':
                // Realizar el click en la posición
                cursorPosition = Store_1.store.getState().cursorPosition;
                this.clickAction(cursorPosition.row, cursorPosition.column);
                break;
        }
        // Si puede hacerse el movimiento, realiza la acción
        if (newCursorPosition && newCursorPosition.row >= 0 && newCursorPosition.column >= 0 && newCursorPosition.column <= this.props.vertical && newCursorPosition.row <= this.props.horizontal) {
            Store_1.saveState(GameState_1.Actions.generateCursorMovement(newCursorPosition));
        }
    };
    /** Placeholder, contendrá la lógica de selección de la casilla correcta. **/
    Map.prototype.onClick = function (event) {
        // Para obtener las posiciones relativas al mapa, obtenemos las posiciones absolutas del primer objeto, que es el hexágono primero.
        var dimensions = document.getElementById("hex0_0").getBoundingClientRect();
        // Para soportar mejor los cambios de pantalla, obtenemos las dimensiones del hex primero, para los demás será igual.
        var height = dimensions.bottom - dimensions.top; // Hardcoded, se deberían realizar más pruebas
        var width = Math.round(height * 1.153846154); // El valor que se multiplica es la proporción entre el height y width
        var x = event.clientX - dimensions.left; // A las coordenadas absolutas les restamos las dimensiones en el extremo superior izquierdo del primer hex.
        var y = event.clientY - dimensions.top;
        var column = Math.floor(x / (3 / 4 * width)); // Primero, encontramos la columna aproximada, dividiendo la posición por 3/4 la anchura (debido a los siguientes cálculos)
        var row; // Definimos el número de fila.
        var isOdd = column % 2 == 1; // Comprobamos si la columna de hexes es impar, ya que estará bajada por la mitad de la altura
        switch (isOdd) {
            case true:
                // Se le restará la mitad de la altura del hex.
                row = Math.floor((y - (height / 2)) / height);
                break;
            case false:
                // En otro caso, se obtendrá de forma parecida a la columna. Dividiendo la altura del hex (como se verá, no es multiplicado por 3/4 al no existir un extremo en esa posición).
                row = Math.floor(y / height);
        }
        // En este momento, tendrémos la casilla correcta aproximada.
        var centerX = Math.round(column * (3 / 4 * width) + width / 2); // Para encontrar el punto central del hex más cercano. 3/4 ya que los hexes están solapados.
        var centerY;
        switch (isOdd) {
            case true:
                // El punto central equivale a la fila por el tamaño del hex más la mitad (punto medio) más el offset por la fila impar
                centerY = Math.round(row * height + height);
                break;
            case false:
                // En otro caso, no existirá el offset por la fila impar.
                centerY = Math.round(row * height + (height / 2));
        }
        var radius = Math.round(height / 4); // Tomamos el radio más pequeño, siendo este la mitad de la altura del hex.
        // Comprobación de si está el punto en el círculo
        if (!this.getInCircle(centerX, centerY, radius, x, y)) {
            // Debemos calcular la distancia entre los otros hexágonos:
            // Debe tenerse en cuenta que estamos intentando encontrar si el punto está en el extremo de forma "<"
            // Primero comprobamos si debemos escoger el hexágono superior o inferior
            var isUpper = y < centerY;
            // Recogemos la posición del hex horizontal siguiente:
            var comparingHexX = Math.round(centerX - (width * 3 / 4));
            // Y dependiendo de que esté arriba o debajo, la posición vertical del hex posible:
            var comparingHexY = Math.round(isUpper ? (centerY - (height / 2)) : (centerY + (height / 2)));
            // Calculamos la distancia entre todos los posibles hexes:
            var distanceCircle = this.calculateDistance(centerX, centerY, x, y);
            var distancePossibleHex = this.calculateDistance(comparingHexX, comparingHexY, x, y);
            // Si la distancia del hex posible es menor al del círculo, entonces cambiamos el row y column
            if (distancePossibleHex < distanceCircle) {
                // Debido al sistema de identificación usado, es necesario añadir reglas si el hex es impar o par.
                if (isOdd) {
                    column--;
                    if (!isUpper) {
                        row++;
                    }
                }
                else {
                    column--;
                    if (isUpper) {
                        row--;
                    }
                }
            }
        }
        //Si el juego está terminado entonces no hace nada, por eso comprueba si todavía sigue la partida
        if (Store_1.store.getState().type != "FINISH") {
            //Guardamos la posición actual y la nueva posición
            this.clickAction(row, column);
        }
    };
    Map.prototype.clickAction = function (row, column) {
        var newPosition = new Utils_1.Pair(row, column);
        var side = this.turn % 2 == 0; // Representa el bando del jugador actual
        var unitIndex = Utils_1.myIndexOf(Store_1.store.getState().units.map(function (x) { return x.position; }), newPosition); // Obtenemos la posición de la unidad donde ha realizado click o -1.
        var unitEnemy; //Vale true si la unidad seleccionada es enemiga de las unidades del turno actual
        unitIndex != -1 ? // Si se ha seleccionado una unidad
            side ? // Si el turno es del "aliado"
                unitEnemy = !Store_1.store.getState().units[unitIndex].player // Asigna como enemigo el contrario de la unidad que ha hecho click
                : unitEnemy = Store_1.store.getState().units[unitIndex].player // Asigna como enemigo la unidad que ha hecho click
            : false; // En caso contrario, no hagas nada?
        //Si el indice es != -1 (está incluido en la lista de unidades) y está en modo de espera de movimiento se generará el estado de movimiento
        if ((unitIndex != -1 && !unitEnemy) // La unidad clickeada existe y es del jugador
            && Store_1.store.getState().type == "SET_LISTENER" // El tipo de estado es esperando selección
        ) {
            Store_1.saveState(GameState_1.Actions.generateMove(unitIndex, side));
            //Si hace clic en una possición exterior, mantiene el estado de en movimiento (seleccionado) y sigue almacenando la unidad seleccionada
        }
        else if (newPosition.column < 0 // La posición no es negativa en columnas
            || newPosition.column > this.props.horizontal // Ni es superior al número de celdas horizontales
            || newPosition.row < 0 // La posición no es negativa en filas
            || newPosition.row > this.props.vertical // Ni es superior al número de celdas verticales
        ) {
            Store_1.saveState(GameState_1.Actions.generateMove(Store_1.store.getState().selectedUnit, side));
            //En caso de que no esté incluida en la lista de unidades y esté en estado de movimiento
        }
        else if (
        // unitIndex!=-1 // La unidad existe
        Store_1.store.getState().selectedUnit != null // Se tiene seleccionada una unidad
            && Utils_1.myIndexOf(Store_1.store.getState().visitables, newPosition) != -1 // Y la posición de la unidad es alcanzable
        ) {
            var selectedUnit = Store_1.store.getState().selectedUnit; // Índice de la unidad seleccionada
            var actualPosition = Store_1.store.getState().units[selectedUnit].position; //Obtenemos la posición actual
            //Primero se comprueba si es un ataque (si selecciona a un enemigo durante el movimiento)
            if (unitIndex != -1 && unitEnemy) {
                // Debemos actualizar el id de la unidad seleccionada ahora
                if (Store_1.store.getState().selectedUnit > unitIndex) {
                    selectedUnit--; // Restamos uno, para mantener la consistencia de la lista.
                }
                Store_1.saveState(GameState_1.Actions.attack(unitIndex, side));
            }
            // Ejecutamos el movimiento
            // El valor de null es si se hace que justo tras el movimiento seleccione otra unidad, en este caso no es necesario así que se pondrá null
            Store_1.saveState(GameState_1.Actions.generateChangeUnitPos(selectedUnit, newPosition, null, side));
            //Si no está el general del jugador entonces se considerará victoria o derrota (esto ya incluye también que no queden más unidades)
            if (Store_1.store.getState().units.filter(function (x) { return !x.player && x.name == "General"; }).length == 0) {
                this.actualstate = 1;
                Store_1.saveState(GameState_1.Actions.finish());
            }
            else if (Store_1.store.getState().units.filter(function (x) { return x.player && x.name == "General"; }).length == 0) {
                this.actualstate = 2;
                Store_1.saveState(GameState_1.Actions.finish());
            }
            //Si son distintas se pasa de turno, sino se cancela el movimiento (se mantiene el turno)
            if (!actualPosition.equals(newPosition)) {
                this.turn++;
            }
        }
    };
    // Calcula si dado los datos del circulo y  un punto cualquiuera, el punto cualquiera está dentro del círculo
    Map.prototype.getInCircle = function (centerX, centerY, radius, x, y) {
        // Raiz cuadrada de la distancia vectorial entre el centro y el punto debe ser menor al radio
        return this.calculateDistance(centerX, centerY, x, y) < radius;
    };
    // Calcula la distancia vectorial entre dos puntos
    Map.prototype.calculateDistance = function (x0, y0, x1, y1) {
        return Math.sqrt(Math.pow((x0 - x1), 2) + Math.pow((y0 - y1), 2));
    };
    /** Función auxiliar usada para renderizar el mapa. Consiste en recorrer todas las columnas acumulando las casillas. **/
    Map.prototype.generateMap = function () {
        var accum = [];
        // Repetirá este for hasta que se llegue al número de columnas especificado
        for (var i = 0; i <= this.props.vertical * 2 + 1; i++) {
            // Este método retornará una lista con las casillas en fila
            accum.push(this.generateCellRow.bind(this)(i));
        }
        return accum;
    };
    /** Función auxiliar que servirá para generar las casillas en una fila **/
    Map.prototype.generateCellRow = function (num_row) {
        var accum2 = [];
        this.state.cells[num_row] = new Array(this.props.horizontal);
        // Este bucle iterará hasta el número de celdas horizontales especificado en el props.
        for (var j = num_row % 2 == 0 ? 0 : 1; j <= this.props.horizontal; j = j + 2) {
            var column = j;
            var row = num_row % 2 == 0 ? num_row / 2 : Math.floor(num_row / 2);
            var pos = new Utils_1.Pair(row, column);
            //Se generan las unidades
            var indexUnit = Utils_1.myIndexOf(Store_1.store.getState().units.map(function (x) { return x.position; }), pos);
            if (indexUnit != -1) {
                var cell = React.createElement(Cell_1.Cell, { row: row, column: column, unit: indexUnit });
                this.state.cells[row][column] = cell;
                accum2.push(cell);
            }
            else if (Store_1.store.getState().selectedUnit != null) {
                //Si la distancia es menor o igual a la distancia máxima entonces son posiciones validas y se seleccionaran, además se comprueba que no sea un obstáculo
                if (Utils_1.myIndexOf(Store_1.store.getState().visitables, pos) != -1) {
                    var cell = React.createElement(Cell_1.Cell, { row: row, column: column, selected: true }); // Si es num_row % 2, es una columna sin offset y indica nueva fila, ecc necesitamos el anterior.
                    this.state.cells[row][column] = cell;
                    //Para no añadir una nueva clase de celda seleccionada simplemente hacemos esto
                    accum2.push(cell);
                    //Es necesario hacer este else porque al entrar en este else if no podrá ejecutar el else exterior
                }
                else {
                    var cell = React.createElement(Cell_1.Cell, { row: row, column: column }); // Si es num_row % 2, es una columna sin offset y indica nueva fila, ecc necesitamos el anterior.
                    this.state.cells[row][column] = cell;
                    accum2.push(cell);
                }
            }
            else {
                // Se introducirá el elemento en una lista
                var cell = React.createElement(Cell_1.Cell, { row: row, column: column }); // Si es num_row % 2, es una columna sin offset y indica nueva fila, ecc necesitamos el anterior.
                this.state.cells[row][column] = cell;
                accum2.push(cell);
            }
        }
        // Se retorna en un div que dependiendo de que se trate de la fila par o impar, contendrá también la clase celRowOdd.
        return (React.createElement("div", { className: "cellRow" + (num_row % 2 == 0 ? "" : " cellRowOdd") }, accum2));
    };
    return Map;
}(React.Component));
exports.Map = Map;


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(process) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__createStore__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__combineReducers__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__bindActionCreators__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__applyMiddleware__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__compose__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils_warning__ = __webpack_require__(8);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "createStore", function() { return __WEBPACK_IMPORTED_MODULE_0__createStore__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "combineReducers", function() { return __WEBPACK_IMPORTED_MODULE_1__combineReducers__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "bindActionCreators", function() { return __WEBPACK_IMPORTED_MODULE_2__bindActionCreators__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "applyMiddleware", function() { return __WEBPACK_IMPORTED_MODULE_3__applyMiddleware__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "compose", function() { return __WEBPACK_IMPORTED_MODULE_4__compose__["a"]; });







/*
* This is a dummy function to check if the function name has been altered by minification.
* If the function has been minified and NODE_ENV !== 'production', warn the user.
*/
function isCrushed() {}

if (process.env.NODE_ENV !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
  Object(__WEBPACK_IMPORTED_MODULE_5__utils_warning__["a" /* default */])('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
}


/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(3)))

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Symbol_js__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__getRawTag_js__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__objectToString_js__ = __webpack_require__(21);




/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = __WEBPACK_IMPORTED_MODULE_0__Symbol_js__["a" /* default */] ? __WEBPACK_IMPORTED_MODULE_0__Symbol_js__["a" /* default */].toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? Object(__WEBPACK_IMPORTED_MODULE_1__getRawTag_js__["a" /* default */])(value)
    : Object(__WEBPACK_IMPORTED_MODULE_2__objectToString_js__["a" /* default */])(value);
}

/* harmony default export */ __webpack_exports__["a"] = (baseGetTag);


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__freeGlobal_js__ = __webpack_require__(19);


/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = __WEBPACK_IMPORTED_MODULE_0__freeGlobal_js__["a" /* default */] || freeSelf || Function('return this')();

/* harmony default export */ __webpack_exports__["a"] = (root);


/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/* harmony default export */ __webpack_exports__["a"] = (freeGlobal);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(7)))

/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Symbol_js__ = __webpack_require__(6);


/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = __WEBPACK_IMPORTED_MODULE_0__Symbol_js__["a" /* default */] ? __WEBPACK_IMPORTED_MODULE_0__Symbol_js__["a" /* default */].toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/* harmony default export */ __webpack_exports__["a"] = (getRawTag);


/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

/* harmony default export */ __webpack_exports__["a"] = (objectToString);


/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__overArg_js__ = __webpack_require__(23);


/** Built-in value references. */
var getPrototype = Object(__WEBPACK_IMPORTED_MODULE_0__overArg_js__["a" /* default */])(Object.getPrototypeOf, Object);

/* harmony default export */ __webpack_exports__["a"] = (getPrototype);


/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/* harmony default export */ __webpack_exports__["a"] = (overArg);


/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/* harmony default export */ __webpack_exports__["a"] = (isObjectLike);


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(26);


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, module) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ponyfill = __webpack_require__(28);

var _ponyfill2 = _interopRequireDefault(_ponyfill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var root; /* global window */


if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof global !== 'undefined') {
  root = global;
} else if (true) {
  root = module;
} else {
  root = Function('return this')();
}

var result = (0, _ponyfill2['default'])(root);
exports['default'] = result;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7), __webpack_require__(27)(module)))

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports['default'] = symbolObservablePonyfill;
function symbolObservablePonyfill(root) {
	var result;
	var _Symbol = root.Symbol;

	if (typeof _Symbol === 'function') {
		if (_Symbol.observable) {
			result = _Symbol.observable;
		} else {
			result = _Symbol('observable');
			_Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
};

/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/* harmony export (immutable) */ __webpack_exports__["a"] = combineReducers;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__createStore__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_es_isPlainObject__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_warning__ = __webpack_require__(8);




function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

  return 'Given action ' + actionName + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state. ' + 'If you want this reducer to hold no value, you can return null instead of undefined.';
}

function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
  var reducerKeys = Object.keys(reducers);
  var argumentName = action && action.type === __WEBPACK_IMPORTED_MODULE_0__createStore__["a" /* ActionTypes */].INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';

  if (reducerKeys.length === 0) {
    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
  }

  if (!Object(__WEBPACK_IMPORTED_MODULE_1_lodash_es_isPlainObject__["a" /* default */])(inputState)) {
    return 'The ' + argumentName + ' has unexpected type of "' + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
  }

  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
    return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
  });

  unexpectedKeys.forEach(function (key) {
    unexpectedKeyCache[key] = true;
  });

  if (unexpectedKeys.length > 0) {
    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
  }
}

function assertReducerShape(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, { type: __WEBPACK_IMPORTED_MODULE_0__createStore__["a" /* ActionTypes */].INIT });

    if (typeof initialState === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined. If you don\'t want to set a value for this reducer, ' + 'you can use null instead of undefined.');
    }

    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
    if (typeof reducer(undefined, { type: type }) === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + __WEBPACK_IMPORTED_MODULE_0__createStore__["a" /* ActionTypes */].INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined, but can be null.');
    }
  });
}

/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */
function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};
  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];

    if (process.env.NODE_ENV !== 'production') {
      if (typeof reducers[key] === 'undefined') {
        Object(__WEBPACK_IMPORTED_MODULE_2__utils_warning__["a" /* default */])('No reducer provided for key "' + key + '"');
      }
    }

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }
  var finalReducerKeys = Object.keys(finalReducers);

  var unexpectedKeyCache = void 0;
  if (process.env.NODE_ENV !== 'production') {
    unexpectedKeyCache = {};
  }

  var shapeAssertionError = void 0;
  try {
    assertReducerShape(finalReducers);
  } catch (e) {
    shapeAssertionError = e;
  }

  return function combination() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];

    if (shapeAssertionError) {
      throw shapeAssertionError;
    }

    if (process.env.NODE_ENV !== 'production') {
      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);
      if (warningMessage) {
        Object(__WEBPACK_IMPORTED_MODULE_2__utils_warning__["a" /* default */])(warningMessage);
      }
    }

    var hasChanged = false;
    var nextState = {};
    for (var _i = 0; _i < finalReducerKeys.length; _i++) {
      var _key = finalReducerKeys[_i];
      var reducer = finalReducers[_key];
      var previousStateForKey = state[_key];
      var nextStateForKey = reducer(previousStateForKey, action);
      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(_key, action);
        throw new Error(errorMessage);
      }
      nextState[_key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    return hasChanged ? nextState : state;
  };
}
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(3)))

/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = bindActionCreators;
function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(undefined, arguments));
  };
}

/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass a single function as the first argument,
 * and get a function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */
function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
  }

  var keys = Object.keys(actionCreators);
  var boundActionCreators = {};
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var actionCreator = actionCreators[key];
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }
  return boundActionCreators;
}

/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = applyMiddleware;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__compose__ = __webpack_require__(9);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };



/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */
function applyMiddleware() {
  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function (reducer, preloadedState, enhancer) {
      var store = createStore(reducer, preloadedState, enhancer);
      var _dispatch = store.dispatch;
      var chain = [];

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch(action) {
          return _dispatch(action);
        }
      };
      chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = __WEBPACK_IMPORTED_MODULE_0__compose__["a" /* default */].apply(undefined, chain)(store.dispatch);

      return _extends({}, store, {
        dispatch: _dispatch
      });
    };
  };
}

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Unit = /** @class */ (function () {
    function Unit(name, type, movement, position, player) {
        this.name = name;
        this.type = type;
        this.movement = movement;
        this.position = position;
        this.player = player;
    }
    return Unit;
}());
exports.Unit = Unit;
var Infantry = /** @class */ (function (_super) {
    __extends(Infantry, _super);
    function Infantry() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Infantry.create = function (position, player) {
        return new Unit("Infantry", "unit", 2, position, player);
    };
    return Infantry;
}(Unit));
exports.Infantry = Infantry;
var Tank = /** @class */ (function (_super) {
    __extends(Tank, _super);
    function Tank() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Tank.create = function (position, player) {
        return new Unit("Tank", "tank", 1, position, player);
    };
    return Tank;
}(Unit));
exports.Tank = Tank;
var General = /** @class */ (function (_super) {
    __extends(General, _super);
    function General() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    General.create = function (position, player) {
        return new Unit("General", "general", 0, position, player);
    };
    return General;
}(Unit));
exports.General = General;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
var Store_1 = __webpack_require__(2);
var TerrainCell_1 = __webpack_require__(34);
var UnitCell_1 = __webpack_require__(35);
var Utils_1 = __webpack_require__(1);
var Terrain = __webpack_require__(11);
/**
    Esta clase consiste en la representación de una casilla dentro del mapa
    @constructor Incluye los atributos HTML: horizontal y vertical.
**/
var Cell = /** @class */ (function (_super) {
    __extends(Cell, _super);
    /** Debe introducirse los atributos horizontal y vertical
        @param props debe contener horizontal y vertical**/
    function Cell(props) {
        var _this = _super.call(this, props) || this;
        var pair = new Utils_1.Pair(props.row, props.column);
        var indexTerrain = Utils_1.myIndexOf(Store_1.store.getState().terrains.map(function (x) { return x.position; }), pair);
        _this.state = {
            terrain: indexTerrain > -1 ? Store_1.store.getState().terrains[indexTerrain] : Terrain.Plains.create(new Utils_1.Pair(props.row, props.column)),
        };
        return _this;
    }
    /** Renderiza el objeto **/
    Cell.prototype.render = function () {
        // Comprobamos si una unidad está en esta posición
        var indexUnit = Utils_1.myIndexOf(Store_1.store.getState().units.map(function (x) { return x.position; }), this.state.terrain.position);
        var unit = indexUnit == -1 ? null : Store_1.store.getState().units[indexUnit];
        // Comprobamos si la casilla actual contiene el cursor, primero obteniendo su posición
        var positionCursor = Store_1.store.getState().cursorPosition;
        // Despues comprobando que esta casilla esté en esa posición
        var cursor = positionCursor.column == this.props.column && positionCursor.row == this.props.row;
        return (React.createElement("div", { className: "div_cell" },
            React.createElement("img", { className: "cell", id: "hex" + this.props.row + "_" + this.props.column, src: cursor ? this.props.selected ? "imgs/hex_base_numpad_selected.png" : "imgs/hex_base_numpad.png" : this.props.selected ? "imgs/hex_base_selected.png" : "imgs/hex_base.png" }),
            React.createElement(TerrainCell_1.TerrainCell, { terrain: this.state.terrain }),
            unit != null ? React.createElement(UnitCell_1.UnitCell, { unit: unit }) : ""));
    };
    return Cell;
}(React.Component));
exports.Cell = Cell;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
var TerrainCell = /** @class */ (function (_super) {
    __extends(TerrainCell, _super);
    function TerrainCell(props) {
        return _super.call(this, props) || this;
    }
    //Este es el render del obstacle
    TerrainCell.prototype.render = function () {
        return (React.createElement("div", { className: "obstacle" },
            React.createElement("img", { id: "obstacle" + this.props.terrain.position.getRow() + "_" + this.props.terrain.position.getColumn(), src: this.props.terrain.image })));
    };
    return TerrainCell;
}(React.Component));
exports.TerrainCell = TerrainCell;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
var UnitCell = /** @class */ (function (_super) {
    __extends(UnitCell, _super);
    function UnitCell(props) {
        return _super.call(this, props) || this;
    }
    UnitCell.prototype.render = function () {
        //Comprobamos si es enemiga o no para cambiar su sprite
        var enemy = !this.props.unit.player ? "enemy_" : "";
        // Le añadiremos el resultado de la comprobación anterior.
        return (React.createElement("div", { className: "unit" },
            React.createElement("img", { id: "unit" + this.props.unit.position.getRow() + "_" + this.props.unit.position.getColumn(), src: "imgs/" + enemy + this.props.unit.type + ".png" })));
    };
    return UnitCell;
}(React.Component));
exports.UnitCell = UnitCell;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map