"use strict";

const valid = data => Array.isArray(data) && !!data.length;

const defineField = (entity, key, index) => {
  Object.defineProperty(entity, key, {
    get() {
      return this[index];
    },
    set(value) {
      this[index] = value;
    },
  });
};

const accessor = (array, meta) => {
  const entries = Object.entries(meta);
  const symbols = Object.getOwnPropertySymbols(meta);
  function Accessor() { }
  for (const [key, index] of entries) {
    defineField(Accessor.prototype, key, index);
  }
  for (const symbol of symbols) {
    defineField(Accessor.prototype, symbol, meta[symbol]);
  }
  Object.setPrototypeOf(array, Accessor.prototype);
  return array;
};

module.exports = {
  valid,
  accessor,
};
