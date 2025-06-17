'use strict';

const http = require("../../lib/http/index.js");
const routes = require("./mock.js");

const config = { port: 4999, routes, };

module.exports = () => {
  const { start, stop } = http(config);
  start();
};