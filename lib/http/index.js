"use strict";

const {
  stream,
  http,
  palette: { COLORS: { green, red, yellow }, dye }
} = require("naughty-util");
const { createServer } = require("node:http");
const { toMilliseconds } = require("../../utils/benchmark.js");
const Router = require("../Router/index.js");
const NetworkError = require("../NetworkError/index.js");
const Cookies = require("../Cookies/index.js");
const corsPolicy = require("../cors/index.js");

const { CODES } = http;

const HEADERS = {
  __proto__: null,
  json: { 'Content-Type': 'application/json' },
  text: { 'Content-Type': 'text/plain' },
};

module.exports = (params = {}) => {
  const { port, queue, options, debug = false, logger = console,
    urlMaxLength = Infinity, parsingTimeout = 2500, routes = [], } = params;
  let server = null;
  let stopping = false;
  const cors = corsPolicy(params.cors);
  const router = new Router(routes);
  const serializers = Object.assign({
    "application/json": async (readable) => {
      const buffer = await stream.read(readable);
      const json = buffer.toString();
      if (!json) return {};
      return JSON.parse(json);
    },
  }, params.serializers);

  const simple = async (req, res) => {
    try {
      cors(req, res);
      if (res.writableEnded) return CODES.ok;
      const route = { method: req.method, path: req.url };
      const callback = router.find(route);
      if (!callback) {
        throw new NetworkError(
          CODES[CODES.notFound],
          { code: CODES.notFound, details: route },
        );
      }
      const cookie = new Cookies(req.headers);
      const serialized = await serialize(req, cookie);
      const output = await callback(serialized);
      cookie.send(res);
      let code = CODES.ok;
      const data = output[0];
      if (data === undefined) {
        if (req.method === "POST") res.writeHead(code = CODES.created, output[1]);
        else res.writeHead(code = CODES.noContent, output[1]);
      } else res.writeHead(CODES.ok, output[1]);
      res.end(data);
      return code;
    } catch (error) {
      const { code, message } = error;
      if (!code) {
        res.writeHead(CODES.internalServerError, HEADERS.text);
        res.end(CODES[CODES.internalServerError]);
      } else {
        res.writeHead(code, HEADERS.text);
        res.end(message);
      }
      logger.error(error);
      return code ?? CODES.badRequest;
    }
  };

  const logable = async (req, res) => {
    const start = process.hrtime.bigint();
    const code = await simple(req, res);
    const end = process.hrtime.bigint();
    const { url, method, headers, socket } = req;
    const [, port] = headers.host.split(":");
    const { pathname: path, searchParams } = http.parseURL(url);
    const search = Object.fromEntries(searchParams);
    const ip = socket.remoteAddress;
    const log = Object.entries({
      [dye(yellow, "path: ")]: path,
      [dye(yellow, "port: ")]: port,
      [dye(yellow, "method: ")]: method,
      [dye(yellow, "search: ")]: JSON.stringify(search),
      [dye(yellow, "ip: ")]: ip,
      [dye(yellow, "code: ")]: dye(code >= 400 ? red : green, code),
      [dye(yellow, "time: ")]: toMilliseconds(start, end),
    }).map(entry => `${entry[0]}${entry[1]}`).join(" ");
    logger.log(log);
  };

  const line = listener => {
    queue.process(async ({ params }) => listener(...params));
    queue.on("error", ({ error, params }) => {
      const res = params[1];
      res.writeHead(CODES.requestTimeout, HEADERS.text);
      res.end(error.message);
      logger.error(error);
    });
    return async (req, res) => queue.enqueue(req, res);
  };

  const serialize = async (req, cookie) => {
    const { url, method, } = req;
    if (urlMaxLength !== Infinity && url.length > urlMaxLength) {
      throw new NetworkError(
        CODES[CODES.uriTooLong],
        { code: CODES.uriTooLong, details: { url, method } },
      );
    }
    const { searchParams: params } = http.parseURL(url);
    const headers = req.headers ?? {};
    let data = {};
    if (method !== "GET") {
      const contentType = headers["content-type"];
      if (!contentType) {
        throw new NetworkError(
          CODES[CODES.methodNotAllowed],
          { code: CODES.methodNotAllowed, details: { url, method } },
        );
      }
      const [type] = contentType.split(";");
      const serializer = serializers[type];
      if (!serializer) {
        throw new NetworkError(
          CODES[CODES.methodNotAllowed],
          { code: CODES.methodNotAllowed, details: { url, method, type } },
        );
      }
      const { promise, reject } = Promise.withResolvers();
      let timer = setTimeout(() => {
        reject(new NetworkError(
          CODES[CODES.requestTimeout],
          { code: CODES.requestTimeout, details: { url, method, type } },
        ));
        clearTimeout(timer);
        timer = null;
      }, parsingTimeout);
      data = await Promise.race([serializer(req), promise]);
      if (timer) (timer = null, void clearTimeout(timer));
    }
    return Object.freeze({ params, data, headers, cookie });
  };

  return Object.freeze({
    async start() {
      const mode = debug ? logable : simple;
      const listener = queue ? line(mode) : mode;
      server = createServer(options);
      server.on("request", listener);
      server.on("clientError", (error, socket) => {
        if (error.code === 'ECONNRESET' || !socket.writable) return;
        socket.end('HTTP/1.1 400 Bad Request');
        logger.error(error);
      });
      server.on("error", error => {
        if (error.code === 'EACCES') logger.error(error);
      });
      server.on("listening", () => {
        logger.log(`http server started on port: ${port}`);
      });
      server.listen(port);
    },
    async stop(ms = 15000) {
      if (!server) return;
      stopping = true;
      let timer = setTimeout(() => {
        clearTimeout(timer);
        timer = null;
        server.closeAllConnections();
        logger.info(`http server on port: ${port} was stopped ${ms}`);
      }, ms);
      const close = () => new Promise((resolve, reject) => {
        server.closeIdleConnections();
        server.close(error => error ? reject(error) : resolve());
      });
      try {
        await close();
        clearTimeout(timer);
        timer = null;
        logger.log(`http server on port: ${port} was stopped successfully`);
      } catch (error) {
        server.closeAllConnections();
        clearTimeout(timer);
        timer = null;
        logger.error(error);
      }
      server = null;
      stopping = false;
    },
    connect(socket) {
      if (!server) throw new NetworkError("Server hasn't started yet");
      socket.server = server;
      server.emit('connection', socket);
      socket.resume();
    },
  });
};
