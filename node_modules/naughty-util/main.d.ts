type Callback = (...args: any[]) => any;
type CallbackAsync = (...args: any) => Promise<any>;
interface Thenable<T> {
  then(resolve: (data: T) => any, reject?: (err: any) => any): void;
}

interface UtilsAbstract {
  factorify<T, N, K extends keyof T>(dataset: T, nullable?: N): (key: K) => T[K] | N;
  factory<T extends { new(): any }>(Interface: T, ...params: ConstructorParameters<T>): () => InstanceType<T>;
}

interface UtilsArray {
  valid(data: any): boolean;
  accessor<T>(array: Array<T>, meta: Record<string | symbol, number>): Array<T>;
}

interface UtilsAsync {
  promisify<F extends Callback>(fn: F): (...params: Parameters<F>) => any;
  compose<F extends CallbackAsync>(...fns: F[]): (...params: Parameters<F>) => Promise<any>;
  thenable<F extends Callback>(fn: F, ...params: Parameters<F>): Thenable<any>;
  pause(ms: number): Promise<void>;
  parallel<F extends CallbackAsync>(...fns: F[]): (...params: Parameters<F>) => Promise<any>;
}

interface UtilsBuffer {
  random(length?: number): Thenable<Buffer>;
}

interface UtilsStream {
  read<T extends NodeJS.ReadableStream>(readable: T): Thenable<Buffer>;
}

interface UtilsNumber {
  safe(value: number): number;
  isSafe(value: number): boolean;
  positiveInt(value: number): boolean;
  cutFraction(value: number): number;
  total(dataset: number[]): number;
  average(dataset: number[]): number;
  percentRatio(amount: number, part: number): number;
  percentOf(base: number, percent: number): number;
}

interface UtilsMixin {
  weakAssign<T extends object, M extends object>(target: T, mixin: M): M & T;
  forget<T extends object, K extends keyof T>(target: T, keys: K[]): any;
}

interface UtilsDate {
  verbalEpoch(input: string): number;
  verbal(input: string): number;
  unix(input: ConstructorParameters<DateConstructor>[0]): number;
  midnightUTC(input: ConstructorParameters<DateConstructor>[0]): number;
  midnight(input: ConstructorParameters<DateConstructor>[0]): number;
  difference(base: ConstructorParameters<DateConstructor>[0], target: ConstructorParameters<DateConstructor>[0]): number;
  reached(base: ConstructorParameters<DateConstructor>[0], target: ConstructorParameters<DateConstructor>[0]): boolean;
  DAY: number;
  HOUR: number;
  MINUTE: number;
  SECOND: number;
}

interface UtilsHTTP {
  parseHost(host: string): string;
  parseCookies(cookie: string): Record<string, string>;
  createParams(params: string[][] | Record<string, string> | string | URLSearchParams): string;
  parseParams(params: string[][] | Record<string, string> | string | URLSearchParams): Record<string, string>;
  parseURL(pathname: string): URL;
}

interface UtilsMisc {
  id<T>(entity: T): T;
  inRange<T extends string | number>(value: T, min: T, max: T): boolean;
  compose<F extends Callback>(...fns: F[]): (...params: Parameters<F>) => any;
  range(end: number, start?: number, step?: number): Generator<number>;
  partial<F extends Callback>(fn: F, ...params: Partial<Parameters<F>>): (...params: any) => any;
  projection<T extends [string, string | T, Callback], O extends object>(meta: T[], data: O): any;
}

type Set = (key: any, value: any) => void;
interface Cache {
  limit(count: number): this;
  timeout(ms: number): this;
  get(key: any): any;
}

type UtilsCache = ({ ms, max }?: { ms?: number, max?: number }) => Set & Cache;

export const abstract: UtilsAbstract;
export const array: UtilsArray;
export const async: UtilsAsync;
export const buffer: UtilsBuffer;
export const stream: UtilsStream;
export const number: UtilsNumber;
export const mixin: UtilsMixin;
export const date: UtilsDate;
export const http: UtilsHTTP;
export const misc: UtilsMisc;
export const cache: UtilsCache;