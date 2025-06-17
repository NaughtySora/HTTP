"use strict";

const { http } = require("naughty-util");
const NetworkError = require("../NetworkError/index.js");

const validString = s => typeof s === "string" && s.length > 0;

class Cookie {
  #value;
  constructor(key, value, options) {
    if (!validString(key) || !validString(value)) {
      throw new NetworkError(
        "Attempt to set invalid cookie",
        { details: { key, value } },
      );
    }
    this.#value = `${key}=${value} Domain=${this.host}`;
    this.#build(options);
  }

  #build(options) {
    if (!options) return;
    const entries = Object.entries(options);
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const key = entry[0];
      if (!Cookie.parameters.includes(key)) continue;
      const value = entry[1];
      this[key](value);
    }
  }

  setHost(value) {
    if (this.#value.includes("Domain=")) return;
    this.#value = `${this.#value}; Domain=${value}`;
  }

  path(path) {
    this.#value = `${this.#value}; Path=${path}`;
  }

  secure(value) {
    if (!value) return;
    this.#value = `${this.#value}; Secure`;
  }

  httpOnly(value) {
    if (!value) return;
    this.#value = `${this.#value}; HttpOnly`;
  }

  sameSite(attribute) {
    this.#value = `${this.#value}; SameSite=${attribute}`;
  }

  maxAge(time) {
    this.#value = `${this.#value}; Max-Age=${time}`;
  }

  expires(date) {
    this.#value = `${this.#value}; Expires=${date}`;
  }

  domain(host) {
    this.#value = `${this.#value}; Domain=${host}`;
  }

  valueOf() {
    return this.#value;
  }

  static parameters = ["sameSite", "maxAge", "expires",
    "httpOnly", "secure", "path", "domain"];

  static delete(key) {
    return new Cookie(key, "delete", { expires: new Date(0), path: "/" });
  }
}

class Cookies {
  #collection = {};
  #cargo = [];
  #host;

  constructor(headers = {}) {
    this.#parseCookie(headers);
    this.#host = http.parseHost(headers.host);
  }

  #parseCookie(headers) {
    const { cookie } = headers;
    if (!cookie) return;
    this.#host = http.parseHost(headers.host);
    this.#collection = http.parseCookies(cookie);
  }

  set(key, value, options) {
    const cookie = new Cookie(key, value, options);
    cookie.setHost(this.#host);
    this.#cargo.push(cookie.valueOf());
  }

  get(key) {
    return this.#collection[key];
  }

  delete(key) {
    const cookie = Cookie.delete(key);
    cookie.setHost(this.#host);
    this.#cargo.push(cookie.valueOf());
  }

  has(key) {
    return Object.hasOwn(this.#collection, key);
  }

  send(response) {
    const cargo = this.#cargo;
    if (cargo.length === 0 || response.headersSent) return;
    response.setHeader("Set-Cookie", cargo);
  }
}

module.exports = Cookies;
