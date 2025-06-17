'use strict';

const Queue = require("../../lib/Queue/Queue.js");
const http = require("../../lib/http/index.js");
const routes = require("./mock.js");

const queue = new Queue({ concurrency: 5, wait: 1000, timeout: 1000, });
const config = { port: 4999, routes, queue, debug: true };

module.exports = () => {
  const { start, stop } = http(config);
  start();
};