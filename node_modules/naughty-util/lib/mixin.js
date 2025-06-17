"use strict";

const weakAssign = (target, mixin) => {
  const keys = Object.keys(mixin);
  for (const key of keys) {
    if (typeof target[key] !== "undefined") continue;
    target[key] = mixin[key];
  }
  return target;
};

const forget = (target, keys) => {
  for(const key of keys) delete target[key];
  return target;
};

module.exports = {
  weakAssign,
  forget,
};
