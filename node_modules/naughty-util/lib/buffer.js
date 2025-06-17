"use strict";
const { randomFill } = require("node:crypto");
const async = require("./async");

const random = (length = 1024) => async.thenable(randomFill, Buffer.allocUnsafe(length));

module.exports = {
  random,
};
