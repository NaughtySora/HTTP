"use strict";

const PERCENT_BASE = 100;

const safe = (input) => {
  const value = parseFloat(input);
  return Number.isFinite(value) ? value : 0.0;
};

const isSafe = (input) => {
  const value = parseFloat(input);
  return Number.isFinite(value);
};

const positiveInt = (value) => Number.isInteger(value) && value >= 0;

const cutFraction = (value) => Math.floor(value * PERCENT_BASE) / PERCENT_BASE;

const total = (dataset) => {
  let result = 0;
  for (const value of dataset) result += value;
  return result;
};

const average = (dataset) => total(dataset) / dataset.length;

const percentRatio = (amount, part) => {
  const percents = PERCENT_BASE / (amount / part);
  return Number.isFinite(percents) ? percents : 0;
};

const percentOf = (base, percent) => {
  const percents = (base / PERCENT_BASE) * percent;
  return Number.isFinite(percents) ? percents : 0;
};

module.exports = {
  safe,
  positiveInt,
  cutFraction,
  average,
  total,
  isSafe,
  percentOf,
  percentRatio,
};
