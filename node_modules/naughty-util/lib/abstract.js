"use strict";

const factorify = (dataset, nullable = null) => (key) => dataset[key] ?? nullable;
const factory = (Interface, ...params) => () => new Interface(...params);

module.exports = {
  factorify,
  factory,
};

