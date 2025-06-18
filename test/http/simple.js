'use strict';

const http = require("../../lib/http/index.js");
const { routes } = require("./mock.js");
const test = require("./test.js");

const config = { port: 4999, routes, };

module.exports = () => {
  const { start } = http(config);
  start().then(test(config));
};