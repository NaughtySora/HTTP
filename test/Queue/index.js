"use strict";

const queue = require("./Queue.js");
const roundRobin = require("./RoundRobinQueue.js");

module.exports = () => {
  // queue();
  roundRobin();
};
