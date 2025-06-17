"use strict";

const { SERIALIZERS, route } = require("../../lib/route/index.js");

const meta = {
  config: [async ({ cookie }) => { }, async (params) => { }],
};

const routes = [
  { method: "get", path: "/meta/config", callback: route(meta.config, SERIALIZERS.json) },
  { method: "post", path: "/ido/details", callback: route(meta.config, SERIALIZERS.json) },
  { method: "put", path: "/ido/details", callback: route(meta.config, SERIALIZERS.json) },
  { method: "delete", path: "/ido/details", callback: route(meta.config, SERIALIZERS.json) },
  { method: "patch", path: "/ido/details", callback: route(meta.config, SERIALIZERS.json) },
];

module.exports = routes;