"use strict";

const { stream, http } = require("naughty-util");
const { routes } = require("./mock.js");

const headers = {
  "Content-Type": 'application/json',
};

const body = () => JSON.stringify({ digit: Math.random(), data: new Date() });

module.exports = (config) => () => {
  for (const { method, path } of routes) {
    const mutable = method !== "get";
    const slug = http.createParams({ address: "0x0", test: 42 });
    const cargo = mutable ? body() : null;
    fetch(`http://localhost:${config.port}${path}${slug}`, {
      body: cargo,
      method: method.toUpperCase(),
      headers: mutable ? headers : {},
    }).then(res => {
      stream.read(res.body).then((buffer) => console.log(buffer.toString()));
    }, console.error)
      .catch(console.error);
  }
};
