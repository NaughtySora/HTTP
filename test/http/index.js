"use strict";

const simple = require("./simple.js");
const debug = require("./debug.js");
const queue = require("./queue.js");
const roundRobinQueue = require("./roundRobinQueue.js");

const tests = [simple, debug, queue, roundRobinQueue];

module.exports = () => {
  for (const test of tests) test();
};
