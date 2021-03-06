'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _Object$keys = _interopDefault(require('babel-runtime/core-js/object/keys'));
var _typeof = _interopDefault(require('babel-runtime/helpers/typeof'));
var _Object$getPrototypeOf = _interopDefault(require('babel-runtime/core-js/object/get-prototype-of'));
var _classCallCheck = _interopDefault(require('babel-runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('babel-runtime/helpers/createClass'));
var _possibleConstructorReturn = _interopDefault(require('babel-runtime/helpers/possibleConstructorReturn'));
var _inherits = _interopDefault(require('babel-runtime/helpers/inherits'));
var EventEmitter = _interopDefault(require('eventemitter3'));

var _asListOf = function _asListOf(type, values) {
  return new ListOf(type).add(values);
};

var ListOf = function (_EventEmitter) {
  _inherits(ListOf, _EventEmitter);

  function ListOf(type) {
    _classCallCheck(this, ListOf);

    var _this = _possibleConstructorReturn(this, (ListOf.__proto__ || _Object$getPrototypeOf(ListOf)).call(this));

    _this.type = type;

    _this.__array__ = [];
    _this.__typeIsPrimitive__ = [Number, String, Boolean].indexOf(type) > -1;
    _this.__typeIsObject__ = !_this.__typeIsPrimitive__ && type.toString().toLowerCase().indexOf('function') === 0;
    return _this;
  }

  _createClass(ListOf, [{
    key: 'add',
    value: function add(items) {
      var _this2 = this;

      this.emit('before:add', items);

      var _add = function _add(item) {
        if (_this2.__typeIsPrimitive__ && (typeof item === 'undefined' ? 'undefined' : _typeof(item)).toLowerCase() === _this2.type.name.toLowerCase() || _this2.__typeIsObject__ && item instanceof _this2.type) {
          _this2.__array__.push(item);
        } else {
          throw new Error('ListOf#add: Item must be of type ' + _this2.type.name);
        }
      };

      if (Array.isArray(items)) {
        for (var i = 0; i < items.length; i += 1) {
          _add(items[i]);
        }
        return this;
      }

      _add(items);

      this.emit('add', items);
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
      }

      if (typeof what === 'function') {
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
      }

      if (typeof what === 'function') {
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
          var value = this.__array__[i][what];
          sum += value instanceof Function ? value.bind(this.__array__[i])() : value;
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
      this.emit('before:clear');

      this.__array__ = [];

      this.emit('clear');

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
      if (what instanceof Function) {
        return _asListOf(this.type, this.__array__.filter(what));
      }

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
      return result.elementAt(0) || null;
    }
  }, {
    key: 'findLast',
    value: function findLast(what) {
      var result = this.find(what);
      return result.elementAt(result.count() - 1) || null;
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
      var _this3 = this;

      if (this.__typeIsObject__ && !Array.isArray(what)) {
        var _loop = function _loop(i) {
          var item = _this3.__array__[i];
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
      var _this4 = this;

      var indexes = [];
      if (this.__typeIsObject__ && !Array.isArray(what)) {
        var _loop2 = function _loop2(i) {
          var item = _this4.__array__[i];
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
      this.emit('before:insert', where, what);

      if (where > this.__array__.length) {
        throw new Error('ListOf#insert: index out of range, \'where\' must be <= ' + this.__array__.length);
      }

      if (what instanceof this.type) {
        this.__array__.splice(0, where).concat([what]).concat(this.__array__.splice(where - 1));
        this.emit('insert', where, what);
        return this;
      }

      if (Array.isArray(what)) {
        this.__array__.splice(0, where).concat(what).concat(this.__array__.splice(where - 1));
        this.emit('insert', where, what);
        return this;
      }

      throw new Error('ListOf#insert: Item must be of type ' + this.type.name);
    }
  }, {
    key: 'remove',
    value: function remove(item) {
      this.emit('before:remove', item);

      if (!this.__typeIsObject__) {
        this.__array__ = this.__array__.filter(function (arrayItem) {
          return arrayItem !== item;
        });
      } else {
        var index = this.__array__.indexOf(item);
        this.__array__ = this.__array__.slice(0, index).concat(this.__array__.slice(index + 1));
      }

      this.emit('remove', item);

      return this;
    }
  }, {
    key: 'removeAt',
    value: function removeAt(position) {
      return this.removeRange(position, 1);
    }
  }, {
    key: 'removeRange',
    value: function removeRange(from, count) {
      this.emit('before:removeRange', from, count);

      var newArray = [];
      for (var x = from; x < this.__array__.length && x < from + count; x += 1) {
        newArray.push(this.__array__[x]);
      }
      this.__array__ = newArray;

      this.emit('removeRange', from, count);

      return this;
    }
  }, {
    key: 'find',
    value: function find(what) {
      if (what instanceof Function) {
        return _asListOf(this.type, this.__array__.filter(what));
      }

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
}(EventEmitter);

exports.ListOf = ListOf;
//# sourceMappingURL=index.js.map