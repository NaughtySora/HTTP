"use strict";

const MILLISECOND_RATIO = 1000000n;
const toMilliseconds = (start, end) => `${(end - start) / MILLISECOND_RATIO}ms`;

module.exports = {
  toMilliseconds,
};
