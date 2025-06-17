"use strict";

const { async } = require("naughty-util");

const HEADERS = {
  __proto__: null,
  json: { 'Content-Type': 'application/json' },
  text: { 'Content-Type': 'text/plain' },
};

const SERIALIZERS = {
  __proto__: null,
  async json(data) {
    return [JSON.stringify(data), HEADERS.json];
  },
};

const route = (module, serializer) => async.compose(...module, serializer);

module.exports = { route, SERIALIZERS };