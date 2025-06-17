"use strict";

class NetworkError extends Error {
  constructor(message, { code, cause, details }) {
    super(message, { cause });
    this.code = code;
    this.details = details;
    this.name = NetworkError.name;
    this.time = new Date().toISOString();
  }

  toJSON() {
    const { cause, name, message, code } = this;
    const stack = this.stack.split("\n").map((line) => line.trim());
    return { cause, name, message, code, stack };
  }

  toString() {
    const { name, code, message } = this;
    const identity = `${name}: ${code ? `[${code}]` : ''}`;
    return `${identity} ${message}`;
  }
}

module.exports = NetworkError;
