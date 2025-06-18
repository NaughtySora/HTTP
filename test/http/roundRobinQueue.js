'use strict';

const RoundRobinQueue = require("../../lib/Queue/RoundRobinQueue.js");
const { routes } = require("./mock.js");
const http = require("../../lib/http/index.js");
const test = require("./test.js");

const categorize = () => Math.floor((Math.random() * 2)) + 1;
const queue = new RoundRobinQueue({
  concurrency: 5,
  wait: 1000,
  timeout: 1000,
  categorize,
});

const config = { port: 5000, routes, queue, debug: true };

module.exports = () => {
  const { start } = http(config);
  start().then(test(config));
};