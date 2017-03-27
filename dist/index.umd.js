(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('babel-runtime/core-js/object/keys'), require('babel-runtime/helpers/typeof'), require('babel-runtime/helpers/classCallCheck'), require('babel-runtime/helpers/createClass')) :
  typeof define === 'function' && define.amd ? define(['exports', 'babel-runtime/core-js/object/keys', 'babel-runtime/helpers/typeof', 'babel-runtime/helpers/classCallCheck', 'babel-runtime/helpers/createClass'], factory) :
  (factory((global.list-of = global.list-of || {}),global._Object$keys,global._typeof,global._classCallCheck,global._createClass));
}(this, function (exports,_Object$keys,_typeof,_classCallCheck,_createClass) { 'use strict';

  _Object$keys = 'default' in _Object$keys ? _Object$keys['default'] : _Object$keys;
  _typeof = 'default' in _typeof ? _typeof['default'] : _typeof;
  _classCallCheck = 'default' in _classCallCheck ? _classCallCheck['default'] : _classCallCheck;
  _createClass = 'default' in _createClass ? _createClass['default'] : _createClass;

  /**
   * ListOf - A JavaScript implementation of the C# List<T> object
   *
   * Copyright © 2016 Joel A. Villarreal Bertoldi. All rights reserved.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.txt file in the root directory of this source tree.
   */

  var _asListOf = function _asListOf(type, values) {
    return new ListOf(type).add(values);
  };

  var ListOf = function () {
    function ListOf(type) {
      _classCallCheck(this, ListOf);

      this.type = type;

      this.__array__ = [];
      this.__typeIsPrimitive__ = [Number, String, Boolean].indexOf(type) > -1;
      this.__typeIsObject__ = !this.__typeIsPrimitive__ && type.toString().toLowerCase().indexOf('function') === 0;
    }

    _createClass(ListOf, [{
      key: 'add',
      value: function add(items) {
        var _this = this;

        var _add = function _add(item) {
          if (_this.__typeIsPrimitive__ && (typeof item === 'undefined' ? 'undefined' : _typeof(item)).toLowerCase() === _this.type.name.toLowerCase() || _this.__typeIsObject__ && item instanceof _this.type) {
            _this.__array__.push(item);
          } else {
            throw new Error('ListOf#add: Item must be of type ' + _this.type.name);
          }
        };

        if (Array.isArray(items)) {
          for (var i = 0; i < items.length; i += 1) {
            _add(items[i]);
          }
          return this;
        }

        _add(items);
        return this;
      }
    }, {
      key: 'all',
      value: function all(what) {
        if ((typeof what === 'undefined' ? 'undefined' : _typeof(what)) === 'object' && !Array.isArray(what)) {
          return this.__array__.every ? this.__array__.every(function (item) {
            return _Object$keys(what).map(function (key) {
              return item[key] === what[key];
            }).reduce(function (a, b) {
              return a && b;
            });
          }) : this.find(what).count() === this.__array__.length;
        } else if (typeof what === 'function') {
          return this.__array__.every ? this.__array__.every(what) : this.__array__.filter(what).length === this.__array__.length;
        }
        throw new Error('ListOf#all: parameter \'what\' must be an Object or a function predicate');
      }
    }, {
      key: 'any',
      value: function any(what) {
        if ((typeof what === 'undefined' ? 'undefined' : _typeof(what)) === 'object' && !Array.isArray(what)) {
          return this.__array__.some ? this.__array__.some(function (item) {
            return _Object$keys(what).map(function (key) {
              return item[key] === what[key];
            }).reduce(function (a, b) {
              return a || b;
            });
          }) : (this.find(what).count() || Infinity) <= this.__array__.length;
        } else if (typeof what === 'function') {
          return this.__array__.some ? this.__array__.some(what) : (this.__array__.filter(what).length || Infinity) <= this.__array__.length;
        }
        throw new Error('ListOf#all: parameter \'what\' must be an Object or a function predicate');
      }
    }, {
      key: 'average',
      value: function average(what) {
        return this.sum(what) / this.__array__.length;
      }
    }, {
      key: 'sum',
      value: function sum(what) {
        var sum = 0;
        if (this.__typeIsObject__ && typeof what === 'string') {
          for (var i = 0; i < this.__array__.length; i += 1) {
            sum += this.__array__[i][what];
          }
        } else if (this.__typeIsPrimitive__ && this.type === Number) {
          for (var _i = 0; _i < this.__array__.length; _i += 1) {
            sum += this.__array__[_i];
          }
        }
        return sum;
      }
    }, {
      key: 'clear',
      value: function clear() {
        this.__array__ = [];
        return this;
      }
    }, {
      key: 'contains',
      value: function contains(item) {
        return this.any(item);
      }
    }, {
      key: 'count',
      value: function count(what) {
        return !what ? this.__array__.length : this.find(what).count();
      }
    }, {
      key: 'elementAt',
      value: function elementAt(index) {
        return this.__array__[index];
      }
    }, {
      key: 'except',
      value: function except(what) {
        if (this.__typeIsObject__ && !Array.isArray(what)) {
          return _asListOf(this.type, this.__array__.filter(function (item) {
            var isValid = 1;
            var atLeastOneValid = 0;
            _Object$keys(what).forEach(function (key) {
              if (item[key] && Array.isArray(what[key])) {
                for (var i = 0; i < what[key].length; i += 1) {
                  if (item[key] !== what[key][i]) {
                    atLeastOneValid = 1;
                    break;
                  }
                }
                isValid &= atLeastOneValid;
              } else if (item[key]) {
                isValid &= item[key] === what[key];
              }
            });
          }));
        } else if (what instanceof Function) {
          return _asListOf(this.type, this.__array__.filter(what));
        }
        return _asListOf(this.type, this.__array__.filter(function (item) {
          return item !== what;
        }));
      }
    }, {
      key: 'exists',
      value: function exists(what) {
        return this.any(what);
      }
    }, {
      key: 'findFirst',
      value: function findFirst(what) {
        var result = this.find(what);
        return result.length > 0 ? result[0] : null;
      }
    }, {
      key: 'findLast',
      value: function findLast(what) {
        var result = this.find(what);
      }
    }, {
      key: 'first',
      value: function first(what) {
        return !what ? this.__array__[0] : this.findFirst(what);
      }
    }, {
      key: 'last',
      value: function last(what) {
        return !what ? this.__array__[this.__array__.length - 1] : this.findLast(what);
      }
    }, {
      key: 'forEach',
      value: function forEach(callback) {
        for (var i = 0; i < this.__array__.length; i += 1) {
          callback.call(this, this.__array__[i], i);
        }
      }
    }, {
      key: 'indexOf',
      value: function indexOf(what) {
        var _this2 = this;

        if (this.__typeIsObject__ && !Array.isArray(what)) {
          var _loop = function _loop(i) {
            var item = _this2.__array__[i];
            var isValid = 1;
            var atLeastOneValid = 0;
            if (item === null && what === null) {
              return {
                v: i
              };
            } else if (what !== null) {
              return 'continue';
            }
            _Object$keys(what).forEach(function (key) {
              if (item[key]) {
                for (var j = 0; j < what[key].length; j += 1) {
                  if (item[key] === what[key][j]) {
                    atLeastOneValid = 1;
                    break;
                  }
                }
                isValid &= atLeastOneValid;
              } else {
                isValid &= item[key] === what[key];
              }
            });
            if (isValid) {
              return {
                v: i
              };
            }
          };

          for (var i = 0; i < this.__array__.length; i += 1) {
            var _ret = _loop(i);

            switch (_ret) {
              case 'continue':
                continue;

              default:
                if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
            }
          }
        }
        return this.__array__.indexOf(what);
      }
    }, {
      key: 'indexesOf',
      value: function indexesOf(what) {
        var _this3 = this;

        var indexes = [];
        if (this.__typeIsObject__ && !Array.isArray(what)) {
          var _loop2 = function _loop2(i) {
            var item = _this3.__array__[i];
            var isValid = 1;
            var atLeastOneValid = 0;
            if (item === null && what === null) {
              indexes.push(i);
              return 'continue';
            } else if (what !== null) {
              return 'continue';
            }
            _Object$keys(what).forEach(function (key) {
              if (item[key]) {
                for (var j = 0; j < what[key].length; j += 1) {
                  if (item[key] === what[key][j]) {
                    atLeastOneValid = 1;
                    break;
                  }
                }
                isValid &= atLeastOneValid;
              } else {
                isValid &= item[key] === what[key];
              }
            });
            if (isValid) {
              indexes.push(i);
            }
          };

          for (var i = 0; i < this.__array__.length; i += 1) {
            var _ret2 = _loop2(i);

            if (_ret2 === 'continue') continue;
          }
        } else {
          for (var i = 0; i < this.__array__.length; i += 1) {
            if (this.__array__[i] === what) {
              indexes.push(i);
            }
          }
        }
        return indexes;
      }
    }, {
      key: 'lastIndexOf',
      value: function lastIndexOf(what) {
        return Math.max.apply(null, this.indexesOf(what));
      }
    }, {
      key: 'insert',
      value: function insert(where, what) {
        if (where > this.__array__.length) {
          throw new Error('ListOf#insert: index out of range, \'where\' must be <= ' + this.__array__.length);
        }
        if (what instanceof this.type) {
          this.__array__.splice(0, where).concat([what]).concat(this.__array__.splice(where - 1));
          return this;
        } else if (Array.isArray(what)) {
          this.__array__.splice(0, where).concat(what).concat(this.__array__.splice(where - 1));
          return this;
        }

        throw new Error('ListOf#insert: Item must be of type ' + this.type.name);
      }
    }, {
      key: 'remove',
      value: function remove(item) {
        if (!this.__typeIsObject__) {
          this.__array__ = this.__array__.filter(function (arrayItem) {
            return arrayItem !== item;
          });
        } else {
          this.__array__ = this.except(item).toArray();
        }
        return this;
      }
    }, {
      key: 'removeAt',
      value: function removeAt(where) {
        return this.remove(this.elementAt(where));
      }
    }, {
      key: 'removeRange',
      value: function removeRange(from, to) {
        var newArray = [];
        for (var x = from; x < this.__array__.length && x < from + to; x += 1) {
          newArray.push(this.__array__[x]);
        }
        this.__array__ = newArray;
        return this;
      }
    }, {
      key: 'find',
      value: function find(what) {
        if (this.__typeIsObject__ && !Array.isArray(what)) {
          return _asListOf(this.type, this.__array__.filter(function (arrayItem) {
            var isValid = 1;
            var atLeastOneValid = 0;
            if (arrayItem === null) {
              return false;
            }
            _Object$keys(what).forEach(function (key) {
              if (arrayItem[key] && Array.isArray(arrayItem[key])) {
                for (var j = 0; j < what[key].length; j += 1) {
                  if (arrayItem[key] === what[key][j]) {
                    atLeastOneValid = 1;
                    break;
                  }
                }
                isValid &= atLeastOneValid;
              } else if (arrayItem[key]) {
                isValid &= arrayItem[key] === what[key];
              }
            });
            return isValid;
          }));
        } else if (what instanceof Function) {
          return _asListOf(this.type, this.__array__.filter(what));
        }

        return _asListOf(this.type, this.__array__.filter(function (arrayItem) {
          return arrayItem === what;
        }));
      }
    }, {
      key: 'toString',
      value: function toString() {
        return 'ListOf<' + this.type.name + '>[' + this.count() + ']';
      }
    }, {
      key: 'valueOf',
      value: function valueOf() {
        return this.count();
      }
    }, {
      key: 'toArray',
      value: function toArray() {
        return this.__array__;
      }
    }, {
      key: 'take',
      value: function take(amount) {
        return _asListOf(this.__array__.slice(0, amount));
      }
    }, {
      key: 'skip',
      value: function skip(amount) {
        return _asListOf(this.__array__.slice(amount));
      }
    }, {
      key: 'distinct',
      value: function distinct(what) {
        var unique = [],
            auxiliary = [];
        if (this.__typeIsObject__ && typeof what === 'string') {
          for (var i = 0; i < this.__array__.length; i += 1) {
            if (this.__array__[i] === null) continue;
            if (auxiliary.indexOf(this.__array__[i][what]) > -1) {
              continue;
            } else {
              auxiliary.push(this.__array__[i][what]);
              unique.push(this.__array__[i]);
            }
          }
        } else {
          for (var _i2 = 0; _i2 < this.__array__.length; _i2 += 1) {
            if (unique.indexOf(this.__array__[_i2]) > -1) {
              continue;
            } else {
              unique.push(this.__array__[_i2]);
            }
          }
        }
        return _asListOf(unique);
      }
    }, {
      key: 'max',
      value: function max(what) {
        if (this.__typeIsObject__ && typeof what === 'string') {
          return Math.max.apply(null, this.__array__.map(function (arrayItem) {
            return arrayItem[what];
          }));
        }
        return Math.max.apply(null, this.__array__);
      }
    }, {
      key: 'min',
      value: function min(what) {
        if (this.__typeIsObject__ && typeof what === 'string') {
          return Math.min.apply(null, this.__array__.map(function (arrayItem) {
            return arrayItem[what];
          }));
        }
        return Math.min.apply(null, this.__array__);
      }
    }, {
      key: 'orderBy',
      value: function orderBy(what) {
        if (this.__typeIsObject__ && typeof what === 'string') {
          return _asListOf(this.__array__.sort(function (x, y) {
            return x !== null && y !== null ? x[what] > y[what] : false;
          }));
        }
      }
    }, {
      key: 'orderByDescendent',
      value: function orderByDescendent(what) {
        return _asListOf(this.orderBy(what).toArray().reverse());
      }
    }, {
      key: 'reverse',
      value: function reverse() {
        return _asListOf(this.__array__.reverse());
      }
    }]);

    return ListOf;
  }();

  exports.ListOf = ListOf;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.umd.js.map