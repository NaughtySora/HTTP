"use strict";

const { array } = require("naughty-util");
const { codes, text } = require("../../utils/responses.js");
const NetworkError = require("../NetworkError/index.js");

const join = (object, name) => {
  const value = object[name];
  object[name] = array.valid(value) ? value.join(", ") : value;
};

const init = (options) => {
  const headers = {
    'X-Content-Type-Options': 'nosniff',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Max-Age': 3600000,
    'Access-Control-Allow-Headers': [
      'Content-Type',
      'Authorization',
      'Accept-Language',
      'Accept',
    ],
    ...options,
  };
  for (const name in options) {
    const value = headers[name];
    if (value === undefined) delete headers[name];
  }
  join(headers, 'Access-Control-Allow-Headers');
  return { headers, headerEntries: Object.entries(headers) };
};

module.exports = options => {
  const { headers, headerEntries, } = init(options);
  return (req, res) => {
    const { method } = req;
    if (method === 'OPTIONS') {
      res.writeHead(codes.ok, headers);
      return void res.end();
    }
    const methods = headers["Access-Control-Allow-Methods"];
    if (methods === "*" || methods.includes(method)) {
      for (const entry of headerEntries) {
        const name = entry[0];
        const value = entry[1];
        res.setHeader(name, value);
      }
      return;
    }
    res.setHeader("Allow", methods);
    throw new NetworkError(
      text(codes.methodNotAllowed),
      { code: codes.methodNotAllowed },
    );
  }
};
