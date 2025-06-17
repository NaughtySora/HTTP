"use strict";

const Router = require("../../lib/Router/index.js");
const assert = require("node:assert");

module.exports = () => {
  const controller = async () => { };
  const handler = async () => "ok";

  const ok = [controller, handler];

  const options = [
    { method: "options", path: "/meta", callback: ok },
    { method: "get", path: "/user/:id", callback: ok },
    { method: "post", path: "/user/create//", callback: ok },
    { method: "post", path: "/user/me", callback: ok, },
    { method: "delete", path: "/project/:id", callback: ok },
    { method: "get", path: "/project/:id", callback: ok },
    { method: "post", path: "/project/create", callback: ok },
    { method: "get", path: "/project/list", callback: ok, },
    { method: "get", path: "/project/:id/category/:name", callback: ok, },
    { method: "post", path: "/project/:id/category/:name", callback: ok, },
    { method: "put", path: "/project/:id/category/:name", callback: ok, },
    { method: "put", path: "/project/update/:slug", callback: ok, },
  ];

  const router = new Router(options);

  const output = [
    router.find({ method: "post", path: "/user/me" }),
    router.find({ method: "get", path: "/project/123" }),
    router.find({ method: "put", path: "/project/123/category/test123" }),
    router.find({ method: "delete", path: "/project/slug-123" }),
    router.find({ method: "options", path: "/meta" }),
  ];

  for (const item of output) {
    if (!item) assert.strictEqual(item, ok);
    assert.strictEqual(item[0], controller);
    assert.strictEqual(item[1], handler);
  }
};
