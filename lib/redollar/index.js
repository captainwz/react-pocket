'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var getObjArr = function getObjArr(specifier) {

    if ((typeof specifier === 'undefined' ? 'undefined' : _typeof(specifier)) == 'object') {

        if (specifier.props && specifier.props.$self) {

            return [specifier.props.$self];
        } else {

            throw new Error('Failed to init the instance with the argument of this/object');
        }
    } else if (typeof specifier == 'string') {

        var arr = [];

        var search = function search(o) {

            if (o.className == specifier) {
                arr.push(o);
            }

            if (o.items && o.items.length) {
                o.items.forEach(function (item) {
                    search(item);
                });
            }
        };

        if (!global.$obj) {
            throw new Error('Prop building failed');
        }

        search(global.$obj);

        return arr;
    } else {

        throw new Error('Failed to init the instance with the argument of ' + (typeof specifier === 'undefined' ? 'undefined' : _typeof(specifier)));
    }
};

var $class = function () {
    function $class(specifier) {
        _classCallCheck(this, $class);

        this.objArr = getObjArr(specifier);
        this.length = this.objArr.length;
    }

    _createClass($class, [{
        key: 'setProp',
        value: function setProp(prop) {
            var _this = this;

            if ((typeof prop === 'undefined' ? 'undefined' : _typeof(prop)) != 'object') {
                throw new Error('Call setProp with wrong argument of type:' + (typeof prop === 'undefined' ? 'undefined' : _typeof(prop)));
            }

            Object.keys(prop).forEach(function (name) {

                _this.objArr.forEach(function (obj) {

                    obj.props[name] = prop[name];
                });
            });

            global.$obj.wrappedRef.setState(global.$obj);

            return this;
        }
    }, {
        key: 'getProp',
        value: function getProp(name) {

            if (!this.objArr || !this.objArr.length) {
                throw new Error('Can\'t get prop from an empty instance');
            }

            if (this.objArr.length > 1) {
                console.warn('There are more than one instances, only read the property from the first one');
            }

            if (this.objArr[0].ref) {

                if (typeof name == 'string') {

                    return this.objArr[0].ref.props[name];
                } else {

                    return this.objArr[0].ref.props;
                }
            } else if (this.objArr[0].props) {

                if (typeof name == 'string') {

                    return this.objArr[0].props[name];
                } else {

                    return this.objArr[0].props;
                }
            } else {

                throw new Error('Can\'t call getProp because failed to get props');
            }
        }
    }, {
        key: 'getState',
        value: function getState(name) {

            if (!this.objArr || !this.objArr.length) {
                throw new Error('Can\'t get prop from an empty instance');
            }

            if (this.objArr.length > 1) {
                console.warn('There are more than one instances, only read the property from the first one');
            }

            if (this.objArr[0].ref) {

                if (typeof name == 'string') {

                    return this.objArr[0].ref.state[name];
                } else {

                    return this.objArr[0].ref.state;
                }
            } else {

                throw new Error('Can\'t call getState because react instance reference is missing');
            }
        }
    }, {
        key: 'get',
        value: function get(num) {

            if (typeof num != 'number' || !/^\d$/.test(num)) {

                throw new Error('Call get with wrong argument of type:' + (typeof name === 'undefined' ? 'undefined' : _typeof(name)));
            }

            var obj = this.objArr[parseInt(num)];

            if (!obj) {

                throw new Error('Can\'t get the instance with the index: ' + num);
            }

            this.objArr = [obj];
            this.length = 1;

            return this;
        }

        /* Deprecated
        setState (state) {
             if (typeof prop != 'object') {
                throw new Error('Call setState with wrong argument of type:' + (typeof prop))
            }
             this.objArr.forEach(obj => {
                 if (!obj.ref) {
                     throw new Error('Can\'t call setSate because react instance reference is undefined');
                 } else {
                     obj.ref.setState(Object.assign(Object.create(null), state));
                 }
             })
             return this;
         }*/

    }]);

    return $class;
}();

var $func = function $func(specifier) {
    return new $class(specifier);
};

exports.default = $func;