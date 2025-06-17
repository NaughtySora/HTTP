"use strict";

const { http } = require("naughty-util");

const CATEGORIES = {
  __proto__: null,
  dynamic: "dynamic",
  static: "static",
};

const REGEXP = {
  __proto__: null,
  path: /\/:\w+\/?/g,
  slash: /\/$/,
  slashes: /\/*$/,
};

class Router {
  #tree = new Map();

  constructor(options) {
    this.#categories(options);
  }

  find(options = {}) {
    const url = http.parseURL(options.path);
    if (!url) return null;
    const method = this.#normalizeMethod(options.method);
    const category = this.#tree.get(method);
    if (!category) return null;
    const path = this.#normalizePath(url.pathname);
    const staticLookUp = category.static.get(path);
    if (staticLookUp) return staticLookUp;
    for (const route of category.dynamic) {
      if (route[0].test(path)) return route[1];
    }
  }

  #normalizePath(path) {
    return this.#noTrillingSlash(path);
  }

  #normalizeMethod(method) {
    return method.toLowerCase();
  }

  #categories(routes) {
    const tree = this.#tree;
    for (const route of routes) {
      const category = this.#category(route.path);
      const method = this.#normalizeMethod(route.method);
      let path = this.#normalizePath(route.path);
      const callback = route.callback;
      const leaf = tree.get(method);
      if (category === CATEGORIES.dynamic) path = this.#toDynamic(path);
      if (!leaf) {
        const leaf = { static: new Map(), dynamic: new Map() };
        leaf[category].set(path, callback);
        tree.set(method, leaf);
      } else {
        leaf[category].set(path, callback);
      }
    }
  }

  #category(path) {
    return path.includes(":") ? CATEGORIES.dynamic : CATEGORIES.static;
  }

  #toDynamic(path) {
    const toRegExp = this.#toRegExp;
    const transformed = path.replace(REGEXP.path, "/[\\w\-]+/");
    const wasDynamic = transformed !== path;
    if (wasDynamic) return toRegExp(transformed.replace(REGEXP.slash, "\/?"));
    const endsWithSlash = path.endsWith("/");
    return toRegExp(endsWithSlash ? this.#noTrillingSlash(path) : `${path}\/?`);
  }

  #toRegExp(string) {
    return new RegExp(`^${string}$`);
  }

  #noTrillingSlash(string) {
    return string.replace(REGEXP.slashes, "") || "/";
  }
}

module.exports = Router;
