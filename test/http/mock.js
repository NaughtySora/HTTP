"use strict";

const { SERIALIZERS, route } = require("../../lib/route/index.js");

const endpoints = {
  config: [async ({ cookie }) => {
    cookie.set("test", '42', { path: "/", maxAge: 420000, secure: true, sameSite: "Lax", httpOnly: true });
  }, async () => ({ variable1: "test", answer: 42, array: [1, 2, 3] })],
  'details-post': [async ({ params, data }) => {
    console.log(params);
    return data;
  }, async (data) => Object.assign(data, { postStamp: Date.now() })],
  'details-put': [async ({ params, data }) => {
    console.log(params);
    return data;
  }, async (data) => Object.assign(data, { putStamp: Date.now() })],
  'details-delete': [async ({ params, }) => {
    console.log(params);
  }, async () => Object.assign({ id: Math.random() })],
  'details-patch': [async ({ params, data }) => {
    console.log(params);
    return data;
  }, async (data) => Object.assign(data, { patched: true })],
};

const routes = [
  { method: "get", path: "/meta/config", callback: route(endpoints.config, SERIALIZERS.json) },
  { method: "post", path: "/details", callback: route(endpoints['details-post'], SERIALIZERS.json) },
  { method: "put", path: "/details", callback: route(endpoints['details-put'], SERIALIZERS.json) },
  { method: "delete", path: "/details", callback: route(endpoints['details-delete'], SERIALIZERS.json) },
  { method: "patch", path: "/details", callback: route(endpoints['details-patch'], SERIALIZERS.json) },
];

module.exports = { routes, endpoints };