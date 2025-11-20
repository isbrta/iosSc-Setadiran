/// <reference types="scriptable-ios" />

import { defaultsDeep, isArray, isBoolean, isFunction, isNumber, isPlainObject, isString, isUndefined } from './utils';
import { ScCookieJar } from './sc-cookie-jar';

export interface Options {
  url?: string;
  method?: string;
  timeout?: number;
  maxRedirects?: number;
  followRedirect?: boolean;
  responseType?: string;
  headers?: Readonly<Record<string, string>>;
  transformRequest?: ReadonlyArray<TransformFn>;
  transformResponse?: ReadonlyArray<TransformFn>;
  allowAbsoluteUrls?: boolean;
  baseUrl?: string;
  params?: Readonly<Record<string, any>>;
  paramsSerializer?: (params: any) => string;
  form?: Readonly<Record<string, any>>;
  json?: boolean | Readonly<Record<string, any>>;
  body?: any;
  jar?: ScCookieJar;
  validateStatus?: (status: number) => boolean;
}

export interface Response {
  statusCode: number;
  headers: Record<string, string>;
  url: string;
  mimeType?: string;
  body: any;
  cookies?: any;
}

type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

export type TransformFn = (options: Options, body: any, status?: number) => any;

export type Interceptor<T> = (input: T, ...args: any[]) => T | Promise<T>;

class InterceptorManager<T> {
  private handlers: Array<Interceptor<T>> = [];

  use(fn: Interceptor<T>): Interceptor<T> {
    this.handlers.push(fn);
    return fn;
  }

  eject(fn: Interceptor<T>): void {
    this.handlers = this.handlers.filter((h) => h !== fn);
  }

  async run(input: T, ...args: any[]): Promise<T> {
    let result = input;
    for (const fn of this.handlers) {
      const output = await Promise.resolve(fn(result, ...args));
      if (!isUndefined(output)) {
        result = output;
      }
    }
    return result;
  }
}

export class ScRequest {
  defaults: Options = {
    method: 'GET',
    timeout: 10000,
    maxRedirects: 5,
    followRedirect: true,
    responseType: 'data',
    headers: {},
    transformRequest: [(config, body, status) => this._defaultTransformRequest(config, body)],
    transformResponse: [],
    allowAbsoluteUrls: true,
  };

  interceptors = {
    request: new InterceptorManager<Options>(),
    response: new InterceptorManager<Response>(),
  };

  constructor(instanceoptions: Partial<Options> = {}) {
    this.defaults = defaultsDeep(instanceoptions, this.defaults);
  }

  async request(optionsOrUrl: string | Options, options: Options = {}): Promise<Response> {
    options = isString(optionsOrUrl) ? { url: optionsOrUrl, ...options } : optionsOrUrl;
    options = await this.interceptors.request.run(options);
    options = defaultsDeep(options, this.defaults);

    // copy of options
    const scOptions: Options = {};

    // url
    scOptions.url = this.buildUrl(
      options.baseUrl,
      options.url,
      options.params,
      options.allowAbsoluteUrls || true,
      options.paramsSerializer,
    );

    // body
    scOptions.body = this.transform(options, [...options.transformRequest!]);
    scOptions.method = options.method;
    scOptions.maxRedirects = options.maxRedirects;
    // resolve headers
    scOptions.headers = {};
    ScRequest.setHeader(scOptions.headers, options.headers);

    let response = await this.scRequest(options, scOptions);
    response.body = this.transform(scOptions, [...options.transformResponse!], response);
    response = await this.interceptors.response.run(response, options);

    if (!isFunction(options.validateStatus) || options.validateStatus(response.statusCode)) {
      return response;
    }

    const err = new Error(`Request failed with status code ${response.statusCode}`) as any;
    err.response = response;
    err.options = options;
    throw err;
  }

  private async scRequest(
    options: Options,
    { url, method, headers, body, maxRedirects }: Partial<Options>,
  ): Promise<Mutable<Response>> {
    let redirect = false;
    const req: Request = new Request(url!);

    req.method = method!.toUpperCase();
    req.timeoutInterval = options.timeout! / 1000;
    req.body = body!;

    if (options.jar) {
      const cookieStr = options.jar.getCookies(url!)?.toValueString();
      ScRequest.setHeader(headers!, 'Cookie', cookieStr || '');
    }

    req.onRedirect = ((r: Request) => {
      if (options.followRedirect && maxRedirects! > 0) {
        redirect = true;
        url = r.url;
        method = r.method;
        headers = { ...(r.headers || {}) };
        body = r.body;
        maxRedirects!--;
      }
      return null;
    }) as any;

    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      ScRequest.setHeader(headers!, 'Content-Type', 'application/x-www-form-urlencoded', false);
    }

    req.headers = headers!;
    let raw: any;

    switch (options.responseType!.toLowerCase()) {
      case 'json':
        raw = await req.loadJSON();
        break;
      case 'text':
      case 'html':
        raw = await req.loadString();
        break;
      case 'image':
        raw = await req.loadImage();
        break;
      default:
        raw = await req.load();
    }

