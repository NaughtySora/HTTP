'use strict';

const dye = (color, text) => `${color}${text}${CLEAN}`;

const CLEAN = "\x1b[0m";

const COLORS = Object.freeze({
  __proto__: null,
  yellow: "\x1b[1;33m",
  red: "\x1b[1;31m",
  white: "\x1b[1;37m",
  blue: '\x1b[1;34m',
  green: '\x1b[1;32m',
});

module.exports = Object.freeze({
  colors: COLORS,
  clean: CLEAN,
  dye,
});
