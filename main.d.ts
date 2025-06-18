import { EventEmitter } from "node:events";
import { Socket } from "node:net";
import { ServerOptions } from "node:http";
import { UtilsAsync } from "naughty-util";

type ProcessCallback = (...params: any[]) => Promise<any>;
type RouterCallback = (params: HTTPCallbackParameters) => Promise<any>;

interface HTTPCallbackParameters {
  params: InstanceType<typeof URLSearchParams>;
  data: Record<string, any>;
  headers: Record<string, any>;
  cookie: InstanceType<typeof Cookies>;
}

interface QueueOptions {
  concurrency: number;
  wait?: number;
  timeout?: number;
}

interface RoundRobinQueueOptions extends QueueOptions {
  categorize: (...params: any[]) => any;
}

export class AbstractQueue extends EventEmitter {
  constructor();
  enqueue(...params: any[]): void;
  process(callback: ProcessCallback): this;
}

export class Queue extends AbstractQueue {
  constructor(options: QueueOptions);
  enqueue(...params: any[]): void;
  process(callback: ProcessCallback): this;
}

export class RoundRobinQueue extends Queue {
  constructor(options: RoundRobinQueueOptions);
  enqueue(...params: any[]): void;
  process(callback: ProcessCallback): this;
}

declare class Router {
  constructor();
  find(options: { path: string, method: string }): null | RouterCallback;
}

interface CookieOptions {
  sameSite?: string;
  maxAge?: number | string;
  expires?: Date | string;
  httpOnly?: boolean;
  secure?: boolean;
  path?: string;
  domain?: string;
}

declare class Cookies {
  constructor(headers: Record<string, any>);
  set(key: string, value: string, options?: CookieOptions): void;
  get(key: string): string;
  delete(key: string): void;
  has(key: string): boolean;
  send(response: any): void;
}

type Controller = (options: HTTPCallbackParameters) => Promise<any>;
type Handler = (options: Awaited<ReturnType<Controller>>) => Promise<any>;
type Serializer = (params: Awaited<ReturnType<Handler>>) => Promise<any>;
type RouteComposition = (module: [Controller, Handler], serializer: Serializer) => Promise<any>;

interface Routing {
  route: RouteComposition;
  SERIALIZERS: Record<string, (...params: any[]) => UtilsAsync["compose"]>;
}

export const routing: Routing;

interface HTTP {
  start(): Promise<void>;
  stop(ms?: number): Promise<void>;
  connect(socket: Socket): void;
}

type Log = (...params: string[]) => void;

interface HTTPOptions {
  port: number;
  routes: Array<ReturnType<RouteComposition>>;
  queue?: InstanceType<typeof AbstractQueue>;
  options?: ServerOptions;
  debug?: boolean;
  logger?: Partial<Console> & { log: Log; error: Log; info: Log };
  urlMaxLength?: number;
  parsingTimeout?: number;
}

export const http: (options: HTTPOptions) => HTTP;