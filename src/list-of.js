/**
 * ListOf - A JavaScript implementation of the C# List<T> object
 *
 * Copyright © 2016 Joel A. Villarreal Bertoldi. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

const _asListOf = (type, values) => new ListOf(type).add(values);

export default class ListOf {
  constructor(type) {
    this.type = type;

    this.__array__ = [];
    this.__typeIsPrimitive__ = [Number, String, Boolean].indexOf(type) > -1;
    this.__typeIsObject__ = !this.__typeIsPrimitive__
      && type.toString().toLowerCase().indexOf('function') === 0;
  }

  add(items) {
    const _add = (item) => {
      if ((this.__typeIsPrimitive__ && (typeof item).toLowerCase() === this.type.name.toLowerCase())
        || (this.__typeIsObject__ && item instanceof this.type)) {
        this.__array__.push(item);
      } else {
        throw new Error(`ListOf#add: Item must be of type ${this.type.name}`);
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
      return this.__array__.every ? this.__array__.every(
        item => Object.keys(what).map(key => item[key] === what[key]).reduce((a, b) => a && b)
      ) : this.find(what).count() === this.__array__.length;
    } else if (typeof what === 'function') {
      return this.__array__.every ? this.__array__.every(what) : this.__array__.filter(what).length === this.__array__.length;
    }
    throw new Error(`ListOf#all: parameter 'what' must be an Object or a function predicate`)
  }

  any(what) {
    if (typeof what === 'object' && !Array.isArray(what)) {
      return this.__array__.some ? this.__array__.some(
        item => Object.keys(what).map(key => item[key] === what[key]).reduce((a, b) => a || b)
      ) : (this.find(what).count() || Infinity) <= this.__array__.length;
    } else if (typeof what === 'function') {
      return this.__array__.some ? this.__array__.some(what) : (this.__array__.filter(what).length || Infinity) <= this.__array__.length;
    }
    throw new Error(`ListOf#all: parameter 'what' must be an Object or a function predicate`)
  }

  average(what) {
    return this.sum(what) / this.__array__.length;
  }

  sum(what) {
    let sum = 0;
    if (this.__typeIsObject__ && typeof what === 'string') {
      for (let i = 0; i < this.__array__.length; i += 1) {
        const value = this.__array__[i][what];
        sum += value instanceof Function ? value() : value;
      }
    } else if (this.__typeIsPrimitive__ && this.type === Number) {
      for (let i = 0; i < this.__array__.length; i += 1) {
        sum += this.__array__[i];
      }
    }
    return sum;
  }

  clear() {
    this.__array__ = [];
    return this;
  }

  contains(item) {
    return this.any(item);
  }

  count(what) {
    return !what ? this.__array__.length : this.find(what).count();
  }

  elementAt(index) {
    return this.__array__[index];
  }

  except(what) {
    if (this.__typeIsObject__ && !Array.isArray(what)) {
      return _asListOf(this.type, this.__array__.filter((item) => {
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
      return _asListOf(this.type, this.__array__.filter(what));
    }
    return _asListOf(this.type, this.__array__.filter(item => item !== what));
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
    return !what ? this.__array__[0] : this.findFirst(what);
  }

  last(what) {
    return !what ? this.__array__[this.__array__.length - 1] : this.findLast(what);
  }

  forEach(callback) {
    for (let i = 0; i < this.__array__.length; i += 1) {
      callback.call(this, this.__array__[i], i);
    }
  }

  indexOf(what) {
    if (this.__typeIsObject__ && !Array.isArray(what)) {
      for (let i = 0; i < this.__array__.length; i += 1) {
        const item = this.__array__[i];
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
    return this.__array__.indexOf(what);
  }

  indexesOf(what) {
    const indexes = [];
    if (this.__typeIsObject__ && !Array.isArray(what)) {
      for (let i = 0; i < this.__array__.length; i += 1) {
        const item = this.__array__[i];
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
      for (let i = 0; i < this.__array__.length; i += 1) {
        if (this.__array__[i] === what) {
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
    if (where > this.__array__.length) {
      throw new Error(`ListOf#insert: index out of range, 'where' must be <= ${this.__array__.length}`);
    }
    if (what instanceof this.type) {
      this.__array__.splice(0, where).concat([what]).concat(this.__array__.splice(where - 1));
      return this;
    } else if (Array.isArray(what)) {
      this.__array__.splice(0, where).concat(what).concat(this.__array__.splice(where - 1));
      return this;
    }

    throw new Error(`ListOf#insert: Item must be of type ${this.type.name}`);
  }

  remove(item) {
    if (!this.__typeIsObject__) {
      this.__array__ = this.__array__.filter(arrayItem => arrayItem !== item);
    } else {
      const removables = this.find(item).toArray();
      this.__array__ = this.__array__.filter(arrayItem => !(removables.indexOf(arrayItem) > -1));
    }
    return this;
  }

  removeAt(position) {
    return this.removeRange(position, 1);
  }

  removeRange(from, count) {
    const newArray = [];
    for (let x = from; x < this.__array__.length && x < from + count; x += 1) {
      newArray.push(this.__array__[x]);
    }
    this.__array__ = newArray;
    return this;
  }

  find(what) {
    if (this.__typeIsObject__ && !Array.isArray(what)) {
      return _asListOf(this.type, this.__array__.filter((arrayItem) => {
        let isValid = 1;
        let atLeastOneValid = 0;
        if (arrayItem === null) {
          return false;
        }
        Object.keys(what).forEach((key) => {
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

    return _asListOf(this.type, this.__array__.filter(arrayItem => arrayItem === what));
  }

  toString() {
    return `ListOf<${this.type.name}>[${this.count()}]`;
  }

  valueOf() {
    return this.count();
  }

  toArray() {
    return this.__array__;
  }

  take(amount) {
    return _asListOf(this.__array__.slice(0, amount));
  }

  skip(amount) {
    return _asListOf(this.__array__.slice(amount));
  }

  distinct(what) {
    const unique = [], auxiliary = [];
    if (this.__typeIsObject__ && typeof what === 'string') {
      for (let i = 0; i < this.__array__.length; i += 1) {
        if (this.__array__[i] === null) continue;
        if (auxiliary.indexOf(this.__array__[i][what]) > -1) {
          continue;
        } else {
          auxiliary.push(this.__array__[i][what]);
          unique.push(this.__array__[i]);
        }
      }
    } else {
      for (let i = 0; i < this.__array__.length; i += 1) {
        if (unique.indexOf(this.__array__[i]) > -1) {
          continue;
        } else {
          unique.push(this.__array__[i]);
        }
      }
    }
    return _asListOf(unique);
  }

  max(what) {
    if (this.__typeIsObject__ && typeof what === 'string') {
      return Math.max.apply(null, this.__array__.map(arrayItem => arrayItem[what]));
    }
    return Math.max.apply(null, this.__array__);
  }

  min(what) {
    if (this.__typeIsObject__ && typeof what === 'string') {
      return Math.min.apply(null, this.__array__.map(arrayItem => arrayItem[what]));
    }
    return Math.min.apply(null, this.__array__);
  }

  orderBy(what) {
    if (this.__typeIsObject__ && typeof what === 'string') {
      return _asListOf(this.__array__.sort((x, y) => (x !== null && y !== null) ? (x[what] > y[what]) : false));
    }
  }

  orderByDescendent(what) {
    return _asListOf(this.orderBy(what).toArray().reverse());
  }

  reverse() {
    return _asListOf(this.__array__.reverse());
  }
}
