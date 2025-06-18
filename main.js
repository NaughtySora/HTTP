"use strict";

const http = require("./lib/http/index.js");
const queues = require("./lib/Queue/index.js");
const routing = require("./lib/route/index.js");

module.exports = Object.freeze(Object.assign({ http, routing }, queues));
