'use strict';

const http = require("../../lib/http/index.js");
const routes = require("./mock.js");

const config = { port: 3001, routes, debug: true };

module.exports = () => {
  const { start, stop } = http(config);
  start();
};
