/**
 * ListOf - A JavaScript implementation of the C# List<T> object
 *
 * Copyright © 2016 Joel A. Villarreal Bertoldi. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

export default () => {
  let _array = [];
  const _asListOf = (type, values) => new ListOf(type).add(values);

  let _isPrimitive;

  return class ListOf {
    constructor(type) {
      this.type = type;
      _typeIsPrimitive = [Number, String, Boolean].indexOf(type) > -1;
      _typeIsObject = !_typeIsPrimitive && type.toString().toLowerCase().indexOf('function') === 0;
    }

    add(items) {
      const _add = (item) => {
        if (item instanceof type) {
          _array.push(item);
        } else {
          throw new Error(`ListOf#add: Item must be of type ${type.name}`);
        }
      }

      if (Array.isArray(items)) {
        for (let i = 0; i < items.length; i += 1) {
          _add(items[i]);
        }
        return this;
      }

      _add(items);
      return this;
    }

    all(what) {
      if (typeof what === 'object' && !Array.isArray(what)) {
        return _array.every ? _array.every(what) : this.find(what).length === _array.length;
      } else if (typeof what === 'function') {
        return _array.filter(what).length === _array.length;
      }
      throw new Error(`ListOf#all: parameter 'what' must be an Object or a function predicate`)
    }

    any(what) {
      if (typeof what === 'object' && !Array.isArray(what)) {
        return _array.some ? _array.some(what) : this.find(what).length === _array.length;
      } else if (typeof what === 'function') {
        return _array.filter(what).length === _array.length;
      }
      throw new Error(`ListOf#all: parameter 'what' must be an Object or a function predicate`)
    }

    average(what) {
      return this.sum(what) / _array.length;
    }

    sum(what) {
      let sum = 0;
      if (_typeIsObject && typeof what === 'string') {
        for (let i = 0; i < _array.length; i += 1) {
          sum += _array[i][what];
        }
      } else if (_typeIsPrimitive && this.type === Number) {
        for (let i = 0; i < _array.length; i += 1) {
          sum += _array[i];
        }
      }
      return sum;
    }

    clear() {
      _array = [];
      return this;
    }

    contains(item) {
      return this.any(item);
    }

    count(what) {
      return !what ? _array.length : this.find(what).count();
    }

    elementAt(index) {
      return _array[index];
    }

    except(what) {
      if (_typeIsObject && !Array.isArray(what)) {
        return _asListOf(_array.filter((item) => {
          let isValid = 1;
          let atLeastOneValid = 0;
          Object.keys(what).forEach((key) => {
            if (item[key] && Array.isArray(what[key])) {
              for (let i = 0; i < what[key].length; i += 1) {
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
        return _asListOf(_array.filter(what));
      }
      return _asListOf(_array.filter(item => item !== what));
    }

    exists(what) {
      return this.any(what);
    }

    findFirst(what) {
      const result = this.find(what);
      return result.length > 0 ? result[0] : null;
    }

    findLast(what) {
      const result = this.find(what)
    }

    first(what) {
      return !what ? _array[0] : this.findFirst(what);
    }

    last(what) {
      return !what ? _array[_array.length - 1] : this.findLast(what);
    }

    forEach(callback) {
      for (let i = 0; i < _array.length; i += 1) {
        callback.call(this, _array[i], i);
      }
    }

    indexOf(what) {
      if (_typeIsObject && !Array.isArray(what)) {
        for (let i = 0; i < _array.length; i += 1) {
          const item = _array[i];
          let isValid = 1;
          let atLeastOneValid = 0;
          if (item === null && what === null) {
            return i;
          } else if (what !== null) {
            continue;
          }
          Object.keys(what).forEach((key) => {
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
            return i;
          }
        }
      }
      return _array.indexOf(what);
    }

    indexesOf(what) {
      const indexes = [];
      if (_typeIsObject && !Array.isArray(what)) {
        for (let i = 0; i < _array.length; i += 1) {
          const item = _array[i];
          let isValid = 1;
          let atLeastOneValid = 0;
          if (item === null && what === null) {
            indexes.push(i);
            continue;
          } else if (what !== null) {
            continue;
          }
          Object.keys(what).forEach((key) => {
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
        }
      } else {
        for (let i = 0; i < _array.length; i += 1) {
          if (_array[i] === what) {
            indexes.push(i);
          }
        }
      }
      return indexes;
    }

    lastIndexOf(what) {
      return Math.max.apply(null, this.indexesOf(what));
    }

    insert(where, what) {
      if (where > _array.length) {
        throw new Error(`ListOf#insert: index out of range, 'where' must be <= ${_array.length}`);
      }
      if (what instanceof type) {
        _array.splice(0, where).concat([what]).concat(_array.splice(where - 1));
        return this;
      } else if (Array.isArray(what)) {
        _array.splice(0, where).concat(what).concat(_array.splice(where - 1));
        return this;
      }

      throw new Error(`ListOf#insert: Item must be of type ${type.name}`);
    }

    remove(item) {
      if (!_typeIsObject) {
        _array = _array.filter(arrayItem => arrayItem !== item);
      } else {
        _array = this.except(item);
      }
      return this;
    }

    removeAt(where) {
      return this.remove(this.elementAt(where));
    }

    removeRange(from, to) {
      const newArray = [];
      for (let x = from; x < _array.length; x < from + to; x += 1) {
        newArray.push(_array[x]);
      }
      _array = newArray;
      return this;
    }

    find(what) {
      if (_typeIsObject && !Array.isArray(what)) {
        return _asListOf(_array.filter((arrayItem) => {
          let isValid = 1;
          let atLeastOneValid = false;
          if (arrayItem === null) {
            return false;
          }
          Object.keys(what).forEach((key) => {
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
          return isValid;
        }));
      } else if (what instanceof Function) {
        return _asListOf(_array.filter(what));
      }

      return _asListOf(_array.filter(arrayItem => arrayItem === what));
    }

    toString() {
      return `ListOf<${type.name}>[${this.count()}]`;
    }

    valueOf() {
      return this.count();
    }

    toArray() {
      return _array;
    }

    take(amount) {
      return _asListOf(_array.slice(0, amount));
    }

    skip(amount) {
      return _asListOf(_array.slice(amount));
    }

    distinct(what) {
      const unique = [], auxiliary = [];
      if (_typeIsObject && typeof what === 'string') {
        for (let i = 0; i < _array.length; i += 1) {
          if (_array[i] === null) continue;
          if (auxiliary.indexOf(_array[i][what]) > -1) {
            continue;
          } else {
            auxiliary.push(_array[i][what]);
            unique.push(_array[i]);
          }
        }
      } else {
        for (let i = 0; i < _array.length; i += 1) {
          if (unique.indexOf(_array[i]) > -1) {
            continue;
          } else {
            unique.push(_array[i]);
          }
        }
      }
      return _asListOf(unique);
    }

    max(what) {
      if (_typeIsObject && typeof what === 'string') {
        return Math.max.apply(null, _array.map(arrayItem => arrayItem[what]));
      }
      return Math.max.apply(null, _array);
    }

    min(what) {
      if (_typeIsObject && typeof what === 'string') {
        return Math.min.apply(null, _array.map(arrayItem => arrayItem[what]));
      }
      return Math.min.apply(null, _array);
    }

    orderBy(what) {
      if (_typeIsObject && typeof what === 'string') {
        return _asListOf(_array.sort((x, y) => (x !== null && y !== null) ? (x[what] > y[what]) : false));
      }
    }

    orderByDescendent(what) {
      return _asListOf(this.orderBy(what).toArray().reverse());
    }

    reverse() {
      return _asListOf(_array.reverse());
    }
  }
};
