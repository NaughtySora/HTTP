"use strict";

function Cache() { }

Cache.prototype.get = function (key) {
  const data = this.storage.get(key);
  if (!data) return;
  return data[1];
}

Cache.prototype.timeout = function (ms) {
  this.ms = ms;
  return this;
}

Cache.prototype.limit = function (count) {
  this.max = count;
  return this;
}

const cache = ({ ms = Infinity, max = Infinity } = {}) => {
  const set = (key, value) => {
    const { max, ms, storage, keys } = set;
    let timer = null;
    if (max !== Infinity) {
      const space = max - storage.size;
      if (space < 1) {
        while (storage.size !== max - 1) {
          const key = keys.shift();
          let [timer] = storage.get(key);
          clearTimeout(timer);
          timer = null;
          storage.delete(key);
        }
      }
    }
    if (ms !== Infinity) {
      timer = setTimeout(() => {
        storage.delete(key);
        clearTimeout(timer);
        timer = null;
      }, ms);
    }
    keys.push(key);
    storage.set(key, [timer, value,]);
  };
  Object.setPrototypeOf(set, Cache.prototype);
  Object.assign(set, { storage: new Map(), keys: [], ms, max });
  return set;
};

module.exports = cache;
