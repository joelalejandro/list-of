/**
 * listof
 *
 * Copyright © 2016 Joel A. Villarreal Bertoldi. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { expect } from 'chai';
import ListOf from '../src/list-of';

const PersonFunction = function(name, age) {
  this.name = name;
  this.age = age;
};

const PersonClass = class {
  constructor(name, age, bloodType) {
    this.name = name;
    this.age = age;
    this.bloodType = bloodType;
  }
};

const buildListOfNumbers = () => new ListOf(Number).add([2, 10, 12, 20]);

const buildListOfNumbersWithRepetitions = () => new ListOf(Number).add([2, 10, 12, 20, 1, 20, 20, 0, 2]);

const buildList = () => {
  const list = new ListOf(PersonClass);
  list.add([
    new PersonClass('Joel', 27, '0+'),
    new PersonClass('Nicolás', 28, '0+'),
    new PersonClass('Andrea', 32, '0+'),
    new PersonClass('David', 27, '0+'),
    new PersonClass('Candela', 21, '0+')
  ]);
  return list;
};

const every = Array.prototype.every;
const some = Array.prototype.some;

const disableArrayEvery = () => {
  if (Array.prototype.every instanceof Function) {
    delete Array.prototype.every;
  }
};

const enableArrayEvery = () => {
  if (!Array.prototype.every) {
    Array.prototype.every = every;
  }
};

const disableArraySome = () => {
  if (Array.prototype.some instanceof Function) {
    delete Array.prototype.some;
  }
};

const enableArraySome = () => {
  if (!Array.prototype.some) {
    Array.prototype.some = some;
  }
};

describe('ListOf', () => {
  describe('#initialize', () => {
    it('should allow creating a list with primitive types', () => {
      [Number, String, Boolean].forEach((type) => {
        const list = new ListOf(type);
        expect(list.type).to.equal(type);
      });
    });
    it('should allow creating a list with a given object type (Function)', () => {
      const list = new ListOf(PersonFunction);
      expect(list.type).to.equal(PersonFunction);
    });
    it('should allow creating a list with a given object type (Class)', () => {
      const list = new ListOf(PersonClass);
      expect(list.type).to.equal(PersonClass);
    });
  });
  describe('#add', () => {
    it('should add primitives', () => {
      [{ type: Number, value: 42 },
       { type: String, value: 'ListItem' },
       { type: Boolean, value: true }].forEach(function(primitive) {
        const list = new ListOf(primitive.type);
        list.add(primitive.value);
        const added = list.toArray()[0];
        expect(added).to.equal(primitive.value);
        expect(added).to.be.a(primitive.type.name.toString());
      });
    });
    it('should add multiple primitives', () => {
      [{ type: Number, values: [42, Math.PI] },
       { type: String, values: ['ListItem', 'ListItem2'] },
       { type: Boolean, values: [true, false] }].forEach(function(primitive) {
        const list = new ListOf(primitive.type);
        list.add(primitive.values);
        const addedArray = list.toArray();
        addedArray.forEach((added, index) => {
          expect(added).to.equal(primitive.values[index]);
          expect(added).to.be.a(primitive.type.name.toString());
        });
      });
    });
    it('should add function-based objects', () => {
      const list = new ListOf(PersonFunction);
      const person = new PersonFunction('Joel', 27);
      list.add(person);
      const added = list.toArray()[0];
      expect(added).to.eql(person);
    });
    it('should add multiple function-based objects', () => {
      const list = new ListOf(PersonFunction);
      const person = new PersonFunction('Joel', 27);
      const person2 = new PersonFunction('Alejandro', 23);
      const persons = [person, person2];
      list.add(persons);
      const addedArray = list.toArray();
      addedArray.forEach((added, index) => {
        expect(added).to.eql(persons[index]);
      });
    });
    it('should add class-based objects', () => {
      const list = new ListOf(PersonClass);
      const person = new PersonClass('Joel', 27);
      list.add(person);
      const added = list.toArray()[0];
      expect(added).to.eql(person);
    });
    it('should add multiple class-based objects', () => {
      const list = new ListOf(PersonClass);
      const person = new PersonClass('Joel', 27);
      const person2 = new PersonClass('Alejandro', 23);
      const persons = [person, person2];
      list.add(persons);
      const addedArray = list.toArray();
      addedArray.forEach((added, index) => {
        expect(added).to.eql(persons[index]);
      });
    });
    it('should trigger before:add', (done) => {
      const list = new ListOf(PersonClass);
      const person = new PersonClass('Joel', 27);
      list.on('before:add', (item) => {
        expect(item).to.eql(person);
        done();
      });
      list.add(person);
    });
    it('should trigger add', (done) => {
      const list = new ListOf(PersonClass);
      const person = new PersonClass('Joel', 27);
      list.on('add', (item) => {
        expect(item).to.eql(person);
        done();
      });
      list.add(person);
    });
  });
  describe('#all', () => {
    describe('using every', () => {
      it('should check for a hash match in the list with a false condition using every', () => {
        const list = buildList();
        expect(list.all({ age: 27 })).to.be.false;
      });
      it('should check for a hash match in the list with a true condition using every', () => {
        const list = buildList();
        expect(list.all({ bloodType: '0+' })).to.be.true;
      });
      it('should check for a predicate match in the list with a false condition using every', () => {
        const list = buildList();
        expect(list.all(item => item.age === 27)).to.be.false;
      });
      it('should check for a predicate match in the list with a true condition using every', () => {
        const list = buildList();
        expect(list.all(item => item.bloodType === '0+')).to.be.true;
      });
    });
    describe('without using every', () => {
      before(disableArrayEvery);
      it('should check for a hash match in the list with a false condition without using every', () => {
        const list = buildList();
        expect(list.all({ age: 27 })).to.be.false;
      });
      it('should check for a hash match in the list with a true condition without using every', () => {
        const list = buildList();
        expect(list.all({ bloodType: '0+' })).to.be.true;
      });
      it('should check for a predicate match in the list with a false condition using every', () => {
        const list = buildList();
        expect(list.all(item => item.age === 27)).to.be.false;
      });
      it('should check for a predicate match in the list with a true condition using every', () => {
        const list = buildList();
        expect(list.all(item => item.bloodType === '0+')).to.be.true;
      });
    });
    after(enableArrayEvery);
  });
  describe('#any', () => {
    describe('using some', () => {
      it('should check for a hash match in the list with a true condition using some', () => {
        const list = buildList();
        expect(list.any({ age: 27 })).to.be.true;
      });
      it('should check for a hash match in the list with a false condition using some', () => {
        const list = buildList();
        expect(list.any({ bloodType: 'B+' })).to.be.false;
      });
      it('should check for a predicate match in the list with a true condition using some', () => {
        const list = buildList();
        expect(list.any(item => item.age === 27)).to.be.true;
      });
      it('should check for a predicate match in the list with a false condition using some', () => {
        const list = buildList();
        expect(list.any(item => item.bloodType === 'B+')).to.be.false;
      });
    });
    describe('without using some', () => {
      before(disableArraySome);
      it('should check for a hash match in the list with a true condition without using some', () => {
        const list = buildList();
        expect(list.any({ age: 27 })).to.be.true;
      });
      it('should check for a hash match in the list with a false condition without using some', () => {
        const list = buildList();
        expect(list.any({ bloodType: 'B+' })).to.be.false;
      });
      it('should check for a predicate match in the list with a true condition using some', () => {
        const list = buildList();
        expect(list.any(item => item.age === 27)).to.be.true;
      });
      it('should check for a predicate match in the list with a false condition using some', () => {
        const list = buildList();
        expect(list.any(item => item.bloodType === 'B+')).to.be.false;
      });
    });
    after(enableArraySome);
  });
  describe('#average', () => {
    it('should calculate the average of a list of primitive numbers', () => {
      const list = buildListOfNumbers();
      expect(list.average()).to.equal(11);
    });
    it('should calculate the average of a property in a list of objects', () => {
      const list = buildList();
      expect(list.average('age')).to.equal(27);
    });
  });
  describe('#sum', () => {
    it('should calculate the sum of a list of primitive numbers', () => {
      const list = buildListOfNumbers();
      expect(list.sum()).to.equal(44);
    });
    it('should calculate the sum of a property in a list of objects', () => {
      const list = buildList();
      expect(list.sum('age')).to.equal(135);
    });
  });
  describe('#clear', () => {
    it('should clear the list', () => {
      const list = buildList();
      expect(list.toArray().length).to.be.greaterThan.zero;
      list.clear();
      expect(list.toArray().length).to.be.zero;
    });
    it('should trigger before:clear', (done) => {
      const list = buildList();
      list.on('before:clear', () => { done(); })
      list.clear();
    });
    it('should trigger clear', (done) => {
      const list = buildList();
      list.on('clear', () => { done(); })
      list.clear();
    });
  });
  describe('#contains', () => {
    describe('using some', () => {
      it('should check for a hash match in the list with a true condition using some', () => {
        const list = buildList();
        expect(list.contains({ age: 27 })).to.be.true;
      });
      it('should check for a hash match in the list with a false condition using some', () => {
        const list = buildList();
        expect(list.contains({ bloodType: 'B+' })).to.be.false;
      });
      it('should check for a predicate match in the list with a true condition using some', () => {
        const list = buildList();
        expect(list.contains(item => item.age === 27)).to.be.true;
      });
      it('should check for a predicate match in the list with a false condition using some', () => {
        const list = buildList();
        expect(list.contains(item => item.bloodType === 'B+')).to.be.false;
      });
    });
    describe('without using some', () => {
      before(disableArraySome);
      it('should check for a hash match in the list with a true condition without using some', () => {
        const list = buildList();
        expect(list.contains({ age: 27 })).to.be.true;
      });
      it('should check for a hash match in the list with a false condition without using some', () => {
        const list = buildList();
        expect(list.contains({ bloodType: 'B+' })).to.be.false;
      });
      it('should check for a predicate match in the list with a true condition using some', () => {
        const list = buildList();
        expect(list.contains(item => item.age === 27)).to.be.true;
      });
      it('should check for a predicate match in the list with a false condition using some', () => {
        const list = buildList();
        expect(list.contains(item => item.bloodType === 'B+')).to.be.false;
      });
    });
    after(enableArraySome);
  });
  describe('#count', () => {
    it('should count the items in a primitive list', () => {
      expect(buildListOfNumbers().count()).to.equal(4);
    });
    it('should count the items in a list of objects', () => {
      expect(buildList().count()).to.equal(5);
    });
    it('should count zero on an empty list', () => {
      expect(new ListOf(Number).count()).to.be.zero;
    });
    it('should count the items in a primitive list that match a constant condition', () => {
      const list = buildListOfNumbersWithRepetitions();
      expect(list.count(2)).to.equal(2);
      expect(list.count(20)).to.equal(3);
    });
    it('should count the items in a primitive list that match a predicate condition', () => {
      const list = buildListOfNumbersWithRepetitions();
      expect(list.count((item) => item % 2 === 0)).to.equal(8);
      expect(list.count((item) => item % 2 !== 0)).to.equal(1);
    });
    it('should count the items in a list of objects that match a predicate condition', () => {
      const list = buildList();
      expect(list.count({ age: 27 })).to.equal(2);
      expect(list.count({ age: 32 })).to.equal(1);
    });
  });
  describe('#elementAt', () => {
    it('should get an item by its index in a primitive list', () => {
      expect(buildListOfNumbers().elementAt(0)).to.equal(2);
    });
    it('should get an item by its index in a list of objects', () => {
      expect(buildList().elementAt(0)).to.eql(new PersonClass('Joel', 27, '0+'));
    });
  });
  describe('#except', () => {
    if('should exclude an item in a primitive list', () => {
      expect(buildListOfNumbers().except(2).elementAt(0)).to.not.equal(2);
    });
  });
});
