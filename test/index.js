"use strict";

const http = require("./http/index.js");
const queue = require("./Queue/index.js");
const router = require("./Router/index.js");

const tests = [http];

for (const test of tests) test();
