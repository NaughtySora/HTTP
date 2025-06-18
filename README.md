# HTTP Server i currently use.

## If you find a bug or you have any suggestions about the server, please open an issue.

# Short description

## Server
- Http server with builtin cors, easy routing, cookies and so on.
- Server provides way to use queues with distinct interface.
- Server doesn't give your client code request and response pointers, you should operate only with prepared and injected data in your client code.
- Debug mode will log every request information.
- You can pass Nodejs http server options as well.
- Server uses custom NetWork Error class for better debugging and logging.
- You can customize serializators for the server with appropriate option.
- Server has ability to gainfully shutdown.
- Server has ability to connect TCP socket to in when you implementing balancing yourself.

## Queue
- Abstract queue just an interface for custom queues for the server.
- Queue a simple async queue with wait timeout and process timeout.
- RoundRobinQueue inherits async queue and has additionally round robin for tasks by a specific factor.

## routing
- Just for example how you can make endpoints for the server.

# Types

### Queue
- `class AbstractQueue extends EventEmitter {`
  `constructor();`
  `enqueue(...params: any[]): void;`
  `process(callback: ProcessCallback): this;`
`}`

- `class Queue extends AbstractQueue {`
  `constructor(options: QueueOptions);`
  `enqueue(...params: any[]): void;`
  `process(callback: ProcessCallback): this;`
`}`

- `class RoundRobinQueue extends Queue {`
  `constructor(options: RoundRobinQueueOptions);`
  `enqueue(...params: any[]): void;`
 `process(callback: ProcessCallback): this;`
`}`

### Routing
- `interface Routing {`
  `route: RouteComposition;`
  `SERIALIZERS: Record<string, (...params: any[]) => UtilsAsync["compose"]>;`
`}`

  `routing: Routing;`

### Server
- `interface HTTPOptions {`
`  port: number;`
`  routes: Array<ReturnType<RouteComposition>>;`
`  queue?: InstanceType<typeof AbstractQueue>;`
`  options?: ServerOptions;`
`  debug?: boolean;`
`  logger?: Partial<Console> & { log: Log; error: Log; info: Log };`
`  urlMaxLength?: number;`
`  parsingTimeout?: number;`
`}`

- `http: (options: HTTPOptions) => HTTPServer;`

## Example

### Server with queue, debug mode

```js
const config = [
  async ({ cookie }) => {
    const options = { path: "/", maxAge: 420000, secure: true, httpOnly: true };
    cookie.set("test", "42", options);
  },
  async () => ({ variable1: "test", answer: 42, array: [1, 2, 3] }),
];

const details = [
  async ({ params, data }) => {
    const name = params.get("name");
    logger.log({ name });
    return data;
  },
  async (data) => Object.assign(data, { id: Math.random() }),
];

const endpoints = {config, details,};

const route = (module, serializer) => async.compose(...module, serializer);

const routes = [
  { method: "get", path: "/meta/config", callback: route(endpoints.config, SERIALIZERS.json) },
  { method: "post", path: "/details", callback: route(endpoints.details, SERIALIZERS.json) },
];

const queue = new Queue({ concurrency: 5, wait: 1000, timeout: 1000, });
const config = { port: 4998, routes, queue, debug: true, };

const { start } = http(config);
start();
```

## Part of the naughty stack