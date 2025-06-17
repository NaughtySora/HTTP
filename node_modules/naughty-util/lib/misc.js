"use strict";
const array = require("./array")

const id = x => x;
const partial = (fn, ...params) => fn.bind(null, ...params);
const inRange = (value, min, max) => value >= min && value <= max;

const compose = (...fns) => (...args) => {
  if (!array.valid(fns)) return args;
  let result = fns[0](...args);
  for (let i = 1; i < fns.length; i++) result = fns[i](result);
  return result;
};

function* range(end, start = 0, step = 1) {
  for (let i = start; i <= end; i += step) {
    yield i;
  }
}

const projection = (meta, data) => {
  const result = {};
  for (const [key, name = key, fn] of meta) {
    if (!Object.hasOwn(data, key)) continue;
    const original = data[key];
    if (Array.isArray(name) && typeof original === "object") {
      if (!original) continue;
      Object.assign(result, fn ? fn(projection(name, original)) : projection(name, original));
    } else {
      result[name] = fn ? fn(original) : original;
    }
  }
  return result;
};

module.exports = {
  id,
  inRange,
  compose,
  projection,
  partial,
  range
};
