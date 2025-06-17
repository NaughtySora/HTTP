"use strict";

const AbstractQueue = require("./AbstractQueue.js");
const Queue = require("./Queue.js");
const RoundRobinQueue = require("./RoundRobinQueue.js");

module.exports = Object.freeze({
  Queue,
  AbstractQueue,
  RoundRobinQueue,
});