    if (req.response.cookies && options.jar) {
      options.jar.setCookies(req.response.cookies, req.response.url);
    }

    if (redirect) {
      return await this.scRequest(options, { url, method, headers, body, maxRedirects });
    }

    const response: Mutable<Response> = {
      statusCode: req.response.statusCode,
      headers: req.response.headers,
      body: raw,
      cookies: req.response.cookies,
      url: req.response.url,
    };
    return response;
  }

  private transform(options: Options, fns: TransformFn[], response: Response | null = null): any {
    let body = response ? response.body : options.body;
    for (const fn of fns) {
      if (isFunction(fn)) {
        body = fn(options, body, response?.statusCode);
      }
    }
    return body;
  }

  private _defaultTransformRequest(options: Options, body: any): any {
    if (options.form) {
      ScRequest.setHeader(options.headers!, 'Content-Type', 'application/x-www-form-urlencoded', false);
      return this.serializeParams(options.form);
    }

    if (options.json) {
      ScRequest.setHeader(options.headers!, 'Content-Type', 'application/json', false);
      return typeof isBoolean(options.json) ? body && JSON.stringify(body) : JSON.stringify(options.json);
    }

    return body;
  }

  private buildUrl(
    baseUrl?: string,
    relativeUrl?: string,
    params?: Record<string, any>,
    allowAbsoluteUrls = true,
    paramsSerializer: ((params: any) => string) | null = null,
  ): string {
    const isAbsoluteURL = (u: string) => /^([a-z][a-z\d+\-.]*:)?\/\//i.test(u);
    const combineURLs = (base: string, relative: string) =>
      !relative ? base : `${base.replace(/\/?\/$/, '')}/${relative.replace(/^\/+/, '')}`;

    const fullPath =
      baseUrl && (!isAbsoluteURL(relativeUrl!) || allowAbsoluteUrls === false)
        ? combineURLs(baseUrl, relativeUrl!)
        : relativeUrl!;

    const [baseWithoutHash] = fullPath.split('#');
    let url = baseWithoutHash;

    const query = params
      ? isFunction(paramsSerializer)
        ? paramsSerializer(params)
        : this.serializeParams(params)
      : '';

    if (query) {
      const sep = url.includes('?') ? '&' : '?';
      url += `${sep}${query}`;
    }

    return url;
  }

  private serializeParams(obj: any, prefix = ''): string {
    if (!isPlainObject(obj) || obj === null) {
      return '';
    }
    return Object.entries(obj)
      .flatMap(([key, val]) => {
        const fullKey = prefix ? `${prefix}[${key}]` : key;
        if (val === null || val === undefined) {
          return [];
        }
        if (isArray(val)) {
          return val.map((v) => `${encodeURIComponent(fullKey)}[]=${encodeURIComponent(v)}`);
        } else if (isPlainObject(val)) {
          return this.serializeParams(val, fullKey);
        } else {
          if (isString(val) || isNumber(val) || isBoolean(val)) {
            return `${encodeURIComponent(fullKey)}=${encodeURIComponent(val)}`;
          } else {
            return '';
          }
        }
      })
      .join('&');
  }

  static setHeader(
    headers: Record<string, string>,
    keyOrMap: string | Record<string, string> | undefined,
    valueOrReplace?: string,
    replaceIfExists = true,
  ): void {
    const isEmpty = (v: any) => v === undefined || v === null;

    if (isPlainObject(keyOrMap)) {
      const replace = isBoolean(valueOrReplace) ? valueOrReplace : true;
      for (const [k, v] of Object.entries(keyOrMap)) {
        if (!isEmpty(v)) {
          ScRequest.setHeader(headers, k, v, replace);
        }
      }
      return;
    }

    const key = keyOrMap as string;
    const value = valueOrReplace as string;
    if (isEmpty(value)) {
      return;
    }

    const lowerKey = key.toLowerCase();
    const existingKey = Object.keys(headers).find((k) => k.toLowerCase() === lowerKey);

    if (existingKey) {
      if (replaceIfExists) {
        headers[existingKey] = value;
      }
    } else {
      headers[key] = value;
    }
  }

  static getHeader(headers: Record<string, string>, key: string): string | undefined {
    if (!isString(key)) {
      return;
    }
    const lowerKey = key.toLowerCase();
    const foundKey = Object.keys(headers).find((k) => k.toLowerCase() === lowerKey);
    return foundKey ? headers[foundKey] : undefined;
  }

  static hasHeader(headers: Record<string, string>, key: string): boolean {
    if (!isString(key)) {
      return false;
    }
    const lowerKey = key.toLowerCase();
    return Object.keys(headers).some((k) => k.toLowerCase() === lowerKey);
  }

  static deleteHeader(headers: Record<string, string>, key: string): boolean {
    if (!isString(key)) {
      return false;
    }
    const lowerKey = key.toLowerCase();
    const foundKey = Object.keys(headers).find((k) => k.toLowerCase() === lowerKey);
    if (foundKey) {
      delete headers[foundKey];
      return true;
    }
    return false;
  }
}
