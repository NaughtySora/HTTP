'use strict';

const RoundRobinQueue = require("../../lib/Queue/RoundRobinQueue.js");
const routes = require("./mock.js");
const http = require("../../lib/http/index.js");

const categorize = () => Math.floor((Math.random() * 2)) + 1;
const queue = new RoundRobinQueue({
  concurrency: 5,
  wait: 1000,
  timeout: 1000,
  categorize,
});

const config = { port: 4999, routes, queue, debug: true };

module.exports = () => {
  const { start, stop } = http(config);
  start();
};