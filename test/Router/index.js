"use strict";

const router = require("./Router.js");

const tests = [router,];

module.exports = () => {
  for (const test of tests) test();
};
