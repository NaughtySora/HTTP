'use strict';

const { STATUS_CODES } = require("node:http");

const CODES = Object.freeze({
  __proto__: null,
  ok: 200,
  created: 201,
  noContent: 204,
  badRequest: 400,
  notFound: 404,
  methodNotAllowed: 405,
  Timeout: 408,
  URIToLong: 414,
  MediaTypeNotSupported: 415,
  UnprocessableContent: 422,
  InternalServerError: 500,
});

const text = code => {
  const status = STATUS_CODES[code];
  if (!status) throw new Error(`Invalid status code ${code}`);
  return status;
};

module.exports = Object.freeze({ codes: CODES, text });