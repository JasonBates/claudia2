var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// node_modules/@getzep/zep-cloud/dist/esm/core/json.mjs
var toJson = (value, replacer, space) => {
  return JSON.stringify(value, replacer, space);
};
function fromJson(text, reviver) {
  return JSON.parse(text, reviver);
}

// node_modules/@getzep/zep-cloud/dist/esm/errors/ZepError.mjs
var ZepError = class _ZepError extends Error {
  constructor({ message, statusCode, body, rawResponse }) {
    super(buildMessage({ message, statusCode, body }));
    Object.setPrototypeOf(this, _ZepError.prototype);
    this.statusCode = statusCode;
    this.body = body;
    this.rawResponse = rawResponse;
  }
};
function buildMessage({ message, statusCode, body }) {
  let lines = [];
  if (message != null) {
    lines.push(message);
  }
  if (statusCode != null) {
    lines.push(`Status code: ${statusCode.toString()}`);
  }
  if (body != null) {
    lines.push(`Body: ${toJson(body, void 0, 2)}`);
  }
  return lines.join("\n");
}

// node_modules/@getzep/zep-cloud/dist/esm/errors/ZepTimeoutError.mjs
var ZepTimeoutError = class _ZepTimeoutError extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, _ZepTimeoutError.prototype);
  }
};

// node_modules/@getzep/zep-cloud/dist/esm/api/errors/BadRequestError.mjs
var BadRequestError = class _BadRequestError extends ZepError {
  constructor(body, rawResponse) {
    super({
      message: "BadRequestError",
      statusCode: 400,
      body,
      rawResponse
    });
    Object.setPrototypeOf(this, _BadRequestError.prototype);
  }
};

// node_modules/@getzep/zep-cloud/dist/esm/api/errors/InternalServerError.mjs
var InternalServerError = class _InternalServerError extends ZepError {
  constructor(body, rawResponse) {
    super({
      message: "InternalServerError",
      statusCode: 500,
      body,
      rawResponse
    });
    Object.setPrototypeOf(this, _InternalServerError.prototype);
  }
};

// node_modules/@getzep/zep-cloud/dist/esm/api/errors/NotFoundError.mjs
var NotFoundError = class _NotFoundError extends ZepError {
  constructor(body, rawResponse) {
    super({
      message: "NotFoundError",
      statusCode: 404,
      body,
      rawResponse
    });
    Object.setPrototypeOf(this, _NotFoundError.prototype);
  }
};

// node_modules/@getzep/zep-cloud/dist/esm/api/errors/ForbiddenError.mjs
var ForbiddenError = class _ForbiddenError extends ZepError {
  constructor(body, rawResponse) {
    super({
      message: "ForbiddenError",
      statusCode: 403,
      body,
      rawResponse
    });
    Object.setPrototypeOf(this, _ForbiddenError.prototype);
  }
};

// node_modules/@getzep/zep-cloud/dist/esm/core/fetcher/Headers.mjs
var Headers;
if (typeof globalThis.Headers !== "undefined") {
  Headers = globalThis.Headers;
} else {
  Headers = class Headers2 {
    constructor(init) {
      this.headers = /* @__PURE__ */ new Map();
      if (init) {
        if (init instanceof Headers2) {
          init.forEach((value, key) => this.append(key, value));
        } else if (Array.isArray(init)) {
          for (const [key, value] of init) {
            if (typeof key === "string" && typeof value === "string") {
              this.append(key, value);
            } else {
              throw new TypeError("Each header entry must be a [string, string] tuple");
            }
          }
        } else {
          for (const [key, value] of Object.entries(init)) {
            if (typeof value === "string") {
              this.append(key, value);
            } else {
              throw new TypeError("Header values must be strings");
            }
          }
        }
      }
    }
    append(name, value) {
      const key = name.toLowerCase();
      const existing = this.headers.get(key) || [];
      this.headers.set(key, [...existing, value]);
    }
    delete(name) {
      const key = name.toLowerCase();
      this.headers.delete(key);
    }
    get(name) {
      const key = name.toLowerCase();
      const values = this.headers.get(key);
      return values ? values.join(", ") : null;
    }
    has(name) {
      const key = name.toLowerCase();
      return this.headers.has(key);
    }
    set(name, value) {
      const key = name.toLowerCase();
      this.headers.set(key, [value]);
    }
    forEach(callbackfn, thisArg) {
      const boundCallback = thisArg ? callbackfn.bind(thisArg) : callbackfn;
      this.headers.forEach((values, key) => boundCallback(values.join(", "), key, this));
    }
    getSetCookie() {
      return this.headers.get("set-cookie") || [];
    }
    *entries() {
      for (const [key, values] of this.headers.entries()) {
        yield [key, values.join(", ")];
      }
    }
    *keys() {
      yield* this.headers.keys();
    }
    *values() {
      for (const values of this.headers.values()) {
        yield values.join(", ");
      }
    }
    [Symbol.iterator]() {
      return this.entries();
    }
  };
}

// node_modules/@getzep/zep-cloud/dist/esm/core/fetcher/RawResponse.mjs
var abortRawResponse = {
  headers: new Headers(),
  redirected: false,
  status: 499,
  statusText: "Client Closed Request",
  type: "error",
  url: ""
};
var unknownRawResponse = {
  headers: new Headers(),
  redirected: false,
  status: 0,
  statusText: "Unknown Error",
  type: "error",
  url: ""
};
function toRawResponse(response) {
  return {
    headers: response.headers,
    redirected: response.redirected,
    status: response.status,
    statusText: response.statusText,
    type: response.type,
    url: response.url
  };
}

// node_modules/@getzep/zep-cloud/dist/esm/core/fetcher/Supplier.mjs
var __awaiter = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var Supplier = {
  get: (supplier) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof supplier === "function") {
      return supplier();
    } else {
      return supplier;
    }
  })
};

// node_modules/@getzep/zep-cloud/dist/esm/core/url/qs.mjs
var defaultQsOptions = {
  arrayFormat: "indices",
  encode: true
};
function encodeValue(value, shouldEncode) {
  if (value === void 0) {
    return "";
  }
  if (value === null) {
    return "";
  }
  const stringValue = String(value);
  return shouldEncode ? encodeURIComponent(stringValue) : stringValue;
}
function stringifyObject(obj, prefix = "", options) {
  const parts = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}[${key}]` : key;
    if (value === void 0) {
      continue;
    }
    if (Array.isArray(value)) {
      if (value.length === 0) {
        continue;
      }
      for (let i = 0; i < value.length; i++) {
        const item = value[i];
        if (item === void 0) {
          continue;
        }
        if (typeof item === "object" && !Array.isArray(item) && item !== null) {
          const arrayKey = options.arrayFormat === "indices" ? `${fullKey}[${i}]` : fullKey;
          parts.push(...stringifyObject(item, arrayKey, options));
        } else {
          const arrayKey = options.arrayFormat === "indices" ? `${fullKey}[${i}]` : fullKey;
          const encodedKey = options.encode ? encodeURIComponent(arrayKey) : arrayKey;
          parts.push(`${encodedKey}=${encodeValue(item, options.encode)}`);
        }
      }
    } else if (typeof value === "object" && value !== null) {
      if (Object.keys(value).length === 0) {
        continue;
      }
      parts.push(...stringifyObject(value, fullKey, options));
    } else {
      const encodedKey = options.encode ? encodeURIComponent(fullKey) : fullKey;
      parts.push(`${encodedKey}=${encodeValue(value, options.encode)}`);
    }
  }
  return parts;
}
function toQueryString(obj, options) {
  if (obj == null || typeof obj !== "object") {
    return "";
  }
  const parts = stringifyObject(obj, "", Object.assign(Object.assign({}, defaultQsOptions), options));
  return parts.join("&");
}

// node_modules/@getzep/zep-cloud/dist/esm/core/fetcher/createRequestUrl.mjs
function createRequestUrl(baseUrl, queryParameters) {
  const queryString = toQueryString(queryParameters, { arrayFormat: "repeat" });
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

// node_modules/@getzep/zep-cloud/dist/esm/core/fetcher/BinaryResponse.mjs
function getBinaryResponse(response) {
  const binaryResponse = {
    get bodyUsed() {
      return response.bodyUsed;
    },
    stream: () => response.body,
    arrayBuffer: response.arrayBuffer.bind(response),
    blob: response.blob.bind(response)
  };
  if ("bytes" in response && typeof response.bytes === "function") {
    binaryResponse.bytes = response.bytes.bind(response);
  }
  return binaryResponse;
}

// node_modules/@getzep/zep-cloud/dist/esm/core/fetcher/ResponseWithBody.mjs
function isResponseWithBody(response) {
  return response.body != null;
}

// node_modules/@getzep/zep-cloud/dist/esm/core/fetcher/getResponseBody.mjs
var __awaiter2 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
function getResponseBody(response, responseType) {
  return __awaiter2(this, void 0, void 0, function* () {
    if (!isResponseWithBody(response)) {
      return void 0;
    }
    switch (responseType) {
      case "binary-response":
        return getBinaryResponse(response);
      case "blob":
        return yield response.blob();
      case "arrayBuffer":
        return yield response.arrayBuffer();
      case "sse":
        return response.body;
      case "streaming":
        return response.body;
      case "text":
        return yield response.text();
    }
    const text = yield response.text();
    if (text.length > 0) {
      try {
        let responseBody = fromJson(text);
        return responseBody;
      } catch (err) {
        return {
          ok: false,
          error: {
            reason: "non-json",
            statusCode: response.status,
            rawBody: text
          }
        };
      }
    }
    return void 0;
  });
}

// node_modules/@getzep/zep-cloud/dist/esm/core/fetcher/getErrorResponseBody.mjs
var __awaiter3 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
function getErrorResponseBody(response) {
  return __awaiter3(this, void 0, void 0, function* () {
    var _a, _b, _c;
    let contentType = (_a = response.headers.get("Content-Type")) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    if (contentType == null || contentType.length === 0) {
      return getResponseBody(response);
    }
    if (contentType.indexOf(";") !== -1) {
      contentType = (_c = (_b = contentType.split(";")[0]) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : "";
    }
    switch (contentType) {
      case "application/hal+json":
      case "application/json":
      case "application/ld+json":
      case "application/problem+json":
      case "application/vnd.api+json":
      case "text/json":
        const text = yield response.text();
        return text.length > 0 ? fromJson(text) : void 0;
      default:
        if (contentType.startsWith("application/vnd.") && contentType.endsWith("+json")) {
          const text2 = yield response.text();
          return text2.length > 0 ? fromJson(text2) : void 0;
        }
        return yield response.text();
    }
  });
}

// node_modules/@getzep/zep-cloud/dist/esm/core/fetcher/getFetchFn.mjs
var __awaiter4 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
function getFetchFn() {
  return __awaiter4(this, void 0, void 0, function* () {
    return fetch;
  });
}

// node_modules/@getzep/zep-cloud/dist/esm/core/fetcher/getRequestBody.mjs
var __awaiter5 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
function getRequestBody(_a) {
  return __awaiter5(this, arguments, void 0, function* ({ body, type }) {
    if (type.includes("json")) {
      return toJson(body);
    } else {
      return body;
    }
  });
}

// node_modules/@getzep/zep-cloud/dist/esm/core/fetcher/signals.mjs
var TIMEOUT = "timeout";
function getTimeoutSignal(timeoutMs) {
  const controller = new AbortController();
  const abortId = setTimeout(() => controller.abort(TIMEOUT), timeoutMs);
  return { signal: controller.signal, abortId };
}
function anySignal(...args) {
  const signals = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
  const controller = new AbortController();
  for (const signal of signals) {
    if (signal.aborted) {
      controller.abort(signal === null || signal === void 0 ? void 0 : signal.reason);
      break;
    }
    signal.addEventListener("abort", () => controller.abort(signal === null || signal === void 0 ? void 0 : signal.reason), {
      signal: controller.signal
    });
  }
  return controller.signal;
}

// node_modules/@getzep/zep-cloud/dist/esm/core/fetcher/makeRequest.mjs
var __awaiter6 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var makeRequest = (fetchFn, url, method, headers, requestBody, timeoutMs, abortSignal, withCredentials, duplex) => __awaiter6(void 0, void 0, void 0, function* () {
  const signals = [];
  let timeoutAbortId = void 0;
  if (timeoutMs != null) {
    const { signal, abortId } = getTimeoutSignal(timeoutMs);
    timeoutAbortId = abortId;
    signals.push(signal);
  }
  if (abortSignal != null) {
    signals.push(abortSignal);
  }
  let newSignals = anySignal(signals);
  const response = yield fetchFn(url, {
    method,
    headers,
    body: requestBody,
    signal: newSignals,
    credentials: withCredentials ? "include" : void 0,
    // @ts-ignore
    duplex
  });
  if (timeoutAbortId != null) {
    clearTimeout(timeoutAbortId);
  }
  return response;
});

// node_modules/@getzep/zep-cloud/dist/esm/core/fetcher/requestWithRetries.mjs
var __awaiter7 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var INITIAL_RETRY_DELAY = 1e3;
var MAX_RETRY_DELAY = 6e4;
var DEFAULT_MAX_RETRIES = 2;
var JITTER_FACTOR = 0.2;
function addJitter(delay) {
  const jitterMultiplier = 1 + (Math.random() * 2 - 1) * JITTER_FACTOR;
  return delay * jitterMultiplier;
}
function requestWithRetries(requestFn_1) {
  return __awaiter7(this, arguments, void 0, function* (requestFn, maxRetries = DEFAULT_MAX_RETRIES) {
    let response = yield requestFn();
    for (let i = 0; i < maxRetries; ++i) {
      if ([408, 429].includes(response.status) || response.status >= 500) {
        const baseDelay = Math.min(INITIAL_RETRY_DELAY * Math.pow(2, i), MAX_RETRY_DELAY);
        const delayWithJitter = addJitter(baseDelay);
        yield new Promise((resolve) => setTimeout(resolve, delayWithJitter));
        response = yield requestFn();
      } else {
        break;
      }
    }
    return response;
  });
}

// node_modules/@getzep/zep-cloud/dist/esm/core/fetcher/Fetcher.mjs
var __awaiter8 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
function getHeaders(args) {
  return __awaiter8(this, void 0, void 0, function* () {
    const newHeaders = {};
    if (args.body !== void 0 && args.contentType != null) {
      newHeaders["Content-Type"] = args.contentType;
    }
    if (args.headers == null) {
      return newHeaders;
    }
    for (const [key, value] of Object.entries(args.headers)) {
      const result = yield Supplier.get(value);
      if (typeof result === "string") {
        newHeaders[key] = result;
        continue;
      }
      if (result == null) {
        continue;
      }
      newHeaders[key] = `${result}`;
    }
    return newHeaders;
  });
}
function fetcherImpl(args) {
  return __awaiter8(this, void 0, void 0, function* () {
    const url = createRequestUrl(args.url, args.queryParameters);
    const requestBody = yield getRequestBody({
      body: args.body,
      type: args.requestType === "json" ? "json" : "other"
    });
    const fetchFn = yield getFetchFn();
    try {
      const response = yield requestWithRetries(() => __awaiter8(this, void 0, void 0, function* () {
        return makeRequest(fetchFn, url, args.method, yield getHeaders(args), requestBody, args.timeoutMs, args.abortSignal, args.withCredentials, args.duplex);
      }), args.maxRetries);
      if (response.status >= 200 && response.status < 400) {
        return {
          ok: true,
          body: yield getResponseBody(response, args.responseType),
          headers: response.headers,
          rawResponse: toRawResponse(response)
        };
      } else {
        return {
          ok: false,
          error: {
            reason: "status-code",
            statusCode: response.status,
            body: yield getErrorResponseBody(response)
          },
          rawResponse: toRawResponse(response)
        };
      }
    } catch (error) {
      if (args.abortSignal != null && args.abortSignal.aborted) {
        return {
          ok: false,
          error: {
            reason: "unknown",
            errorMessage: "The user aborted a request"
          },
          rawResponse: abortRawResponse
        };
      } else if (error instanceof Error && error.name === "AbortError") {
        return {
          ok: false,
          error: {
            reason: "timeout"
          },
          rawResponse: abortRawResponse
        };
      } else if (error instanceof Error) {
        return {
          ok: false,
          error: {
            reason: "unknown",
            errorMessage: error.message
          },
          rawResponse: unknownRawResponse
        };
      }
      return {
        ok: false,
        error: {
          reason: "unknown",
          errorMessage: toJson(error)
        },
        rawResponse: unknownRawResponse
      };
    }
  });
}
var fetcher = fetcherImpl;

// node_modules/@getzep/zep-cloud/dist/esm/core/fetcher/HttpResponsePromise.mjs
var __awaiter9 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var HttpResponsePromise = class _HttpResponsePromise extends Promise {
  constructor(promise) {
    super((resolve) => {
      resolve(void 0);
    });
    this.innerPromise = promise;
  }
  /**
   * Creates an `HttpResponsePromise` from a function that returns a promise.
   *
   * @param fn - A function that returns a promise resolving to a `WithRawResponse` object.
   * @param args - Arguments to pass to the function.
   * @returns An `HttpResponsePromise` instance.
   */
  static fromFunction(fn, ...args) {
    return new _HttpResponsePromise(fn(...args));
  }
  /**
   * Creates a function that returns an `HttpResponsePromise` from a function that returns a promise.
   *
   * @param fn - A function that returns a promise resolving to a `WithRawResponse` object.
   * @returns A function that returns an `HttpResponsePromise` instance.
   */
  static interceptFunction(fn) {
    return (...args) => {
      return _HttpResponsePromise.fromPromise(fn(...args));
    };
  }
  /**
   * Creates an `HttpResponsePromise` from an existing promise.
   *
   * @param promise - A promise resolving to a `WithRawResponse` object.
   * @returns An `HttpResponsePromise` instance.
   */
  static fromPromise(promise) {
    return new _HttpResponsePromise(promise);
  }
  /**
   * Creates an `HttpResponsePromise` from an executor function.
   *
   * @param executor - A function that takes resolve and reject callbacks to create a promise.
   * @returns An `HttpResponsePromise` instance.
   */
  static fromExecutor(executor) {
    const promise = new Promise(executor);
    return new _HttpResponsePromise(promise);
  }
  /**
   * Creates an `HttpResponsePromise` from a resolved result.
   *
   * @param result - A `WithRawResponse` object to resolve immediately.
   * @returns An `HttpResponsePromise` instance.
   */
  static fromResult(result) {
    const promise = Promise.resolve(result);
    return new _HttpResponsePromise(promise);
  }
  unwrap() {
    if (!this.unwrappedPromise) {
      this.unwrappedPromise = this.innerPromise.then(({ data }) => data);
    }
    return this.unwrappedPromise;
  }
  /** @inheritdoc */
  then(onfulfilled, onrejected) {
    return this.unwrap().then(onfulfilled, onrejected);
  }
  /** @inheritdoc */
  catch(onrejected) {
    return this.unwrap().catch(onrejected);
  }
  /** @inheritdoc */
  finally(onfinally) {
    return this.unwrap().finally(onfinally);
  }
  /**
   * Retrieves the data and raw response.
   *
   * @returns A promise resolving to a `WithRawResponse` object.
   */
  withRawResponse() {
    return __awaiter9(this, void 0, void 0, function* () {
      return yield this.innerPromise;
    });
  }
};

// node_modules/@getzep/zep-cloud/dist/esm/core/runtime/runtime.mjs
var RUNTIME = evaluateRuntime();
function evaluateRuntime() {
  var _a, _b, _c, _d, _e;
  const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";
  if (isBrowser) {
    return {
      type: "browser",
      version: window.navigator.userAgent
    };
  }
  const isCloudflare = typeof globalThis !== "undefined" && ((_a = globalThis === null || globalThis === void 0 ? void 0 : globalThis.navigator) === null || _a === void 0 ? void 0 : _a.userAgent) === "Cloudflare-Workers";
  if (isCloudflare) {
    return {
      type: "workerd"
    };
  }
  const isEdgeRuntime = typeof EdgeRuntime === "string";
  if (isEdgeRuntime) {
    return {
      type: "edge-runtime"
    };
  }
  const isWebWorker = typeof self === "object" && typeof (self === null || self === void 0 ? void 0 : self.importScripts) === "function" && (((_b = self.constructor) === null || _b === void 0 ? void 0 : _b.name) === "DedicatedWorkerGlobalScope" || ((_c = self.constructor) === null || _c === void 0 ? void 0 : _c.name) === "ServiceWorkerGlobalScope" || ((_d = self.constructor) === null || _d === void 0 ? void 0 : _d.name) === "SharedWorkerGlobalScope");
  if (isWebWorker) {
    return {
      type: "web-worker"
    };
  }
  const isDeno = typeof Deno !== "undefined" && typeof Deno.version !== "undefined" && typeof Deno.version.deno !== "undefined";
  if (isDeno) {
    return {
      type: "deno",
      version: Deno.version.deno
    };
  }
  const isBun = typeof Bun !== "undefined" && typeof Bun.version !== "undefined";
  if (isBun) {
    return {
      type: "bun",
      version: Bun.version
    };
  }
  const isNode = typeof process !== "undefined" && "version" in process && !!process.version && "versions" in process && !!((_e = process.versions) === null || _e === void 0 ? void 0 : _e.node);
  if (isNode) {
    return {
      type: "node",
      version: process.versions.node,
      parsedVersion: Number(process.versions.node.split(".")[0])
    };
  }
  const isReactNative = typeof navigator !== "undefined" && (navigator === null || navigator === void 0 ? void 0 : navigator.product) === "ReactNative";
  if (isReactNative) {
    return {
      type: "react-native"
    };
  }
  return {
    type: "unknown"
  };
}

// node_modules/@getzep/zep-cloud/dist/esm/core/url/index.mjs
var url_exports = {};
__export(url_exports, {
  join: () => join,
  toQueryString: () => toQueryString
});

// node_modules/@getzep/zep-cloud/dist/esm/core/url/join.mjs
function join(base, ...segments) {
  if (!base) {
    return "";
  }
  if (segments.length === 0) {
    return base;
  }
  if (base.includes("://")) {
    let url;
    try {
      url = new URL(base);
    } catch (_a) {
      return joinPath(base, ...segments);
    }
    const lastSegment = segments[segments.length - 1];
    const shouldPreserveTrailingSlash = lastSegment && lastSegment.endsWith("/");
    for (const segment of segments) {
      const cleanSegment = trimSlashes(segment);
      if (cleanSegment) {
        url.pathname = joinPathSegments(url.pathname, cleanSegment);
      }
    }
    if (shouldPreserveTrailingSlash && !url.pathname.endsWith("/")) {
      url.pathname += "/";
    }
    return url.toString();
  }
  return joinPath(base, ...segments);
}
function joinPath(base, ...segments) {
  if (segments.length === 0) {
    return base;
  }
  let result = base;
  const lastSegment = segments[segments.length - 1];
  const shouldPreserveTrailingSlash = lastSegment && lastSegment.endsWith("/");
  for (const segment of segments) {
    const cleanSegment = trimSlashes(segment);
    if (cleanSegment) {
      result = joinPathSegments(result, cleanSegment);
    }
  }
  if (shouldPreserveTrailingSlash && !result.endsWith("/")) {
    result += "/";
  }
  return result;
}
function joinPathSegments(left, right) {
  if (left.endsWith("/")) {
    return left + right;
  }
  return left + "/" + right;
}
function trimSlashes(str) {
  if (!str)
    return str;
  let start = 0;
  let end = str.length;
  if (str.startsWith("/"))
    start = 1;
  if (str.endsWith("/"))
    end = str.length - 1;
  return start === 0 && end === str.length ? str : str.slice(start, end);
}

// node_modules/@getzep/zep-cloud/dist/esm/core/schemas/index.mjs
var schemas_exports = {};
__export(schemas_exports, {
  JsonError: () => JsonError,
  ParseError: () => ParseError,
  any: () => any,
  bigint: () => bigint,
  boolean: () => boolean,
  booleanLiteral: () => booleanLiteral,
  date: () => date,
  discriminant: () => discriminant,
  enum_: () => enum_,
  getObjectLikeUtils: () => getObjectLikeUtils,
  getObjectUtils: () => getObjectUtils,
  getSchemaUtils: () => getSchemaUtils,
  isProperty: () => isProperty,
  lazy: () => lazy,
  lazyObject: () => lazyObject,
  list: () => list,
  number: () => number,
  object: () => object,
  objectWithoutOptionalProperties: () => objectWithoutOptionalProperties,
  optional: () => optional,
  property: () => property,
  record: () => record,
  set: () => set,
  string: () => string,
  stringLiteral: () => stringLiteral,
  transform: () => transform,
  undiscriminatedUnion: () => undiscriminatedUnion,
  union: () => union,
  unknown: () => unknown,
  withParsedProperties: () => withParsedProperties
});

// node_modules/@getzep/zep-cloud/dist/esm/core/schemas/Schema.mjs
var SchemaType = {
  BIGINT: "bigint",
  DATE: "date",
  ENUM: "enum",
  LIST: "list",
  STRING_LITERAL: "stringLiteral",
  BOOLEAN_LITERAL: "booleanLiteral",
  OBJECT: "object",
  ANY: "any",
  BOOLEAN: "boolean",
  NUMBER: "number",
  STRING: "string",
  UNKNOWN: "unknown",
  RECORD: "record",
  SET: "set",
  UNION: "union",
  UNDISCRIMINATED_UNION: "undiscriminatedUnion",
  NULLABLE: "nullable",
  OPTIONAL: "optional",
  OPTIONAL_NULLABLE: "optionalNullable"
};

// node_modules/@getzep/zep-cloud/dist/esm/core/schemas/utils/getErrorMessageForIncorrectType.mjs
function getErrorMessageForIncorrectType(value, expectedType) {
  return `Expected ${expectedType}. Received ${getTypeAsString(value)}.`;
}
function getTypeAsString(value) {
  if (Array.isArray(value)) {
    return "list";
  }
  if (value === null) {
    return "null";
  }
  if (value instanceof BigInt) {
    return "BigInt";
  }
  switch (typeof value) {
    case "string":
      return `"${value}"`;
    case "bigint":
    case "number":
    case "boolean":
    case "undefined":
      return `${value}`;
  }
  return typeof value;
}

// node_modules/@getzep/zep-cloud/dist/esm/core/schemas/utils/maybeSkipValidation.mjs
function maybeSkipValidation(schema) {
  return Object.assign(Object.assign({}, schema), { json: transformAndMaybeSkipValidation(schema.json), parse: transformAndMaybeSkipValidation(schema.parse) });
}
function transformAndMaybeSkipValidation(transform2) {
  return (value, opts) => {
    const transformed = transform2(value, opts);
    const { skipValidation = false } = opts !== null && opts !== void 0 ? opts : {};
    if (!transformed.ok && skipValidation) {
      console.warn([
        "Failed to validate.",
        ...transformed.errors.map((error) => "  - " + (error.path.length > 0 ? `${error.path.join(".")}: ${error.message}` : error.message))
      ].join("\n"));
      return {
        ok: true,
        value
      };
    } else {
      return transformed;
    }
  };
}

// node_modules/@getzep/zep-cloud/dist/esm/core/schemas/builders/schema-utils/stringifyValidationErrors.mjs
function stringifyValidationError(error) {
  if (error.path.length === 0) {
    return error.message;
  }
  return `${error.path.join(" -> ")}: ${error.message}`;
}

// node_modules/@getzep/zep-cloud/dist/esm/core/schemas/builders/schema-utils/JsonError.mjs
var JsonError = class _JsonError extends Error {
  constructor(errors) {
    super(errors.map(stringifyValidationError).join("; "));
    this.errors = errors;
    Object.setPrototypeOf(this, _JsonError.prototype);
  }
};

// node_modules/@getzep/zep-cloud/dist/esm/core/schemas/builders/schema-utils/ParseError.mjs
var ParseError = class _ParseError extends Error {
  constructor(errors) {
    super(errors.map(stringifyValidationError).join("; "));
    this.errors = errors;
    Object.setPrototypeOf(this, _ParseError.prototype);
  }
};

// node_modules/@getzep/zep-cloud/dist/esm/core/schemas/builders/schema-utils/getSchemaUtils.mjs
function getSchemaUtils(schema) {
  return {
    nullable: () => nullable(schema),
    optional: () => optional(schema),
    optionalNullable: () => optionalNullable(schema),
    transform: (transformer) => transform(schema, transformer),
    parseOrThrow: (raw, opts) => {
      const parsed = schema.parse(raw, opts);
      if (parsed.ok) {
        return parsed.value;
      }
      throw new ParseError(parsed.errors);
    },
    jsonOrThrow: (parsed, opts) => {
      const raw = schema.json(parsed, opts);
      if (raw.ok) {
        return raw.value;
      }
      throw new JsonError(raw.errors);
    }
  };
}
function nullable(schema) {
  const baseSchema = {
    parse: (raw, opts) => {
      if (raw == null) {
        return {
          ok: true,
          value: null
        };
      }
      return schema.parse(raw, opts);
    },
    json: (parsed, opts) => {
      if (parsed == null) {
        return {
          ok: true,
          value: null
        };
      }
      return schema.json(parsed, opts);
    },
    getType: () => SchemaType.NULLABLE
  };
  return Object.assign(Object.assign({}, baseSchema), getSchemaUtils(baseSchema));
}
function optional(schema) {
  const baseSchema = {
    parse: (raw, opts) => {
      if (raw == null) {
        return {
          ok: true,
          value: void 0
        };
      }
      return schema.parse(raw, opts);
    },
    json: (parsed, opts) => {
      if ((opts === null || opts === void 0 ? void 0 : opts.omitUndefined) && parsed === void 0) {
        return {
          ok: true,
          value: void 0
        };
      }
      if (parsed == null) {
        return {
          ok: true,
          value: null
        };
      }
      return schema.json(parsed, opts);
    },
    getType: () => SchemaType.OPTIONAL
  };
  return Object.assign(Object.assign({}, baseSchema), getSchemaUtils(baseSchema));
}
function optionalNullable(schema) {
  const baseSchema = {
    parse: (raw, opts) => {
      if (raw === void 0) {
        return {
          ok: true,
          value: void 0
        };
      }
      if (raw === null) {
        return {
          ok: true,
          value: null
        };
      }
      return schema.parse(raw, opts);
    },
    json: (parsed, opts) => {
      if (parsed === void 0) {
        return {
          ok: true,
          value: void 0
        };
      }
      if (parsed === null) {
        return {
          ok: true,
          value: null
        };
      }
      return schema.json(parsed, opts);
    },
    getType: () => SchemaType.OPTIONAL_NULLABLE
  };
  return Object.assign(Object.assign({}, baseSchema), getSchemaUtils(baseSchema));
}
function transform(schema, transformer) {
  const baseSchema = {
    parse: (raw, opts) => {
      const parsed = schema.parse(raw, opts);
      if (!parsed.ok) {
        return parsed;
      }
      return {
        ok: true,
        value: transformer.transform(parsed.value)
      };
    },
    json: (transformed, opts) => {
      const parsed = transformer.untransform(transformed);
      return schema.json(parsed, opts);
    },
    getType: () => schema.getType()
  };
  return Object.assign(Object.assign({}, baseSchema), getSchemaUtils(baseSchema));
}

// node_modules/@getzep/zep-cloud/dist/esm/core/schemas/builders/bigint/bigint.mjs
function bigint() {
  const baseSchema = {
    parse: (raw, { breadcrumbsPrefix = [] } = {}) => {
      if (typeof raw === "bigint") {
        return {
          ok: true,
          value: raw
        };
      }
      if (typeof raw === "number") {
        return {
          ok: true,
          value: BigInt(raw)
        };
      }
      return {
        ok: false,
        errors: [
          {
            path: breadcrumbsPrefix,
            message: getErrorMessageForIncorrectType(raw, "bigint | number")
          }
        ]
      };
    },
    json: (bigint2, { breadcrumbsPrefix = [] } = {}) => {
      if (typeof bigint2 !== "bigint") {
        return {
          ok: false,
          errors: [
            {
              path: breadcrumbsPrefix,
              message: getErrorMessageForIncorrectType(bigint2, "bigint")
            }
          ]
        };
      }
      return {
        ok: true,
        value: bigint2
      };
    },
    getType: () => SchemaType.BIGINT
  };
  return Object.assign(Object.assign({}, maybeSkipValidation(baseSchema)), getSchemaUtils(baseSchema));
}

// node_modules/@getzep/zep-cloud/dist/esm/core/schemas/builders/date/date.mjs
var ISO_8601_REGEX = /^([+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([.,]\d+(?!:))?)?(\17[0-5]\d([.,]\d+)?)?([zZ]|([+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
function date() {
  const baseSchema = {
    parse: (raw, { breadcrumbsPrefix = [] } = {}) => {
      if (typeof raw !== "string") {
        return {
          ok: false,
          errors: [
            {
              path: breadcrumbsPrefix,
              message: getErrorMessageForIncorrectType(raw, "string")
            }
          ]
        };
      }
      if (!ISO_8601_REGEX.test(raw)) {
        return {
          ok: false,
          errors: [
            {
              path: breadcrumbsPrefix,
              message: getErrorMessageForIncorrectType(raw, "ISO 8601 date string")
            }
          ]
        };
      }
      return {
        ok: true,
        value: new Date(raw)
      };
    },
    json: (date2, { breadcrumbsPrefix = [] } = {}) => {
      if (date2 instanceof Date) {
        return {
          ok: true,
          value: date2.toISOString()
        };
      } else {
        return {
          ok: false,
          errors: [
            {
              path: breadcrumbsPrefix,
              message: getErrorMessageForIncorrectType(date2, "Date object")
            }
          ]
        };
      }
    },
    getType: () => SchemaType.DATE
  };
  return Object.assign(Object.assign({}, maybeSkipValidation(baseSchema)), getSchemaUtils(baseSchema));
}

// node_modules/@getzep/zep-cloud/dist/esm/core/schemas/utils/createIdentitySchemaCreator.mjs
function createIdentitySchemaCreator(schemaType, validate) {
  return () => {
    const baseSchema = {
      parse: validate,
      json: validate,
      getType: () => schemaType
    };
    return Object.assign(Object.assign({}, maybeSkipValidation(baseSchema)), getSchemaUtils(baseSchema));
  };
}

// node_modules/@getzep/zep-cloud/dist/esm/core/schemas/builders/enum/enum.mjs
function enum_(values) {
  const validValues = new Set(values);
  const schemaCreator = createIdentitySchemaCreator(SchemaType.ENUM, (value, { allowUnrecognizedEnumValues, breadcrumbsPrefix = [] } = {}) => {
    if (typeof value !== "string") {
      return {
        ok: false,
        errors: [
          {
            path: breadcrumbsPrefix,
            message: getErrorMessageForIncorrectType(value, "string")
          }
        ]
      };
    }
    if (!validValues.has(value) && !allowUnrecognizedEnumValues) {
      return {
        ok: false,
        errors: [
          {
            path: breadcrumbsPrefix,
            message: getErrorMessageForIncorrectType(value, "enum")
          }
        ]
      };
    }
    return {
      ok: true,
      value
    };
  });
  return schemaCreator();
}

// node_modules/@getzep/zep-cloud/dist/esm/core/schemas/builders/lazy/lazy.mjs
function lazy(getter) {
  const baseSchema = constructLazyBaseSchema(getter);
  return Object.assign(Object.assign({}, baseSchema), getSchemaUtils(baseSchema));
}
function constructLazyBaseSchema(getter) {
  return {
    parse: (raw, opts) => getMemoizedSchema(getter).parse(raw, opts),
    json: (parsed, opts) => getMemoizedSchema(getter).json(parsed, opts),
    getType: () => getMemoizedSchema(getter).getType()
  };
}
function getMemoizedSchema(getter) {
  const castedGetter = getter;
  if (castedGetter.__zurg_memoized == null) {
    castedGetter.__zurg_memoized = getter();
  }
  return castedGetter.__zurg_memoized;
}

// node_modules/@getzep/zep-cloud/dist/esm/core/schemas/utils/entries.mjs
function entries(object2) {
  return Object.entries(object2);
}

// node_modules/@getzep/zep-cloud/dist/esm/core/schemas/utils/filterObject.mjs
function filterObject(obj, keysToInclude) {
  const keysToIncludeSet = new Set(keysToInclude);
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (keysToIncludeSet.has(key)) {
      acc[key] = value;
    }
    return acc;
  }, {});
}

// node_modules/@getzep/zep-cloud/dist/esm/core/schemas/utils/isPlainObject.mjs
function isPlainObject(value) {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  if (Object.getPrototypeOf(value) === null) {
    return true;
  }
  let proto = value;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(value) === proto;
}

// node_modules/@getzep/zep-cloud/dist/esm/core/schemas/utils/keys.mjs
function keys(object2) {
  return Object.keys(object2);
}

// node_modules/@getzep/zep-cloud/dist/esm/core/schemas/utils/partition.mjs
function partition(items, predicate) {
  const trueItems = [], falseItems = [];
  for (const item of items) {
    if (predicate(item)) {
      trueItems.push(item);
    } else {
      falseItems.push(item);
    }
  }
  return [trueItems, falseItems];
}

// node_modules/@getzep/zep-cloud/dist/esm/core/schemas/builders/object-like/getObjectLikeUtils.mjs
function getObjectLikeUtils(schema) {
  return {
    withParsedProperties: (properties) => withParsedProperties(schema, properties)
  };
}
function withParsedProperties(objectLike, properties) {
  const objectSchema = {
    parse: (raw, opts) => {
      const parsedObject = objectLike.parse(raw, opts);
      if (!parsedObject.ok) {
        return parsedObject;
      }
      const additionalProperties = Object.entries(properties).reduce((processed, [key, value]) => {
        return Object.assign(Object.assign({}, processed), { [key]: typeof value === "function" ? value(parsedObject.value) : value });
      }, {});
      return {
        ok: true,
        value: Object.assign(Object.assign({}, parsedObject.value), additionalProperties)
      };
    },
    json: (parsed, opts) => {
      var _a;
      if (!isPlainObject(parsed)) {
        return {
          ok: false,
          errors: [
            {
              path: (_a = opts === null || opts === void 0 ? void 0 : opts.breadcrumbsPrefix) !== null && _a !== void 0 ? _a : [],
              message: getErrorMessageForIncorrectType(parsed, "object")
            }
          ]
        };
      }
      const addedPropertyKeys = new Set(Object.keys(properties));
      const parsedWithoutAddedProperties = filterObject(parsed, Object.keys(parsed).filter((key) => !addedPropertyKeys.has(key)));
      return objectLike.json(parsedWithoutAddedProperties, opts);
    },
    getType: () => objectLike.getType()
  };
  return Object.assign(Object.assign(Object.assign({}, objectSchema), getSchemaUtils(objectSchema)), getObjectLikeUtils(objectSchema));
}

// node_modules/@getzep/zep-cloud/dist/esm/core/schemas/builders/object/property.mjs
function property(rawKey, valueSchema) {
  return {
    rawKey,
    valueSchema,
    isProperty: true
  };
}
function isProperty(maybeProperty) {
  return maybeProperty.isProperty;
}

// node_modules/@getzep/zep-cloud/dist/esm/core/schemas/builders/object/object.mjs
function object(schemas) {
  const baseSchema = {
    _getRawProperties: () => Object.entries(schemas).map(([parsedKey, propertySchema]) => isProperty(propertySchema) ? propertySchema.rawKey : parsedKey),
    _getParsedProperties: () => keys(schemas),
    parse: (raw, opts) => {
      const rawKeyToProperty = {};
      const requiredKeys = [];
      for (const [parsedKey, schemaOrObjectProperty] of entries(schemas)) {
        const rawKey = isProperty(schemaOrObjectProperty) ? schemaOrObjectProperty.rawKey : parsedKey;
        const valueSchema = isProperty(schemaOrObjectProperty) ? schemaOrObjectProperty.valueSchema : schemaOrObjectProperty;
        const property2 = {
          rawKey,
          parsedKey,
          valueSchema
        };
        rawKeyToProperty[rawKey] = property2;
        if (isSchemaRequired(valueSchema)) {
          requiredKeys.push(rawKey);
        }
      }
      return validateAndTransformObject({
        value: raw,
        requiredKeys,
        getProperty: (rawKey) => {
          const property2 = rawKeyToProperty[rawKey];
          if (property2 == null) {
            return void 0;
          }
          return {
            transformedKey: property2.parsedKey,
            transform: (propertyValue) => {
              var _a;
              return property2.valueSchema.parse(propertyValue, Object.assign(Object.assign({}, opts), { breadcrumbsPrefix: [...(_a = opts === null || opts === void 0 ? void 0 : opts.breadcrumbsPrefix) !== null && _a !== void 0 ? _a : [], rawKey] }));
            }
          };
        },
        unrecognizedObjectKeys: opts === null || opts === void 0 ? void 0 : opts.unrecognizedObjectKeys,
        skipValidation: opts === null || opts === void 0 ? void 0 : opts.skipValidation,
        breadcrumbsPrefix: opts === null || opts === void 0 ? void 0 : opts.breadcrumbsPrefix,
        omitUndefined: opts === null || opts === void 0 ? void 0 : opts.omitUndefined
      });
    },
    json: (parsed, opts) => {
      const requiredKeys = [];
      for (const [parsedKey, schemaOrObjectProperty] of entries(schemas)) {
        const valueSchema = isProperty(schemaOrObjectProperty) ? schemaOrObjectProperty.valueSchema : schemaOrObjectProperty;
        if (isSchemaRequired(valueSchema)) {
          requiredKeys.push(parsedKey);
        }
      }
      return validateAndTransformObject({
        value: parsed,
        requiredKeys,
        getProperty: (parsedKey) => {
          const property2 = schemas[parsedKey];
          if (property2 == null) {
            return void 0;
          }
          if (isProperty(property2)) {
            return {
              transformedKey: property2.rawKey,
              transform: (propertyValue) => {
                var _a;
                return property2.valueSchema.json(propertyValue, Object.assign(Object.assign({}, opts), { breadcrumbsPrefix: [...(_a = opts === null || opts === void 0 ? void 0 : opts.breadcrumbsPrefix) !== null && _a !== void 0 ? _a : [], parsedKey] }));
              }
            };
          } else {
            return {
              transformedKey: parsedKey,
              transform: (propertyValue) => {
                var _a;
                return property2.json(propertyValue, Object.assign(Object.assign({}, opts), { breadcrumbsPrefix: [...(_a = opts === null || opts === void 0 ? void 0 : opts.breadcrumbsPrefix) !== null && _a !== void 0 ? _a : [], parsedKey] }));
              }
            };
          }
        },
        unrecognizedObjectKeys: opts === null || opts === void 0 ? void 0 : opts.unrecognizedObjectKeys,
        skipValidation: opts === null || opts === void 0 ? void 0 : opts.skipValidation,
        breadcrumbsPrefix: opts === null || opts === void 0 ? void 0 : opts.breadcrumbsPrefix,
        omitUndefined: opts === null || opts === void 0 ? void 0 : opts.omitUndefined
      });
    },
    getType: () => SchemaType.OBJECT
  };
  return Object.assign(Object.assign(Object.assign(Object.assign({}, maybeSkipValidation(baseSchema)), getSchemaUtils(baseSchema)), getObjectLikeUtils(baseSchema)), getObjectUtils(baseSchema));
}
function validateAndTransformObject({ value, requiredKeys, getProperty, unrecognizedObjectKeys = "fail", skipValidation = false, breadcrumbsPrefix = [] }) {
  if (!isPlainObject(value)) {
    return {
      ok: false,
      errors: [
        {
          path: breadcrumbsPrefix,
          message: getErrorMessageForIncorrectType(value, "object")
        }
      ]
    };
  }
  const missingRequiredKeys = new Set(requiredKeys);
  const errors = [];
  const transformed = {};
  for (const [preTransformedKey, preTransformedItemValue] of Object.entries(value)) {
    const property2 = getProperty(preTransformedKey);
    if (property2 != null) {
      missingRequiredKeys.delete(preTransformedKey);
      const value2 = property2.transform(preTransformedItemValue);
      if (value2.ok) {
        transformed[property2.transformedKey] = value2.value;
      } else {
        transformed[preTransformedKey] = preTransformedItemValue;
        errors.push(...value2.errors);
      }
    } else {
      switch (unrecognizedObjectKeys) {
        case "fail":
          errors.push({
            path: [...breadcrumbsPrefix, preTransformedKey],
            message: `Unexpected key "${preTransformedKey}"`
          });
          break;
        case "strip":
          break;
        case "passthrough":
          transformed[preTransformedKey] = preTransformedItemValue;
          break;
      }
    }
  }
  errors.push(...requiredKeys.filter((key) => missingRequiredKeys.has(key)).map((key) => ({
    path: breadcrumbsPrefix,
    message: `Missing required key "${key}"`
  })));
  if (errors.length === 0 || skipValidation) {
    return {
      ok: true,
      value: transformed
    };
  } else {
    return {
      ok: false,
      errors
    };
  }
}
function getObjectUtils(schema) {
  return {
    extend: (extension) => {
      const baseSchema = {
        _getParsedProperties: () => [...schema._getParsedProperties(), ...extension._getParsedProperties()],
        _getRawProperties: () => [...schema._getRawProperties(), ...extension._getRawProperties()],
        parse: (raw, opts) => {
          return validateAndTransformExtendedObject({
            extensionKeys: extension._getRawProperties(),
            value: raw,
            transformBase: (rawBase) => schema.parse(rawBase, opts),
            transformExtension: (rawExtension) => extension.parse(rawExtension, opts)
          });
        },
        json: (parsed, opts) => {
          return validateAndTransformExtendedObject({
            extensionKeys: extension._getParsedProperties(),
            value: parsed,
            transformBase: (parsedBase) => schema.json(parsedBase, opts),
            transformExtension: (parsedExtension) => extension.json(parsedExtension, opts)
          });
        },
        getType: () => SchemaType.OBJECT
      };
      return Object.assign(Object.assign(Object.assign(Object.assign({}, baseSchema), getSchemaUtils(baseSchema)), getObjectLikeUtils(baseSchema)), getObjectUtils(baseSchema));
    },
    passthrough: () => {
      const baseSchema = {
        _getParsedProperties: () => schema._getParsedProperties(),
        _getRawProperties: () => schema._getRawProperties(),
        parse: (raw, opts) => {
          const transformed = schema.parse(raw, Object.assign(Object.assign({}, opts), { unrecognizedObjectKeys: "passthrough" }));
          if (!transformed.ok) {
            return transformed;
          }
          return {
            ok: true,
            value: Object.assign(Object.assign({}, raw), transformed.value)
          };
        },
        json: (parsed, opts) => {
          const transformed = schema.json(parsed, Object.assign(Object.assign({}, opts), { unrecognizedObjectKeys: "passthrough" }));
          if (!transformed.ok) {
            return transformed;
          }
          return {
            ok: true,
            value: Object.assign(Object.assign({}, parsed), transformed.value)
          };
        },
        getType: () => SchemaType.OBJECT
      };
      return Object.assign(Object.assign(Object.assign(Object.assign({}, baseSchema), getSchemaUtils(baseSchema)), getObjectLikeUtils(baseSchema)), getObjectUtils(baseSchema));
    }
  };
}
function validateAndTransformExtendedObject({ extensionKeys, value, transformBase, transformExtension }) {
  const extensionPropertiesSet = new Set(extensionKeys);
  const [extensionProperties, baseProperties] = partition(keys(value), (key) => extensionPropertiesSet.has(key));
  const transformedBase = transformBase(filterObject(value, baseProperties));
  const transformedExtension = transformExtension(filterObject(value, extensionProperties));
  if (transformedBase.ok && transformedExtension.ok) {
    return {
      ok: true,
      value: Object.assign(Object.assign({}, transformedBase.value), transformedExtension.value)
    };
  } else {
    return {
      ok: false,
      errors: [
        ...transformedBase.ok ? [] : transformedBase.errors,
        ...transformedExtension.ok ? [] : transformedExtension.errors
      ]
    };
  }
}
function isSchemaRequired(schema) {
  return !isSchemaOptional(schema);
}
function isSchemaOptional(schema) {
  switch (schema.getType()) {
    case SchemaType.ANY:
    case SchemaType.UNKNOWN:
    case SchemaType.OPTIONAL:
    case SchemaType.OPTIONAL_NULLABLE:
      return true;
    default:
      return false;
  }
}

// node_modules/@getzep/zep-cloud/dist/esm/core/schemas/builders/object/objectWithoutOptionalProperties.mjs
function objectWithoutOptionalProperties(schemas) {
  return object(schemas);
}

// node_modules/@getzep/zep-cloud/dist/esm/core/schemas/builders/lazy/lazyObject.mjs
function lazyObject(getter) {
  const baseSchema = Object.assign(Object.assign({}, constructLazyBaseSchema(getter)), { _getRawProperties: () => getMemoizedSchema(getter)._getRawProperties(), _getParsedProperties: () => getMemoizedSchema(getter)._getParsedProperties() });
  return Object.assign(Object.assign(Object.assign(Object.assign({}, baseSchema), getSchemaUtils(baseSchema)), getObjectLikeUtils(baseSchema)), getObjectUtils(baseSchema));
}

// node_modules/@getzep/zep-cloud/dist/esm/core/schemas/builders/list/list.mjs
function list(schema) {
  const baseSchema = {
    parse: (raw, opts) => validateAndTransformArray(raw, (item, index) => {
      var _a;
      return schema.parse(item, Object.assign(Object.assign({}, opts), { breadcrumbsPrefix: [...(_a = opts === null || opts === void 0 ? void 0 : opts.breadcrumbsPrefix) !== null && _a !== void 0 ? _a : [], `[${index}]`] }));
    }),
    json: (parsed, opts) => validateAndTransformArray(parsed, (item, index) => {
      var _a;
      return schema.json(item, Object.assign(Object.assign({}, opts), { breadcrumbsPrefix: [...(_a = opts === null || opts === void 0 ? void 0 : opts.breadcrumbsPrefix) !== null && _a !== void 0 ? _a : [], `[${index}]`] }));
    }),
    getType: () => SchemaType.LIST
  };
  return Object.assign(Object.assign({}, maybeSkipValidation(baseSchema)), getSchemaUtils(baseSchema));
}
function validateAndTransformArray(value, transformItem) {
  if (!Array.isArray(value)) {
    return {
      ok: false,
      errors: [
        {
          message: getErrorMessageForIncorrectType(value, "list"),
          path: []
        }
      ]
    };
  }
  const maybeValidItems = value.map((item, index) => transformItem(item, index));
  return maybeValidItems.reduce((acc, item) => {
    if (acc.ok && item.ok) {
      return {
        ok: true,
        value: [...acc.value, item.value]
      };
    }
    const errors = [];
    if (!acc.ok) {
      errors.push(...acc.errors);
    }
    if (!item.ok) {
      errors.push(...item.errors);
    }
    return {
      ok: false,
      errors
    };
  }, { ok: true, value: [] });
}

// node_modules/@getzep/zep-cloud/dist/esm/core/schemas/builders/literals/stringLiteral.mjs
function stringLiteral(literal) {
  const schemaCreator = createIdentitySchemaCreator(SchemaType.STRING_LITERAL, (value, { breadcrumbsPrefix = [] } = {}) => {
    if (value === literal) {
      return {
        ok: true,
        value: literal
      };
    } else {
      return {
        ok: false,
        errors: [
          {
            path: breadcrumbsPrefix,
            message: getErrorMessageForIncorrectType(value, `"${literal}"`)
          }
        ]
      };
    }
  });
  return schemaCreator();
}

// node_modules/@getzep/zep-cloud/dist/esm/core/schemas/builders/literals/booleanLiteral.mjs
function booleanLiteral(literal) {
  const schemaCreator = createIdentitySchemaCreator(SchemaType.BOOLEAN_LITERAL, (value, { breadcrumbsPrefix = [] } = {}) => {
    if (value === literal) {
      return {
        ok: true,
        value: literal
      };
    } else {
      return {
        ok: false,
        errors: [
          {
            path: breadcrumbsPrefix,
            message: getErrorMessageForIncorrectType(value, `${literal.toString()}`)
          }
        ]
      };
    }
  });
  return schemaCreator();
}

// node_modules/@getzep/zep-cloud/dist/esm/core/schemas/builders/primitives/any.mjs
var any = createIdentitySchemaCreator(SchemaType.ANY, (value) => ({ ok: true, value }));

// node_modules/@getzep/zep-cloud/dist/esm/core/schemas/builders/primitives/boolean.mjs
var boolean = createIdentitySchemaCreator(SchemaType.BOOLEAN, (value, { breadcrumbsPrefix = [] } = {}) => {
  if (typeof value === "boolean") {
    return {
      ok: true,
      value
    };
  } else {
    return {
      ok: false,
      errors: [
        {
          path: breadcrumbsPrefix,
          message: getErrorMessageForIncorrectType(value, "boolean")
        }
      ]
    };
  }
});

// node_modules/@getzep/zep-cloud/dist/esm/core/schemas/builders/primitives/number.mjs
var number = createIdentitySchemaCreator(SchemaType.NUMBER, (value, { breadcrumbsPrefix = [] } = {}) => {
  if (typeof value === "number") {
    return {
      ok: true,
      value
    };
  } else {
    return {
      ok: false,
      errors: [
        {
          path: breadcrumbsPrefix,
          message: getErrorMessageForIncorrectType(value, "number")
        }
      ]
    };
  }
});

// node_modules/@getzep/zep-cloud/dist/esm/core/schemas/builders/primitives/string.mjs
var string = createIdentitySchemaCreator(SchemaType.STRING, (value, { breadcrumbsPrefix = [] } = {}) => {
  if (typeof value === "string") {
    return {
      ok: true,
      value
    };
  } else {
    return {
      ok: false,
      errors: [
        {
          path: breadcrumbsPrefix,
          message: getErrorMessageForIncorrectType(value, "string")
        }
      ]
    };
  }
});

// node_modules/@getzep/zep-cloud/dist/esm/core/schemas/builders/primitives/unknown.mjs
var unknown = createIdentitySchemaCreator(SchemaType.UNKNOWN, (value) => ({ ok: true, value }));

// node_modules/@getzep/zep-cloud/dist/esm/core/schemas/builders/record/record.mjs
function record(keySchema, valueSchema) {
  const baseSchema = {
    parse: (raw, opts) => {
      return validateAndTransformRecord({
        value: raw,
        isKeyNumeric: keySchema.getType() === SchemaType.NUMBER,
        transformKey: (key) => {
          var _a;
          return keySchema.parse(key, Object.assign(Object.assign({}, opts), { breadcrumbsPrefix: [...(_a = opts === null || opts === void 0 ? void 0 : opts.breadcrumbsPrefix) !== null && _a !== void 0 ? _a : [], `${key} (key)`] }));
        },
        transformValue: (value, key) => {
          var _a;
          return valueSchema.parse(value, Object.assign(Object.assign({}, opts), { breadcrumbsPrefix: [...(_a = opts === null || opts === void 0 ? void 0 : opts.breadcrumbsPrefix) !== null && _a !== void 0 ? _a : [], `${key}`] }));
        },
        breadcrumbsPrefix: opts === null || opts === void 0 ? void 0 : opts.breadcrumbsPrefix
      });
    },
    json: (parsed, opts) => {
      return validateAndTransformRecord({
        value: parsed,
        isKeyNumeric: keySchema.getType() === SchemaType.NUMBER,
        transformKey: (key) => {
          var _a;
          return keySchema.json(key, Object.assign(Object.assign({}, opts), { breadcrumbsPrefix: [...(_a = opts === null || opts === void 0 ? void 0 : opts.breadcrumbsPrefix) !== null && _a !== void 0 ? _a : [], `${key} (key)`] }));
        },
        transformValue: (value, key) => {
          var _a;
          return valueSchema.json(value, Object.assign(Object.assign({}, opts), { breadcrumbsPrefix: [...(_a = opts === null || opts === void 0 ? void 0 : opts.breadcrumbsPrefix) !== null && _a !== void 0 ? _a : [], `${key}`] }));
        },
        breadcrumbsPrefix: opts === null || opts === void 0 ? void 0 : opts.breadcrumbsPrefix
      });
    },
    getType: () => SchemaType.RECORD
  };
  return Object.assign(Object.assign({}, maybeSkipValidation(baseSchema)), getSchemaUtils(baseSchema));
}
function validateAndTransformRecord({ value, isKeyNumeric, transformKey, transformValue, breadcrumbsPrefix = [] }) {
  if (!isPlainObject(value)) {
    return {
      ok: false,
      errors: [
        {
          path: breadcrumbsPrefix,
          message: getErrorMessageForIncorrectType(value, "object")
        }
      ]
    };
  }
  return entries(value).reduce((accPromise, [stringKey, value2]) => {
    if (value2 === void 0) {
      return accPromise;
    }
    const acc = accPromise;
    let key = stringKey;
    if (isKeyNumeric) {
      const numberKey = stringKey.length > 0 ? Number(stringKey) : NaN;
      if (!isNaN(numberKey)) {
        key = numberKey;
      }
    }
    const transformedKey = transformKey(key);
    const transformedValue = transformValue(value2, key);
    if (acc.ok && transformedKey.ok && transformedValue.ok) {
      return {
        ok: true,
        value: Object.assign(Object.assign({}, acc.value), { [transformedKey.value]: transformedValue.value })
      };
    }
    const errors = [];
    if (!acc.ok) {
      errors.push(...acc.errors);
    }
    if (!transformedKey.ok) {
      errors.push(...transformedKey.errors);
    }
    if (!transformedValue.ok) {
      errors.push(...transformedValue.errors);
    }
    return {
      ok: false,
      errors
    };
  }, { ok: true, value: {} });
}

// node_modules/@getzep/zep-cloud/dist/esm/core/schemas/builders/set/set.mjs
function set(schema) {
  const listSchema = list(schema);
  const baseSchema = {
    parse: (raw, opts) => {
      const parsedList = listSchema.parse(raw, opts);
      if (parsedList.ok) {
        return {
          ok: true,
          value: new Set(parsedList.value)
        };
      } else {
        return parsedList;
      }
    },
    json: (parsed, opts) => {
      var _a;
      if (!(parsed instanceof Set)) {
        return {
          ok: false,
          errors: [
            {
              path: (_a = opts === null || opts === void 0 ? void 0 : opts.breadcrumbsPrefix) !== null && _a !== void 0 ? _a : [],
              message: getErrorMessageForIncorrectType(parsed, "Set")
            }
          ]
        };
      }
      const jsonList = listSchema.json([...parsed], opts);
      return jsonList;
    },
    getType: () => SchemaType.SET
  };
  return Object.assign(Object.assign({}, maybeSkipValidation(baseSchema)), getSchemaUtils(baseSchema));
}

// node_modules/@getzep/zep-cloud/dist/esm/core/schemas/builders/undiscriminated-union/undiscriminatedUnion.mjs
function undiscriminatedUnion(schemas) {
  const baseSchema = {
    parse: (raw, opts) => {
      return validateAndTransformUndiscriminatedUnion((schema, opts2) => schema.parse(raw, opts2), schemas, opts);
    },
    json: (parsed, opts) => {
      return validateAndTransformUndiscriminatedUnion((schema, opts2) => schema.json(parsed, opts2), schemas, opts);
    },
    getType: () => SchemaType.UNDISCRIMINATED_UNION
  };
  return Object.assign(Object.assign({}, maybeSkipValidation(baseSchema)), getSchemaUtils(baseSchema));
}
function validateAndTransformUndiscriminatedUnion(transform2, schemas, opts) {
  const errors = [];
  for (const [index, schema] of schemas.entries()) {
    const transformed = transform2(schema, Object.assign(Object.assign({}, opts), { skipValidation: false }));
    if (transformed.ok) {
      return transformed;
    } else {
      for (const error of transformed.errors) {
        errors.push({
          path: error.path,
          message: `[Variant ${index}] ${error.message}`
        });
      }
    }
  }
  return {
    ok: false,
    errors
  };
}

// node_modules/@getzep/zep-cloud/dist/esm/core/schemas/builders/union/discriminant.mjs
function discriminant(parsedDiscriminant, rawDiscriminant) {
  return {
    parsedDiscriminant,
    rawDiscriminant
  };
}

// node_modules/@getzep/zep-cloud/dist/esm/core/schemas/builders/union/union.mjs
var __rest = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
    t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
};
function union(discriminant2, union2) {
  const rawDiscriminant = typeof discriminant2 === "string" ? discriminant2 : discriminant2.rawDiscriminant;
  const parsedDiscriminant = typeof discriminant2 === "string" ? discriminant2 : discriminant2.parsedDiscriminant;
  const discriminantValueSchema = enum_(keys(union2));
  const baseSchema = {
    parse: (raw, opts) => {
      return transformAndValidateUnion({
        value: raw,
        discriminant: rawDiscriminant,
        transformedDiscriminant: parsedDiscriminant,
        transformDiscriminantValue: (discriminantValue) => {
          var _a;
          return discriminantValueSchema.parse(discriminantValue, {
            allowUnrecognizedEnumValues: opts === null || opts === void 0 ? void 0 : opts.allowUnrecognizedUnionMembers,
            breadcrumbsPrefix: [...(_a = opts === null || opts === void 0 ? void 0 : opts.breadcrumbsPrefix) !== null && _a !== void 0 ? _a : [], rawDiscriminant]
          });
        },
        getAdditionalPropertiesSchema: (discriminantValue) => union2[discriminantValue],
        allowUnrecognizedUnionMembers: opts === null || opts === void 0 ? void 0 : opts.allowUnrecognizedUnionMembers,
        transformAdditionalProperties: (additionalProperties, additionalPropertiesSchema) => additionalPropertiesSchema.parse(additionalProperties, opts),
        breadcrumbsPrefix: opts === null || opts === void 0 ? void 0 : opts.breadcrumbsPrefix
      });
    },
    json: (parsed, opts) => {
      return transformAndValidateUnion({
        value: parsed,
        discriminant: parsedDiscriminant,
        transformedDiscriminant: rawDiscriminant,
        transformDiscriminantValue: (discriminantValue) => {
          var _a;
          return discriminantValueSchema.json(discriminantValue, {
            allowUnrecognizedEnumValues: opts === null || opts === void 0 ? void 0 : opts.allowUnrecognizedUnionMembers,
            breadcrumbsPrefix: [...(_a = opts === null || opts === void 0 ? void 0 : opts.breadcrumbsPrefix) !== null && _a !== void 0 ? _a : [], parsedDiscriminant]
          });
        },
        getAdditionalPropertiesSchema: (discriminantValue) => union2[discriminantValue],
        allowUnrecognizedUnionMembers: opts === null || opts === void 0 ? void 0 : opts.allowUnrecognizedUnionMembers,
        transformAdditionalProperties: (additionalProperties, additionalPropertiesSchema) => additionalPropertiesSchema.json(additionalProperties, opts),
        breadcrumbsPrefix: opts === null || opts === void 0 ? void 0 : opts.breadcrumbsPrefix
      });
    },
    getType: () => SchemaType.UNION
  };
  return Object.assign(Object.assign(Object.assign({}, maybeSkipValidation(baseSchema)), getSchemaUtils(baseSchema)), getObjectLikeUtils(baseSchema));
}
function transformAndValidateUnion({ value, discriminant: discriminant2, transformedDiscriminant, transformDiscriminantValue, getAdditionalPropertiesSchema, allowUnrecognizedUnionMembers = false, transformAdditionalProperties, breadcrumbsPrefix = [] }) {
  if (!isPlainObject(value)) {
    return {
      ok: false,
      errors: [
        {
          path: breadcrumbsPrefix,
          message: getErrorMessageForIncorrectType(value, "object")
        }
      ]
    };
  }
  const _a = value, _b = discriminant2, discriminantValue = _a[_b], additionalProperties = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
  if (discriminantValue == null) {
    return {
      ok: false,
      errors: [
        {
          path: breadcrumbsPrefix,
          message: `Missing discriminant ("${discriminant2}")`
        }
      ]
    };
  }
  const transformedDiscriminantValue = transformDiscriminantValue(discriminantValue);
  if (!transformedDiscriminantValue.ok) {
    return {
      ok: false,
      errors: transformedDiscriminantValue.errors
    };
  }
  const additionalPropertiesSchema = getAdditionalPropertiesSchema(transformedDiscriminantValue.value);
  if (additionalPropertiesSchema == null) {
    if (allowUnrecognizedUnionMembers) {
      return {
        ok: true,
        value: Object.assign({ [transformedDiscriminant]: transformedDiscriminantValue.value }, additionalProperties)
      };
    } else {
      return {
        ok: false,
        errors: [
          {
            path: [...breadcrumbsPrefix, discriminant2],
            message: "Unexpected discriminant value"
          }
        ]
      };
    }
  }
  const transformedAdditionalProperties = transformAdditionalProperties(additionalProperties, additionalPropertiesSchema);
  if (!transformedAdditionalProperties.ok) {
    return transformedAdditionalProperties;
  }
  return {
    ok: true,
    value: Object.assign({ [transformedDiscriminant]: discriminantValue }, transformedAdditionalProperties.value)
  };
}

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/ApiError.mjs
var ApiError = schemas_exports.object({
  message: schemas_exports.string().optional()
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/RoleType.mjs
var RoleType = schemas_exports.enum_([
  "norole",
  "system",
  "assistant",
  "user",
  "function",
  "tool"
]);

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/Message.mjs
var Message = schemas_exports.object({
  content: schemas_exports.string(),
  createdAt: schemas_exports.property("created_at", schemas_exports.string().optional()),
  metadata: schemas_exports.record(schemas_exports.string(), schemas_exports.unknown()).optional(),
  name: schemas_exports.string().optional(),
  processed: schemas_exports.boolean().optional(),
  role: RoleType,
  uuid: schemas_exports.string().optional()
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/AddThreadMessagesRequest.mjs
var AddThreadMessagesRequest = schemas_exports.object({
  ignoreRoles: schemas_exports.property("ignore_roles", schemas_exports.list(RoleType).optional()),
  messages: schemas_exports.list(Message),
  returnContext: schemas_exports.property("return_context", schemas_exports.boolean().optional())
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/AddThreadMessagesResponse.mjs
var AddThreadMessagesResponse = schemas_exports.object({
  context: schemas_exports.string().optional(),
  messageUuids: schemas_exports.property("message_uuids", schemas_exports.list(schemas_exports.string()).optional()),
  taskId: schemas_exports.property("task_id", schemas_exports.string().optional())
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/CloneGraphResponse.mjs
var CloneGraphResponse = schemas_exports.object({
  graphId: schemas_exports.property("graph_id", schemas_exports.string().optional()),
  taskId: schemas_exports.property("task_id", schemas_exports.string().optional()),
  userId: schemas_exports.property("user_id", schemas_exports.string().optional())
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/ClusterDetectConfig.mjs
var ClusterDetectConfig = schemas_exports.record(schemas_exports.string(), schemas_exports.unknown());

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/CoOccurrenceDetectConfig.mjs
var CoOccurrenceDetectConfig = schemas_exports.object({
  maxHops: schemas_exports.property("max_hops", schemas_exports.number().optional())
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/ContextTemplateResponse.mjs
var ContextTemplateResponse = schemas_exports.object({
  template: schemas_exports.string().optional(),
  templateId: schemas_exports.property("template_id", schemas_exports.string().optional()),
  uuid: schemas_exports.string().optional()
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/CustomInstruction.mjs
var CustomInstruction = schemas_exports.object({
  name: schemas_exports.string(),
  text: schemas_exports.string()
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/HubDetectConfig.mjs
var HubDetectConfig = schemas_exports.object({
  minDegree: schemas_exports.property("min_degree", schemas_exports.number().optional())
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/PathDetectConfig.mjs
var PathDetectConfig = schemas_exports.object({
  maxHops: schemas_exports.property("max_hops", schemas_exports.number().optional())
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/RelationshipDetectConfig.mjs
var RelationshipDetectConfig = schemas_exports.record(schemas_exports.string(), schemas_exports.unknown());

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/DetectConfig.mjs
var DetectConfig = schemas_exports.object({
  clusters: ClusterDetectConfig.optional(),
  coOccurrences: schemas_exports.property("co_occurrences", CoOccurrenceDetectConfig.optional()),
  hubs: HubDetectConfig.optional(),
  paths: PathDetectConfig.optional(),
  relationships: RelationshipDetectConfig.optional()
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/PatternMetadata.mjs
var PatternMetadata = schemas_exports.object({
  edgesAnalyzed: schemas_exports.property("edges_analyzed", schemas_exports.number().optional()),
  elapsedMs: schemas_exports.property("elapsed_ms", schemas_exports.number().optional()),
  nodesAnalyzed: schemas_exports.property("nodes_analyzed", schemas_exports.number().optional())
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/EntityNode.mjs
var EntityNode = schemas_exports.object({
  attributes: schemas_exports.record(schemas_exports.string(), schemas_exports.unknown()).optional(),
  createdAt: schemas_exports.property("created_at", schemas_exports.string()),
  labels: schemas_exports.list(schemas_exports.string()).optional(),
  name: schemas_exports.string(),
  relevance: schemas_exports.number().optional(),
  score: schemas_exports.number().optional(),
  summary: schemas_exports.string(),
  uuid: schemas_exports.string()
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/EntityEdge.mjs
var EntityEdge = schemas_exports.object({
  attributes: schemas_exports.record(schemas_exports.string(), schemas_exports.unknown()).optional(),
  createdAt: schemas_exports.property("created_at", schemas_exports.string()),
  episodes: schemas_exports.list(schemas_exports.string()).optional(),
  expiredAt: schemas_exports.property("expired_at", schemas_exports.string().optional()),
  fact: schemas_exports.string(),
  invalidAt: schemas_exports.property("invalid_at", schemas_exports.string().optional()),
  name: schemas_exports.string(),
  relevance: schemas_exports.number().optional(),
  score: schemas_exports.number().optional(),
  sourceNodeUuid: schemas_exports.property("source_node_uuid", schemas_exports.string()),
  targetNodeUuid: schemas_exports.property("target_node_uuid", schemas_exports.string()),
  uuid: schemas_exports.string(),
  validAt: schemas_exports.property("valid_at", schemas_exports.string().optional())
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/PatternResult.mjs
var PatternResult = schemas_exports.object({
  description: schemas_exports.string().optional(),
  edgeTypes: schemas_exports.property("edge_types", schemas_exports.list(schemas_exports.string()).optional()),
  edges: schemas_exports.list(EntityEdge).optional(),
  nodeLabels: schemas_exports.property("node_labels", schemas_exports.list(schemas_exports.string()).optional()),
  occurrences: schemas_exports.number().optional(),
  type: schemas_exports.string().optional(),
  weightedScore: schemas_exports.property("weighted_score", schemas_exports.number().optional())
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/DetectPatternsResponse.mjs
var DetectPatternsResponse = schemas_exports.object({
  metadata: PatternMetadata.optional(),
  nodes: schemas_exports.list(EntityNode).optional(),
  patterns: schemas_exports.list(PatternResult).optional()
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/EntityPropertyType.mjs
var EntityPropertyType = schemas_exports.enum_(["Text", "Int", "Float", "Boolean"]);

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/EntityProperty.mjs
var EntityProperty = schemas_exports.object({
  description: schemas_exports.string(),
  name: schemas_exports.string(),
  type: EntityPropertyType
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/EntityEdgeSourceTarget.mjs
var EntityEdgeSourceTarget = schemas_exports.object({
  source: schemas_exports.string().optional(),
  target: schemas_exports.string().optional()
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/EdgeType.mjs
var EdgeType = schemas_exports.object({
  description: schemas_exports.string(),
  name: schemas_exports.string(),
  properties: schemas_exports.list(EntityProperty).optional(),
  sourceTargets: schemas_exports.property("source_targets", schemas_exports.list(EntityEdgeSourceTarget).optional())
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/EntityType.mjs
var EntityType = schemas_exports.object({
  description: schemas_exports.string(),
  name: schemas_exports.string(),
  properties: schemas_exports.list(EntityProperty).optional()
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/EntityTypeResponse.mjs
var EntityTypeResponse = schemas_exports.object({
  edgeTypes: schemas_exports.property("edge_types", schemas_exports.list(EdgeType).optional()),
  entityTypes: schemas_exports.property("entity_types", schemas_exports.list(EntityType).optional())
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/GraphDataType.mjs
var GraphDataType = schemas_exports.enum_(["text", "json", "message"]);

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/EpisodeData.mjs
var EpisodeData = schemas_exports.object({
  createdAt: schemas_exports.property("created_at", schemas_exports.string().optional()),
  data: schemas_exports.string(),
  sourceDescription: schemas_exports.property("source_description", schemas_exports.string().optional()),
  type: GraphDataType
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/EpisodeMentions.mjs
var EpisodeMentions = schemas_exports.object({
  edges: schemas_exports.list(EntityEdge).optional(),
  nodes: schemas_exports.list(EntityNode).optional()
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/TaskErrorResponse.mjs
var TaskErrorResponse = schemas_exports.object({
  code: schemas_exports.string().optional(),
  details: schemas_exports.record(schemas_exports.string(), schemas_exports.unknown()).optional(),
  message: schemas_exports.string().optional()
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/TaskProgress.mjs
var TaskProgress = schemas_exports.object({
  message: schemas_exports.string().optional(),
  stage: schemas_exports.string().optional()
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/GetTaskResponse.mjs
var GetTaskResponse = schemas_exports.object({
  completedAt: schemas_exports.property("completed_at", schemas_exports.string().optional()),
  createdAt: schemas_exports.property("created_at", schemas_exports.string().optional()),
  error: TaskErrorResponse.optional(),
  params: schemas_exports.record(schemas_exports.string(), schemas_exports.unknown()).optional(),
  progress: TaskProgress.optional(),
  startedAt: schemas_exports.property("started_at", schemas_exports.string().optional()),
  status: schemas_exports.string().optional(),
  taskId: schemas_exports.property("task_id", schemas_exports.string().optional()),
  type: schemas_exports.string().optional(),
  updatedAt: schemas_exports.property("updated_at", schemas_exports.string().optional())
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/Graph.mjs
var Graph = schemas_exports.object({
  createdAt: schemas_exports.property("created_at", schemas_exports.string().optional()),
  description: schemas_exports.string().optional(),
  graphId: schemas_exports.property("graph_id", schemas_exports.string().optional()),
  id: schemas_exports.number().optional(),
  name: schemas_exports.string().optional(),
  projectUuid: schemas_exports.property("project_uuid", schemas_exports.string().optional()),
  uuid: schemas_exports.string().optional()
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/GraphEdgesRequest.mjs
var GraphEdgesRequest = schemas_exports.object({
  limit: schemas_exports.number().optional(),
  uuidCursor: schemas_exports.property("uuid_cursor", schemas_exports.string().optional())
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/Episode.mjs
var Episode = schemas_exports.object({
  content: schemas_exports.string(),
  createdAt: schemas_exports.property("created_at", schemas_exports.string()),
  metadata: schemas_exports.record(schemas_exports.string(), schemas_exports.unknown()).optional(),
  processed: schemas_exports.boolean().optional(),
  relevance: schemas_exports.number().optional(),
  role: schemas_exports.string().optional(),
  roleType: schemas_exports.property("role_type", RoleType.optional()),
  score: schemas_exports.number().optional(),
  source: GraphDataType.optional(),
  sourceDescription: schemas_exports.property("source_description", schemas_exports.string().optional()),
  taskId: schemas_exports.property("task_id", schemas_exports.string().optional()),
  threadId: schemas_exports.property("thread_id", schemas_exports.string().optional()),
  uuid: schemas_exports.string()
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/EpisodeResponse.mjs
var EpisodeResponse = schemas_exports.object({
  episodes: schemas_exports.list(Episode).optional()
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/GraphListResponse.mjs
var GraphListResponse = schemas_exports.object({
  graphs: schemas_exports.list(Graph).optional(),
  rowCount: schemas_exports.property("row_count", schemas_exports.number().optional()),
  totalCount: schemas_exports.property("total_count", schemas_exports.number().optional())
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/GraphNodesRequest.mjs
var GraphNodesRequest = schemas_exports.object({
  limit: schemas_exports.number().optional(),
  uuidCursor: schemas_exports.property("uuid_cursor", schemas_exports.string().optional())
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/GraphSearchResults.mjs
var GraphSearchResults = schemas_exports.object({
  edges: schemas_exports.list(EntityEdge).optional(),
  episodes: schemas_exports.list(Episode).optional(),
  nodes: schemas_exports.list(EntityNode).optional()
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/ListContextTemplatesResponse.mjs
var ListContextTemplatesResponse = schemas_exports.object({
  templates: schemas_exports.list(ContextTemplateResponse).optional()
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/ListCustomInstructionsResponse.mjs
var ListCustomInstructionsResponse = schemas_exports.object({
  instructions: schemas_exports.list(CustomInstruction).optional()
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/UserInstruction.mjs
var UserInstruction = schemas_exports.object({
  name: schemas_exports.string(),
  text: schemas_exports.string()
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/ListUserInstructionsResponse.mjs
var ListUserInstructionsResponse = schemas_exports.object({
  instructions: schemas_exports.list(UserInstruction).optional()
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/PatternSeeds.mjs
var PatternSeeds = schemas_exports.object({
  edgeTypes: schemas_exports.property("edge_types", schemas_exports.list(schemas_exports.string()).optional()),
  nodeLabels: schemas_exports.property("node_labels", schemas_exports.list(schemas_exports.string()).optional()),
  nodeUuids: schemas_exports.property("node_uuids", schemas_exports.list(schemas_exports.string()).optional())
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/ProjectInfo.mjs
var ProjectInfo = schemas_exports.object({
  createdAt: schemas_exports.property("created_at", schemas_exports.string().optional()),
  description: schemas_exports.string().optional(),
  name: schemas_exports.string().optional(),
  uuid: schemas_exports.string().optional()
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/ProjectInfoResponse.mjs
var ProjectInfoResponse = schemas_exports.object({
  project: ProjectInfo.optional()
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/RecencyWeight.mjs
var RecencyWeight = schemas_exports.enum_(["none", "7_days", "30_days", "90_days"]);

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/SuccessResponse.mjs
var SuccessResponse = schemas_exports.object({
  message: schemas_exports.string().optional()
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/Thread.mjs
var Thread = schemas_exports.object({
  createdAt: schemas_exports.property("created_at", schemas_exports.string().optional()),
  projectUuid: schemas_exports.property("project_uuid", schemas_exports.string().optional()),
  threadId: schemas_exports.property("thread_id", schemas_exports.string().optional()),
  userId: schemas_exports.property("user_id", schemas_exports.string().optional()),
  uuid: schemas_exports.string().optional()
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/ThreadContextResponse.mjs
var ThreadContextResponse = schemas_exports.object({
  context: schemas_exports.string().optional()
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/ThreadListResponse.mjs
var ThreadListResponse = schemas_exports.object({
  responseCount: schemas_exports.property("response_count", schemas_exports.number().optional()),
  threads: schemas_exports.list(Thread).optional(),
  totalCount: schemas_exports.property("total_count", schemas_exports.number().optional())
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/MessageListResponse.mjs
var MessageListResponse = schemas_exports.object({
  messages: schemas_exports.list(Message).optional(),
  rowCount: schemas_exports.property("row_count", schemas_exports.number().optional()),
  threadCreatedAt: schemas_exports.property("thread_created_at", schemas_exports.string().optional()),
  totalCount: schemas_exports.property("total_count", schemas_exports.number().optional()),
  userId: schemas_exports.property("user_id", schemas_exports.string().optional())
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/User.mjs
var User = schemas_exports.object({
  createdAt: schemas_exports.property("created_at", schemas_exports.string().optional()),
  deletedAt: schemas_exports.property("deleted_at", schemas_exports.string().optional()),
  disableDefaultOntology: schemas_exports.property("disable_default_ontology", schemas_exports.boolean().optional()),
  email: schemas_exports.string().optional(),
  firstName: schemas_exports.property("first_name", schemas_exports.string().optional()),
  id: schemas_exports.number().optional(),
  lastName: schemas_exports.property("last_name", schemas_exports.string().optional()),
  metadata: schemas_exports.record(schemas_exports.string(), schemas_exports.unknown()).optional(),
  projectUuid: schemas_exports.property("project_uuid", schemas_exports.string().optional()),
  sessionCount: schemas_exports.property("session_count", schemas_exports.number().optional()),
  updatedAt: schemas_exports.property("updated_at", schemas_exports.string().optional()),
  userId: schemas_exports.property("user_id", schemas_exports.string().optional()),
  uuid: schemas_exports.string().optional()
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/UserListResponse.mjs
var UserListResponse = schemas_exports.object({
  rowCount: schemas_exports.property("row_count", schemas_exports.number().optional()),
  totalCount: schemas_exports.property("total_count", schemas_exports.number().optional()),
  users: schemas_exports.list(User).optional()
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/UserNodeResponse.mjs
var UserNodeResponse = schemas_exports.object({
  node: EntityNode.optional()
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/AddTripleResponse.mjs
var AddTripleResponse = schemas_exports.object({
  edge: EntityEdge.optional(),
  sourceNode: schemas_exports.property("source_node", EntityNode.optional()),
  targetNode: schemas_exports.property("target_node", EntityNode.optional()),
  taskId: schemas_exports.property("task_id", schemas_exports.string().optional())
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/ComparisonOperator.mjs
var ComparisonOperator = schemas_exports.enum_(["=", "<>", ">", "<", ">=", "<=", "IS NULL", "IS NOT NULL"]);

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/DateFilter.mjs
var DateFilter = schemas_exports.object({
  comparisonOperator: schemas_exports.property("comparison_operator", ComparisonOperator),
  date: schemas_exports.string().optional()
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/GraphSearchScope.mjs
var GraphSearchScope = schemas_exports.enum_(["edges", "nodes", "episodes"]);

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/PropertyFilter.mjs
var PropertyFilter = schemas_exports.object({
  comparisonOperator: schemas_exports.property("comparison_operator", ComparisonOperator),
  propertyName: schemas_exports.property("property_name", schemas_exports.string()),
  propertyValue: schemas_exports.property("property_value", schemas_exports.unknown().optional())
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/Reranker.mjs
var Reranker = schemas_exports.enum_([
  "rrf",
  "mmr",
  "node_distance",
  "episode_mentions",
  "cross_encoder"
]);

// node_modules/@getzep/zep-cloud/dist/esm/serialization/types/SearchFilters.mjs
var SearchFilters = schemas_exports.object({
  createdAt: schemas_exports.property("created_at", schemas_exports.list(schemas_exports.list(DateFilter)).optional()),
  edgeTypes: schemas_exports.property("edge_types", schemas_exports.list(schemas_exports.string()).optional()),
  edgeUuids: schemas_exports.property("edge_uuids", schemas_exports.list(schemas_exports.string()).optional()),
  excludeEdgeTypes: schemas_exports.property("exclude_edge_types", schemas_exports.list(schemas_exports.string()).optional()),
  excludeNodeLabels: schemas_exports.property("exclude_node_labels", schemas_exports.list(schemas_exports.string()).optional()),
  expiredAt: schemas_exports.property("expired_at", schemas_exports.list(schemas_exports.list(DateFilter)).optional()),
  invalidAt: schemas_exports.property("invalid_at", schemas_exports.list(schemas_exports.list(DateFilter)).optional()),
  nodeLabels: schemas_exports.property("node_labels", schemas_exports.list(schemas_exports.string()).optional()),
  propertyFilters: schemas_exports.property("property_filters", schemas_exports.list(PropertyFilter).optional()),
  validAt: schemas_exports.property("valid_at", schemas_exports.list(schemas_exports.list(DateFilter)).optional())
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/resources/graph/index.mjs
var graph_exports = {};
__export(graph_exports, {
  AddCustomInstructionsRequest: () => AddCustomInstructionsRequest,
  AddDataBatchRequest: () => AddDataBatchRequest,
  AddDataRequest: () => AddDataRequest,
  AddTripleRequest: () => AddTripleRequest,
  CloneGraphRequest: () => CloneGraphRequest,
  CreateGraphRequest: () => CreateGraphRequest,
  DeleteCustomInstructionsRequest: () => DeleteCustomInstructionsRequest,
  DetectPatternsRequest: () => DetectPatternsRequest,
  EntityTypeRequest: () => EntityTypeRequest,
  GraphSearchQuery: () => GraphSearchQuery,
  UpdateEdgeRequest: () => UpdateEdgeRequest,
  UpdateGraphRequest: () => UpdateGraphRequest,
  UpdateNodeRequest: () => UpdateNodeRequest,
  addBatch: () => addBatch_exports,
  edge: () => edge_exports,
  node: () => node_exports
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/resources/graph/client/addBatch.mjs
var addBatch_exports = {};
__export(addBatch_exports, {
  Response: () => Response
});
var Response = schemas_exports.list(Episode);

// node_modules/@getzep/zep-cloud/dist/esm/serialization/resources/graph/client/requests/AddCustomInstructionsRequest.mjs
var AddCustomInstructionsRequest = schemas_exports.object({
  graphIds: schemas_exports.property("graph_ids", schemas_exports.list(schemas_exports.string()).optional()),
  instructions: schemas_exports.list(CustomInstruction),
  userIds: schemas_exports.property("user_ids", schemas_exports.list(schemas_exports.string()).optional())
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/resources/graph/client/requests/DeleteCustomInstructionsRequest.mjs
var DeleteCustomInstructionsRequest = schemas_exports.object({
  graphIds: schemas_exports.property("graph_ids", schemas_exports.list(schemas_exports.string()).optional()),
  instructionNames: schemas_exports.property("instruction_names", schemas_exports.list(schemas_exports.string()).optional()),
  userIds: schemas_exports.property("user_ids", schemas_exports.list(schemas_exports.string()).optional())
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/resources/graph/client/requests/EntityTypeRequest.mjs
var EntityTypeRequest = schemas_exports.object({
  edgeTypes: schemas_exports.property("edge_types", schemas_exports.list(EdgeType).optional()),
  entityTypes: schemas_exports.property("entity_types", schemas_exports.list(EntityType).optional()),
  graphIds: schemas_exports.property("graph_ids", schemas_exports.list(schemas_exports.string()).optional()),
  userIds: schemas_exports.property("user_ids", schemas_exports.list(schemas_exports.string()).optional())
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/resources/graph/client/requests/AddDataRequest.mjs
var AddDataRequest = schemas_exports.object({
  createdAt: schemas_exports.property("created_at", schemas_exports.string().optional()),
  data: schemas_exports.string(),
  graphId: schemas_exports.property("graph_id", schemas_exports.string().optional()),
  sourceDescription: schemas_exports.property("source_description", schemas_exports.string().optional()),
  type: GraphDataType,
  userId: schemas_exports.property("user_id", schemas_exports.string().optional())
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/resources/graph/client/requests/AddDataBatchRequest.mjs
var AddDataBatchRequest = schemas_exports.object({
  episodes: schemas_exports.list(EpisodeData),
  graphId: schemas_exports.property("graph_id", schemas_exports.string().optional()),
  userId: schemas_exports.property("user_id", schemas_exports.string().optional())
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/resources/graph/client/requests/AddTripleRequest.mjs
var AddTripleRequest = schemas_exports.object({
  createdAt: schemas_exports.property("created_at", schemas_exports.string().optional()),
  edgeAttributes: schemas_exports.property("edge_attributes", schemas_exports.record(schemas_exports.string(), schemas_exports.unknown()).optional()),
  expiredAt: schemas_exports.property("expired_at", schemas_exports.string().optional()),
  fact: schemas_exports.string(),
  factName: schemas_exports.property("fact_name", schemas_exports.string()),
  factUuid: schemas_exports.property("fact_uuid", schemas_exports.string().optional()),
  graphId: schemas_exports.property("graph_id", schemas_exports.string().optional()),
  invalidAt: schemas_exports.property("invalid_at", schemas_exports.string().optional()),
  sourceNodeAttributes: schemas_exports.property("source_node_attributes", schemas_exports.record(schemas_exports.string(), schemas_exports.unknown()).optional()),
  sourceNodeLabels: schemas_exports.property("source_node_labels", schemas_exports.list(schemas_exports.string()).optional()),
  sourceNodeName: schemas_exports.property("source_node_name", schemas_exports.string().optional()),
  sourceNodeSummary: schemas_exports.property("source_node_summary", schemas_exports.string().optional()),
  sourceNodeUuid: schemas_exports.property("source_node_uuid", schemas_exports.string().optional()),
  targetNodeAttributes: schemas_exports.property("target_node_attributes", schemas_exports.record(schemas_exports.string(), schemas_exports.unknown()).optional()),
  targetNodeLabels: schemas_exports.property("target_node_labels", schemas_exports.list(schemas_exports.string()).optional()),
  targetNodeName: schemas_exports.property("target_node_name", schemas_exports.string().optional()),
  targetNodeSummary: schemas_exports.property("target_node_summary", schemas_exports.string().optional()),
  targetNodeUuid: schemas_exports.property("target_node_uuid", schemas_exports.string().optional()),
  userId: schemas_exports.property("user_id", schemas_exports.string().optional()),
  validAt: schemas_exports.property("valid_at", schemas_exports.string().optional())
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/resources/graph/client/requests/CloneGraphRequest.mjs
var CloneGraphRequest = schemas_exports.object({
  sourceGraphId: schemas_exports.property("source_graph_id", schemas_exports.string().optional()),
  sourceUserId: schemas_exports.property("source_user_id", schemas_exports.string().optional()),
  targetGraphId: schemas_exports.property("target_graph_id", schemas_exports.string().optional()),
  targetUserId: schemas_exports.property("target_user_id", schemas_exports.string().optional())
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/resources/graph/client/requests/CreateGraphRequest.mjs
var CreateGraphRequest = schemas_exports.object({
  description: schemas_exports.string().optional(),
  graphId: schemas_exports.property("graph_id", schemas_exports.string()),
  name: schemas_exports.string().optional()
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/resources/graph/client/requests/DetectPatternsRequest.mjs
var DetectPatternsRequest = schemas_exports.object({
  detect: DetectConfig.optional(),
  edgeLimit: schemas_exports.property("edge_limit", schemas_exports.number().optional()),
  graphId: schemas_exports.property("graph_id", schemas_exports.string().optional()),
  limit: schemas_exports.number().optional(),
  minOccurrences: schemas_exports.property("min_occurrences", schemas_exports.number().optional()),
  query: schemas_exports.string().optional(),
  queryLimit: schemas_exports.property("query_limit", schemas_exports.number().optional()),
  recencyWeight: schemas_exports.property("recency_weight", RecencyWeight.optional()),
  searchFilters: schemas_exports.property("search_filters", SearchFilters.optional()),
  seeds: PatternSeeds.optional(),
  userId: schemas_exports.property("user_id", schemas_exports.string().optional())
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/resources/graph/client/requests/GraphSearchQuery.mjs
var GraphSearchQuery = schemas_exports.object({
  bfsOriginNodeUuids: schemas_exports.property("bfs_origin_node_uuids", schemas_exports.list(schemas_exports.string()).optional()),
  centerNodeUuid: schemas_exports.property("center_node_uuid", schemas_exports.string().optional()),
  graphId: schemas_exports.property("graph_id", schemas_exports.string().optional()),
  limit: schemas_exports.number().optional(),
  mmrLambda: schemas_exports.property("mmr_lambda", schemas_exports.number().optional()),
  query: schemas_exports.string(),
  reranker: Reranker.optional(),
  scope: GraphSearchScope.optional(),
  searchFilters: schemas_exports.property("search_filters", SearchFilters.optional()),
  userId: schemas_exports.property("user_id", schemas_exports.string().optional())
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/resources/graph/client/requests/UpdateGraphRequest.mjs
var UpdateGraphRequest = schemas_exports.object({
  description: schemas_exports.string().optional(),
  name: schemas_exports.string().optional()
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/resources/graph/resources/edge/index.mjs
var edge_exports = {};
__export(edge_exports, {
  UpdateEdgeRequest: () => UpdateEdgeRequest,
  getByGraphId: () => getByGraphId_exports,
  getByUserId: () => getByUserId_exports
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/resources/graph/resources/edge/client/getByGraphId.mjs
var getByGraphId_exports = {};
__export(getByGraphId_exports, {
  Response: () => Response2
});
var Response2 = schemas_exports.list(EntityEdge);

// node_modules/@getzep/zep-cloud/dist/esm/serialization/resources/graph/resources/edge/client/getByUserId.mjs
var getByUserId_exports = {};
__export(getByUserId_exports, {
  Response: () => Response3
});
var Response3 = schemas_exports.list(EntityEdge);

// node_modules/@getzep/zep-cloud/dist/esm/serialization/resources/graph/resources/edge/client/requests/UpdateEdgeRequest.mjs
var UpdateEdgeRequest = schemas_exports.object({
  attributes: schemas_exports.record(schemas_exports.string(), schemas_exports.unknown()).optional(),
  expiredAt: schemas_exports.property("expired_at", schemas_exports.string().optional()),
  fact: schemas_exports.string().optional(),
  invalidAt: schemas_exports.property("invalid_at", schemas_exports.string().optional()),
  name: schemas_exports.string().optional(),
  validAt: schemas_exports.property("valid_at", schemas_exports.string().optional())
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/resources/graph/resources/node/index.mjs
var node_exports = {};
__export(node_exports, {
  UpdateNodeRequest: () => UpdateNodeRequest,
  getByGraphId: () => getByGraphId_exports2,
  getByUserId: () => getByUserId_exports2,
  getEdges: () => getEdges_exports
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/resources/graph/resources/node/client/getByGraphId.mjs
var getByGraphId_exports2 = {};
__export(getByGraphId_exports2, {
  Response: () => Response4
});
var Response4 = schemas_exports.list(EntityNode);

// node_modules/@getzep/zep-cloud/dist/esm/serialization/resources/graph/resources/node/client/getByUserId.mjs
var getByUserId_exports2 = {};
__export(getByUserId_exports2, {
  Response: () => Response5
});
var Response5 = schemas_exports.list(EntityNode);

// node_modules/@getzep/zep-cloud/dist/esm/serialization/resources/graph/resources/node/client/getEdges.mjs
var getEdges_exports = {};
__export(getEdges_exports, {
  Response: () => Response6
});
var Response6 = schemas_exports.list(EntityEdge);

// node_modules/@getzep/zep-cloud/dist/esm/serialization/resources/graph/resources/node/client/requests/UpdateNodeRequest.mjs
var UpdateNodeRequest = schemas_exports.object({
  attributes: schemas_exports.record(schemas_exports.string(), schemas_exports.unknown()).optional(),
  labels: schemas_exports.list(schemas_exports.string()).optional(),
  name: schemas_exports.string().optional(),
  summary: schemas_exports.string().optional()
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/resources/user/index.mjs
var user_exports = {};
__export(user_exports, {
  AddUserInstructionsRequest: () => AddUserInstructionsRequest,
  CreateUserRequest: () => CreateUserRequest,
  DeleteUserInstructionsRequest: () => DeleteUserInstructionsRequest,
  UpdateUserRequest: () => UpdateUserRequest,
  getThreads: () => getThreads_exports
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/resources/user/client/getThreads.mjs
var getThreads_exports = {};
__export(getThreads_exports, {
  Response: () => Response7
});
var Response7 = schemas_exports.list(Thread);

// node_modules/@getzep/zep-cloud/dist/esm/serialization/resources/user/client/requests/AddUserInstructionsRequest.mjs
var AddUserInstructionsRequest = schemas_exports.object({
  instructions: schemas_exports.list(UserInstruction),
  userIds: schemas_exports.property("user_ids", schemas_exports.list(schemas_exports.string()).optional())
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/resources/user/client/requests/DeleteUserInstructionsRequest.mjs
var DeleteUserInstructionsRequest = schemas_exports.object({
  instructionNames: schemas_exports.property("instruction_names", schemas_exports.list(schemas_exports.string()).optional()),
  userIds: schemas_exports.property("user_ids", schemas_exports.list(schemas_exports.string()).optional())
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/resources/user/client/requests/CreateUserRequest.mjs
var CreateUserRequest = schemas_exports.object({
  disableDefaultOntology: schemas_exports.property("disable_default_ontology", schemas_exports.boolean().optional()),
  email: schemas_exports.string().optional(),
  firstName: schemas_exports.property("first_name", schemas_exports.string().optional()),
  lastName: schemas_exports.property("last_name", schemas_exports.string().optional()),
  metadata: schemas_exports.record(schemas_exports.string(), schemas_exports.unknown()).optional(),
  userId: schemas_exports.property("user_id", schemas_exports.string())
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/resources/user/client/requests/UpdateUserRequest.mjs
var UpdateUserRequest = schemas_exports.object({
  disableDefaultOntology: schemas_exports.property("disable_default_ontology", schemas_exports.boolean().optional()),
  email: schemas_exports.string().optional(),
  firstName: schemas_exports.property("first_name", schemas_exports.string().optional()),
  lastName: schemas_exports.property("last_name", schemas_exports.string().optional()),
  metadata: schemas_exports.record(schemas_exports.string(), schemas_exports.unknown()).optional()
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/resources/context/client/requests/CreateContextTemplateRequest.mjs
var CreateContextTemplateRequest = schemas_exports.object({
  template: schemas_exports.string(),
  templateId: schemas_exports.property("template_id", schemas_exports.string())
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/resources/context/client/requests/UpdateContextTemplateRequest.mjs
var UpdateContextTemplateRequest = schemas_exports.object({
  template: schemas_exports.string()
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/resources/thread/index.mjs
var thread_exports = {};
__export(thread_exports, {
  CreateThreadRequest: () => CreateThreadRequest,
  ThreadMessageUpdate: () => ThreadMessageUpdate,
  message: () => message_exports
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/resources/thread/client/requests/CreateThreadRequest.mjs
var CreateThreadRequest = schemas_exports.object({
  threadId: schemas_exports.property("thread_id", schemas_exports.string()),
  userId: schemas_exports.property("user_id", schemas_exports.string())
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/resources/thread/resources/message/index.mjs
var message_exports = {};
__export(message_exports, {
  ThreadMessageUpdate: () => ThreadMessageUpdate
});

// node_modules/@getzep/zep-cloud/dist/esm/serialization/resources/thread/resources/message/client/requests/ThreadMessageUpdate.mjs
var ThreadMessageUpdate = schemas_exports.object({
  metadata: schemas_exports.record(schemas_exports.string(), schemas_exports.unknown())
});

// node_modules/@getzep/zep-cloud/dist/esm/core/headers.mjs
function mergeHeaders(...headersArray) {
  const result = {};
  for (const [key, value] of headersArray.filter((headers) => headers != null).flatMap((headers) => Object.entries(headers))) {
    if (value != null) {
      result[key] = value;
    } else if (key in result) {
      delete result[key];
    }
  }
  return result;
}
function mergeOnlyDefinedHeaders(...headersArray) {
  const result = {};
  for (const [key, value] of headersArray.filter((headers) => headers != null).flatMap((headers) => Object.entries(headers))) {
    if (value != null) {
      result[key] = value;
    }
  }
  return result;
}

// node_modules/@getzep/zep-cloud/dist/esm/environments.mjs
var ZepEnvironment = {
  Default: "https://api.getzep.com/api/v2"
};

// node_modules/@getzep/zep-cloud/dist/esm/api/resources/context/client/Client.mjs
var __awaiter10 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var Context = class {
  constructor(_options = {}) {
    this._options = _options;
  }
  /**
   * Lists all context templates.
   *
   * @param {Context.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.context.listContextTemplates()
   */
  listContextTemplates(requestOptions) {
    return HttpResponsePromise.fromPromise(this.__listContextTemplates(requestOptions));
  }
  __listContextTemplates(requestOptions) {
    return __awaiter10(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, "context-templates"),
        method: "GET",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: ListContextTemplatesResponse.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling GET /context-templates.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Creates a new context template.
   *
   * @param {Zep.CreateContextTemplateRequest} request
   * @param {Context.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.context.createContextTemplate({
   *         template: "template",
   *         templateId: "template_id"
   *     })
   */
  createContextTemplate(request, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__createContextTemplate(request, requestOptions));
  }
  __createContextTemplate(request, requestOptions) {
    return __awaiter10(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, "context-templates"),
        method: "POST",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        contentType: "application/json",
        requestType: "json",
        body: CreateContextTemplateRequest.jsonOrThrow(request, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: true
        }),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: ContextTemplateResponse.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling POST /context-templates.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Retrieves a context template by template_id.
   *
   * @param {string} templateId - Template ID
   * @param {Context.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.NotFoundError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.context.getContextTemplate("template_id")
   */
  getContextTemplate(templateId, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__getContextTemplate(templateId, requestOptions));
  }
  __getContextTemplate(templateId, requestOptions) {
    return __awaiter10(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, `context-templates/${encodeURIComponent(templateId)}`),
        method: "GET",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: ContextTemplateResponse.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 404:
            throw new NotFoundError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling GET /context-templates/{template_id}.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Updates an existing context template by template_id.
   *
   * @param {string} templateId - Template ID
   * @param {Zep.UpdateContextTemplateRequest} request
   * @param {Context.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.NotFoundError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.context.updateContextTemplate("template_id", {
   *         template: "template"
   *     })
   */
  updateContextTemplate(templateId, request, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__updateContextTemplate(templateId, request, requestOptions));
  }
  __updateContextTemplate(templateId, request, requestOptions) {
    return __awaiter10(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, `context-templates/${encodeURIComponent(templateId)}`),
        method: "PUT",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        contentType: "application/json",
        requestType: "json",
        body: UpdateContextTemplateRequest.jsonOrThrow(request, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: true
        }),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: ContextTemplateResponse.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 404:
            throw new NotFoundError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling PUT /context-templates/{template_id}.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Deletes a context template by template_id.
   *
   * @param {string} templateId - Template ID
   * @param {Context.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.NotFoundError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.context.deleteContextTemplate("template_id")
   */
  deleteContextTemplate(templateId, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__deleteContextTemplate(templateId, requestOptions));
  }
  __deleteContextTemplate(templateId, requestOptions) {
    return __awaiter10(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, `context-templates/${encodeURIComponent(templateId)}`),
        method: "DELETE",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: SuccessResponse.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 404:
            throw new NotFoundError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling DELETE /context-templates/{template_id}.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  _getCustomAuthorizationHeaders() {
    return __awaiter10(this, void 0, void 0, function* () {
      var _a;
      const apiKeyValue = (_a = yield Supplier.get(this._options.apiKey)) !== null && _a !== void 0 ? _a : process === null || process === void 0 ? void 0 : process.env["ZEP_API_KEY"];
      return { Authorization: `Api-Key ${apiKeyValue}` };
    });
  }
};

// node_modules/@getzep/zep-cloud/dist/esm/api/resources/graph/resources/edge/client/Client.mjs
var __awaiter11 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var Edge = class {
  constructor(_options = {}) {
    this._options = _options;
  }
  /**
   * Returns all edges for a graph.
   *
   * @param {string} graphId - Graph ID
   * @param {Zep.GraphEdgesRequest} request
   * @param {Edge.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.graph.edge.getByGraphId("graph_id", {})
   */
  getByGraphId(graphId, request, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__getByGraphId(graphId, request, requestOptions));
  }
  __getByGraphId(graphId, request, requestOptions) {
    return __awaiter11(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, `graph/edge/graph/${encodeURIComponent(graphId)}`),
        method: "POST",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        contentType: "application/json",
        requestType: "json",
        body: GraphEdgesRequest.jsonOrThrow(request, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: true
        }),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: graph_exports.edge.getByGraphId.Response.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling POST /graph/edge/graph/{graph_id}.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Returns all edges for a user.
   *
   * @param {string} userId - User ID
   * @param {Zep.GraphEdgesRequest} request
   * @param {Edge.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.graph.edge.getByUserId("user_id", {})
   */
  getByUserId(userId, request, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__getByUserId(userId, request, requestOptions));
  }
  __getByUserId(userId, request, requestOptions) {
    return __awaiter11(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, `graph/edge/user/${encodeURIComponent(userId)}`),
        method: "POST",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        contentType: "application/json",
        requestType: "json",
        body: GraphEdgesRequest.jsonOrThrow(request, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: true
        }),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: graph_exports.edge.getByUserId.Response.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling POST /graph/edge/user/{user_id}.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Returns a specific edge by its UUID.
   *
   * @param {string} uuid - Edge UUID
   * @param {Edge.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.NotFoundError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.graph.edge.get("uuid")
   */
  get(uuid, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__get(uuid, requestOptions));
  }
  __get(uuid, requestOptions) {
    return __awaiter11(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, `graph/edge/${encodeURIComponent(uuid)}`),
        method: "GET",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: EntityEdge.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 404:
            throw new NotFoundError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling GET /graph/edge/{uuid}.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Deletes an edge by UUID.
   *
   * @param {string} uuid - Edge UUID
   * @param {Edge.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.NotFoundError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.graph.edge.delete("uuid")
   */
  delete(uuid, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__delete(uuid, requestOptions));
  }
  __delete(uuid, requestOptions) {
    return __awaiter11(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, `graph/edge/${encodeURIComponent(uuid)}`),
        method: "DELETE",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: SuccessResponse.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 404:
            throw new NotFoundError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling DELETE /graph/edge/{uuid}.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Updates an entity edge by UUID.
   *
   * @param {string} uuid - Edge UUID
   * @param {Zep.graph.UpdateEdgeRequest} request
   * @param {Edge.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.NotFoundError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.graph.edge.update("uuid")
   */
  update(uuid, request = {}, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__update(uuid, request, requestOptions));
  }
  __update(uuid_1) {
    return __awaiter11(this, arguments, void 0, function* (uuid, request = {}, requestOptions) {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, `graph/edge/${encodeURIComponent(uuid)}`),
        method: "PATCH",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        contentType: "application/json",
        requestType: "json",
        body: graph_exports.UpdateEdgeRequest.jsonOrThrow(request, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: true
        }),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: EntityEdge.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 404:
            throw new NotFoundError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling PATCH /graph/edge/{uuid}.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  _getCustomAuthorizationHeaders() {
    return __awaiter11(this, void 0, void 0, function* () {
      var _a;
      const apiKeyValue = (_a = yield Supplier.get(this._options.apiKey)) !== null && _a !== void 0 ? _a : process === null || process === void 0 ? void 0 : process.env["ZEP_API_KEY"];
      return { Authorization: `Api-Key ${apiKeyValue}` };
    });
  }
};

// node_modules/@getzep/zep-cloud/dist/esm/api/resources/graph/resources/episode/client/Client.mjs
var __awaiter12 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var Episode2 = class {
  constructor(_options = {}) {
    this._options = _options;
  }
  /**
   * Returns episodes by graph id.
   *
   * @param {string} graphId - Graph ID
   * @param {Zep.graph.EpisodeGetByGraphIdRequest} request
   * @param {Episode.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.graph.episode.getByGraphId("graph_id", {
   *         lastn: 1
   *     })
   */
  getByGraphId(graphId, request = {}, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__getByGraphId(graphId, request, requestOptions));
  }
  __getByGraphId(graphId_1) {
    return __awaiter12(this, arguments, void 0, function* (graphId, request = {}, requestOptions) {
      var _a, _b, _c, _d;
      const { lastn } = request;
      const _queryParams = {};
      if (lastn != null) {
        _queryParams["lastn"] = lastn.toString();
      }
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, `graph/episodes/graph/${encodeURIComponent(graphId)}`),
        method: "GET",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        queryParameters: _queryParams,
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: EpisodeResponse.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling GET /graph/episodes/graph/{graph_id}.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Returns episodes by user id.
   *
   * @param {string} userId - User ID
   * @param {Zep.graph.EpisodeGetByUserIdRequest} request
   * @param {Episode.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.graph.episode.getByUserId("user_id", {
   *         lastn: 1
   *     })
   */
  getByUserId(userId, request = {}, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__getByUserId(userId, request, requestOptions));
  }
  __getByUserId(userId_1) {
    return __awaiter12(this, arguments, void 0, function* (userId, request = {}, requestOptions) {
      var _a, _b, _c, _d;
      const { lastn } = request;
      const _queryParams = {};
      if (lastn != null) {
        _queryParams["lastn"] = lastn.toString();
      }
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, `graph/episodes/user/${encodeURIComponent(userId)}`),
        method: "GET",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        queryParameters: _queryParams,
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: EpisodeResponse.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling GET /graph/episodes/user/{user_id}.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Returns episodes by UUID
   *
   * @param {string} uuid - Episode UUID
   * @param {Episode.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.graph.episode.get("uuid")
   */
  get(uuid, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__get(uuid, requestOptions));
  }
  __get(uuid, requestOptions) {
    return __awaiter12(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, `graph/episodes/${encodeURIComponent(uuid)}`),
        method: "GET",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: Episode.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling GET /graph/episodes/{uuid}.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Deletes an episode by its UUID.
   *
   * @param {string} uuid - Episode UUID
   * @param {Episode.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.NotFoundError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.graph.episode.delete("uuid")
   */
  delete(uuid, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__delete(uuid, requestOptions));
  }
  __delete(uuid, requestOptions) {
    return __awaiter12(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, `graph/episodes/${encodeURIComponent(uuid)}`),
        method: "DELETE",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: SuccessResponse.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 404:
            throw new NotFoundError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling DELETE /graph/episodes/{uuid}.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Returns nodes and edges mentioned in an episode
   *
   * @param {string} uuid - Episode uuid
   * @param {Episode.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.graph.episode.getNodesAndEdges("uuid")
   */
  getNodesAndEdges(uuid, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__getNodesAndEdges(uuid, requestOptions));
  }
  __getNodesAndEdges(uuid, requestOptions) {
    return __awaiter12(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, `graph/episodes/${encodeURIComponent(uuid)}/mentions`),
        method: "GET",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: EpisodeMentions.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling GET /graph/episodes/{uuid}/mentions.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  _getCustomAuthorizationHeaders() {
    return __awaiter12(this, void 0, void 0, function* () {
      var _a;
      const apiKeyValue = (_a = yield Supplier.get(this._options.apiKey)) !== null && _a !== void 0 ? _a : process === null || process === void 0 ? void 0 : process.env["ZEP_API_KEY"];
      return { Authorization: `Api-Key ${apiKeyValue}` };
    });
  }
};

// node_modules/@getzep/zep-cloud/dist/esm/api/resources/graph/resources/node/client/Client.mjs
var __awaiter13 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var Node = class {
  constructor(_options = {}) {
    this._options = _options;
  }
  /**
   * Returns all nodes for a graph.
   *
   * @param {string} graphId - Graph ID
   * @param {Zep.GraphNodesRequest} request
   * @param {Node.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.graph.node.getByGraphId("graph_id", {})
   */
  getByGraphId(graphId, request, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__getByGraphId(graphId, request, requestOptions));
  }
  __getByGraphId(graphId, request, requestOptions) {
    return __awaiter13(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, `graph/node/graph/${encodeURIComponent(graphId)}`),
        method: "POST",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        contentType: "application/json",
        requestType: "json",
        body: GraphNodesRequest.jsonOrThrow(request, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: true
        }),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: graph_exports.node.getByGraphId.Response.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling POST /graph/node/graph/{graph_id}.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Returns all nodes for a user
   *
   * @param {string} userId - User ID
   * @param {Zep.GraphNodesRequest} request
   * @param {Node.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.graph.node.getByUserId("user_id", {})
   */
  getByUserId(userId, request, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__getByUserId(userId, request, requestOptions));
  }
  __getByUserId(userId, request, requestOptions) {
    return __awaiter13(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, `graph/node/user/${encodeURIComponent(userId)}`),
        method: "POST",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        contentType: "application/json",
        requestType: "json",
        body: GraphNodesRequest.jsonOrThrow(request, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: true
        }),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: graph_exports.node.getByUserId.Response.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling POST /graph/node/user/{user_id}.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Returns all edges for a node
   *
   * @param {string} nodeUuid - Node UUID
   * @param {Node.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.graph.node.getEdges("node_uuid")
   */
  getEdges(nodeUuid, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__getEdges(nodeUuid, requestOptions));
  }
  __getEdges(nodeUuid, requestOptions) {
    return __awaiter13(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, `graph/node/${encodeURIComponent(nodeUuid)}/entity-edges`),
        method: "GET",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: graph_exports.node.getEdges.Response.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling GET /graph/node/{node_uuid}/entity-edges.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Returns all episodes that mentioned a given node
   *
   * @param {string} nodeUuid - Node UUID
   * @param {Node.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.graph.node.getEpisodes("node_uuid")
   */
  getEpisodes(nodeUuid, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__getEpisodes(nodeUuid, requestOptions));
  }
  __getEpisodes(nodeUuid, requestOptions) {
    return __awaiter13(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, `graph/node/${encodeURIComponent(nodeUuid)}/episodes`),
        method: "GET",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: EpisodeResponse.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling GET /graph/node/{node_uuid}/episodes.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Returns a specific node by its UUID.
   *
   * @param {string} uuid - Node UUID
   * @param {Node.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.NotFoundError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.graph.node.get("uuid")
   */
  get(uuid, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__get(uuid, requestOptions));
  }
  __get(uuid, requestOptions) {
    return __awaiter13(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, `graph/node/${encodeURIComponent(uuid)}`),
        method: "GET",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: EntityNode.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 404:
            throw new NotFoundError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling GET /graph/node/{uuid}.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Deletes a node by UUID.
   *
   * @param {string} uuid - Node UUID
   * @param {Node.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.NotFoundError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.graph.node.delete("uuid")
   */
  delete(uuid, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__delete(uuid, requestOptions));
  }
  __delete(uuid, requestOptions) {
    return __awaiter13(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, `graph/node/${encodeURIComponent(uuid)}`),
        method: "DELETE",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: SuccessResponse.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 404:
            throw new NotFoundError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling DELETE /graph/node/{uuid}.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Updates an entity node by UUID.
   *
   * @param {string} uuid - Node UUID
   * @param {Zep.graph.UpdateNodeRequest} request
   * @param {Node.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.NotFoundError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.graph.node.update("uuid")
   */
  update(uuid, request = {}, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__update(uuid, request, requestOptions));
  }
  __update(uuid_1) {
    return __awaiter13(this, arguments, void 0, function* (uuid, request = {}, requestOptions) {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, `graph/node/${encodeURIComponent(uuid)}`),
        method: "PATCH",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        contentType: "application/json",
        requestType: "json",
        body: graph_exports.UpdateNodeRequest.jsonOrThrow(request, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: true
        }),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: EntityNode.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 404:
            throw new NotFoundError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling PATCH /graph/node/{uuid}.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  _getCustomAuthorizationHeaders() {
    return __awaiter13(this, void 0, void 0, function* () {
      var _a;
      const apiKeyValue = (_a = yield Supplier.get(this._options.apiKey)) !== null && _a !== void 0 ? _a : process === null || process === void 0 ? void 0 : process.env["ZEP_API_KEY"];
      return { Authorization: `Api-Key ${apiKeyValue}` };
    });
  }
};

// node_modules/@getzep/zep-cloud/dist/esm/api/resources/graph/client/Client.mjs
var __awaiter14 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var Graph2 = class {
  constructor(_options = {}) {
    this._options = _options;
  }
  get edge() {
    var _a;
    return (_a = this._edge) !== null && _a !== void 0 ? _a : this._edge = new Edge(this._options);
  }
  get episode() {
    var _a;
    return (_a = this._episode) !== null && _a !== void 0 ? _a : this._episode = new Episode2(this._options);
  }
  get node() {
    var _a;
    return (_a = this._node) !== null && _a !== void 0 ? _a : this._node = new Node(this._options);
  }
  /**
   * Lists all custom instructions for a project, user, or graph.
   *
   * @param {Zep.GraphListCustomInstructionsRequest} request
   * @param {Graph.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.NotFoundError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.graph.listCustomInstructions({
   *         userId: "user_id",
   *         graphId: "graph_id"
   *     })
   */
  listCustomInstructions(request = {}, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__listCustomInstructions(request, requestOptions));
  }
  __listCustomInstructions() {
    return __awaiter14(this, arguments, void 0, function* (request = {}, requestOptions) {
      var _a, _b, _c, _d;
      const { userId, graphId } = request;
      const _queryParams = {};
      if (userId != null) {
        _queryParams["user_id"] = userId;
      }
      if (graphId != null) {
        _queryParams["graph_id"] = graphId;
      }
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, "custom-instructions"),
        method: "GET",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        queryParameters: _queryParams,
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: ListCustomInstructionsResponse.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 404:
            throw new NotFoundError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling GET /custom-instructions.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Adds new custom instructions for graphs without removing existing ones. If user_ids or graph_ids is empty, adds to project-wide default instructions.
   *
   * @param {Zep.AddCustomInstructionsRequest} request
   * @param {Graph.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.NotFoundError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.graph.addCustomInstructions({
   *         instructions: [{
   *                 name: "name",
   *                 text: "text"
   *             }]
   *     })
   */
  addCustomInstructions(request, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__addCustomInstructions(request, requestOptions));
  }
  __addCustomInstructions(request, requestOptions) {
    return __awaiter14(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, "custom-instructions"),
        method: "POST",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        contentType: "application/json",
        requestType: "json",
        body: AddCustomInstructionsRequest.jsonOrThrow(request, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: true
        }),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: SuccessResponse.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 404:
            throw new NotFoundError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling POST /custom-instructions.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Deletes custom instructions for graphs or project wide defaults.
   *
   * @param {Zep.DeleteCustomInstructionsRequest} request
   * @param {Graph.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.NotFoundError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.graph.deleteCustomInstructions()
   */
  deleteCustomInstructions(request = {}, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__deleteCustomInstructions(request, requestOptions));
  }
  __deleteCustomInstructions() {
    return __awaiter14(this, arguments, void 0, function* (request = {}, requestOptions) {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, "custom-instructions"),
        method: "DELETE",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        contentType: "application/json",
        requestType: "json",
        body: DeleteCustomInstructionsRequest.jsonOrThrow(request, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: true
        }),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: SuccessResponse.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 404:
            throw new NotFoundError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling DELETE /custom-instructions.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Returns all entity types for a project, user, or graph.
   *
   * @param {Zep.GraphListEntityTypesRequest} request
   * @param {Graph.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.NotFoundError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.graph.listEntityTypes({
   *         userId: "user_id",
   *         graphId: "graph_id"
   *     })
   */
  listEntityTypes(request = {}, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__listEntityTypes(request, requestOptions));
  }
  __listEntityTypes() {
    return __awaiter14(this, arguments, void 0, function* (request = {}, requestOptions) {
      var _a, _b, _c, _d;
      const { userId, graphId } = request;
      const _queryParams = {};
      if (userId != null) {
        _queryParams["user_id"] = userId;
      }
      if (graphId != null) {
        _queryParams["graph_id"] = graphId;
      }
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, "entity-types"),
        method: "GET",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        queryParameters: _queryParams,
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: EntityTypeResponse.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 404:
            throw new NotFoundError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling GET /entity-types.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Sets the entity types for multiple users and graphs, replacing any existing ones.
   *
   * @param {Zep.EntityTypeRequest} request
   * @param {Graph.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.NotFoundError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.graph.setEntityTypesInternal()
   */
  setEntityTypesInternal(request = {}, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__setEntityTypesInternal(request, requestOptions));
  }
  __setEntityTypesInternal() {
    return __awaiter14(this, arguments, void 0, function* (request = {}, requestOptions) {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, "entity-types"),
        method: "PUT",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        contentType: "application/json",
        requestType: "json",
        body: EntityTypeRequest.jsonOrThrow(request, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: true
        }),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: SuccessResponse.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 404:
            throw new NotFoundError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling PUT /entity-types.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Add data to the graph.
   *
   * @param {Zep.AddDataRequest} request
   * @param {Graph.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.graph.add({
   *         data: "data",
   *         type: "text"
   *     })
   */
  add(request, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__add(request, requestOptions));
  }
  __add(request, requestOptions) {
    return __awaiter14(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, "graph"),
        method: "POST",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        contentType: "application/json",
        requestType: "json",
        body: AddDataRequest.jsonOrThrow(request, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: true
        }),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: Episode.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling POST /graph.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Add data to the graph in batch mode. Episodes are processed sequentially in the order provided.
   *
   * @param {Zep.AddDataBatchRequest} request
   * @param {Graph.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.graph.addBatch({
   *         episodes: [{
   *                 data: "data",
   *                 type: "text"
   *             }]
   *     })
   */
  addBatch(request, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__addBatch(request, requestOptions));
  }
  __addBatch(request, requestOptions) {
    return __awaiter14(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, "graph-batch"),
        method: "POST",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        contentType: "application/json",
        requestType: "json",
        body: AddDataBatchRequest.jsonOrThrow(request, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: true
        }),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: graph_exports.addBatch.Response.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling POST /graph-batch.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Add a fact triple for a user or group
   *
   * @param {Zep.AddTripleRequest} request
   * @param {Graph.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.graph.addFactTriple({
   *         fact: "fact",
   *         factName: "fact_name"
   *     })
   */
  addFactTriple(request, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__addFactTriple(request, requestOptions));
  }
  __addFactTriple(request, requestOptions) {
    return __awaiter14(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, "graph/add-fact-triple"),
        method: "POST",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        contentType: "application/json",
        requestType: "json",
        body: AddTripleRequest.jsonOrThrow(request, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: true
        }),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: AddTripleResponse.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling POST /graph/add-fact-triple.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Clone a user or group graph.
   *
   * @param {Zep.CloneGraphRequest} request
   * @param {Graph.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.graph.clone()
   */
  clone(request = {}, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__clone(request, requestOptions));
  }
  __clone() {
    return __awaiter14(this, arguments, void 0, function* (request = {}, requestOptions) {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, "graph/clone"),
        method: "POST",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        contentType: "application/json",
        requestType: "json",
        body: CloneGraphRequest.jsonOrThrow(request, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: true
        }),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: CloneGraphResponse.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling POST /graph/clone.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Creates a new graph.
   *
   * @param {Zep.CreateGraphRequest} request
   * @param {Graph.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.graph.create({
   *         graphId: "graph_id"
   *     })
   */
  create(request, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__create(request, requestOptions));
  }
  __create(request, requestOptions) {
    return __awaiter14(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, "graph/create"),
        method: "POST",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        contentType: "application/json",
        requestType: "json",
        body: CreateGraphRequest.jsonOrThrow(request, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: true
        }),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: Graph.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling POST /graph/create.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Returns all graphs. In order to list users, use user.list_ordered instead
   *
   * @param {Zep.GraphListAllRequest} request
   * @param {Graph.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.graph.listAll({
   *         pageNumber: 1,
   *         pageSize: 1,
   *         orderBy: "order_by",
   *         asc: true
   *     })
   */
  listAll(request = {}, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__listAll(request, requestOptions));
  }
  __listAll() {
    return __awaiter14(this, arguments, void 0, function* (request = {}, requestOptions) {
      var _a, _b, _c, _d;
      const { pageNumber, pageSize, orderBy, asc } = request;
      const _queryParams = {};
      if (pageNumber != null) {
        _queryParams["pageNumber"] = pageNumber.toString();
      }
      if (pageSize != null) {
        _queryParams["pageSize"] = pageSize.toString();
      }
      if (orderBy != null) {
        _queryParams["order_by"] = orderBy;
      }
      if (asc != null) {
        _queryParams["asc"] = asc.toString();
      }
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, "graph/list-all"),
        method: "GET",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        queryParameters: _queryParams,
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: GraphListResponse.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling GET /graph/list-all.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Detects structural patterns in a knowledge graph including relationship frequencies,
   * multi-hop paths, co-occurrences, hubs, and clusters.
   * When a query is provided, uses hybrid search to discover seed nodes,
   * detects triple-frequency patterns, and returns resolved edges ranked by relevance.
   *
   * @param {Zep.DetectPatternsRequest} request
   * @param {Graph.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.ForbiddenError}
   * @throws {@link Zep.NotFoundError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.graph.detectPatterns()
   */
  detectPatterns(request = {}, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__detectPatterns(request, requestOptions));
  }
  __detectPatterns() {
    return __awaiter14(this, arguments, void 0, function* (request = {}, requestOptions) {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, "graph/patterns"),
        method: "POST",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        contentType: "application/json",
        requestType: "json",
        body: DetectPatternsRequest.jsonOrThrow(request, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: true
        }),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: DetectPatternsResponse.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 403:
            throw new ForbiddenError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 404:
            throw new NotFoundError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling POST /graph/patterns.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Perform a graph search query.
   *
   * @param {Zep.GraphSearchQuery} request
   * @param {Graph.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.graph.search({
   *         query: "query"
   *     })
   */
  search(request, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__search(request, requestOptions));
  }
  __search(request, requestOptions) {
    return __awaiter14(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, "graph/search"),
        method: "POST",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        contentType: "application/json",
        requestType: "json",
        body: GraphSearchQuery.jsonOrThrow(request, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: true
        }),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: GraphSearchResults.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling POST /graph/search.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Returns a graph.
   *
   * @param {string} graphId - The graph_id of the graph to get.
   * @param {Graph.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.NotFoundError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.graph.get("graphId")
   */
  get(graphId, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__get(graphId, requestOptions));
  }
  __get(graphId, requestOptions) {
    return __awaiter14(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, `graph/${encodeURIComponent(graphId)}`),
        method: "GET",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: Graph.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 404:
            throw new NotFoundError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling GET /graph/{graphId}.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Deletes a graph. If you would like to delete a user graph, make sure to use user.delete instead.
   *
   * @param {string} graphId - Graph ID
   * @param {Graph.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.NotFoundError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.graph.delete("graphId")
   */
  delete(graphId, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__delete(graphId, requestOptions));
  }
  __delete(graphId, requestOptions) {
    return __awaiter14(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, `graph/${encodeURIComponent(graphId)}`),
        method: "DELETE",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: SuccessResponse.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 404:
            throw new NotFoundError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling DELETE /graph/{graphId}.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Updates information about a graph.
   *
   * @param {string} graphId - Graph ID
   * @param {Zep.UpdateGraphRequest} request
   * @param {Graph.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.NotFoundError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.graph.update("graphId")
   */
  update(graphId, request = {}, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__update(graphId, request, requestOptions));
  }
  __update(graphId_1) {
    return __awaiter14(this, arguments, void 0, function* (graphId, request = {}, requestOptions) {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, `graph/${encodeURIComponent(graphId)}`),
        method: "PATCH",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        contentType: "application/json",
        requestType: "json",
        body: UpdateGraphRequest.jsonOrThrow(request, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: true
        }),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: Graph.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 404:
            throw new NotFoundError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling PATCH /graph/{graphId}.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  _getCustomAuthorizationHeaders() {
    return __awaiter14(this, void 0, void 0, function* () {
      var _a;
      const apiKeyValue = (_a = yield Supplier.get(this._options.apiKey)) !== null && _a !== void 0 ? _a : process === null || process === void 0 ? void 0 : process.env["ZEP_API_KEY"];
      return { Authorization: `Api-Key ${apiKeyValue}` };
    });
  }
};

// node_modules/@getzep/zep-cloud/dist/esm/api/resources/project/client/Client.mjs
var __awaiter15 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var Project = class {
  constructor(_options = {}) {
    this._options = _options;
  }
  /**
   * Retrieve project info based on the provided api key.
   *
   * @param {Project.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.NotFoundError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.project.get()
   */
  get(requestOptions) {
    return HttpResponsePromise.fromPromise(this.__get(requestOptions));
  }
  __get(requestOptions) {
    return __awaiter15(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, "projects/info"),
        method: "GET",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: ProjectInfoResponse.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 404:
            throw new NotFoundError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling GET /projects/info.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  _getCustomAuthorizationHeaders() {
    return __awaiter15(this, void 0, void 0, function* () {
      var _a;
      const apiKeyValue = (_a = yield Supplier.get(this._options.apiKey)) !== null && _a !== void 0 ? _a : process === null || process === void 0 ? void 0 : process.env["ZEP_API_KEY"];
      return { Authorization: `Api-Key ${apiKeyValue}` };
    });
  }
};

// node_modules/@getzep/zep-cloud/dist/esm/api/resources/task/client/Client.mjs
var __awaiter16 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var Task = class {
  constructor(_options = {}) {
    this._options = _options;
  }
  /**
   * Gets a task by its ID
   *
   * @param {string} taskId - Task ID
   * @param {Task.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.NotFoundError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.task.get("task_id")
   */
  get(taskId, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__get(taskId, requestOptions));
  }
  __get(taskId, requestOptions) {
    return __awaiter16(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, `tasks/${encodeURIComponent(taskId)}`),
        method: "GET",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: GetTaskResponse.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 404:
            throw new NotFoundError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling GET /tasks/{task_id}.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  _getCustomAuthorizationHeaders() {
    return __awaiter16(this, void 0, void 0, function* () {
      var _a;
      const apiKeyValue = (_a = yield Supplier.get(this._options.apiKey)) !== null && _a !== void 0 ? _a : process === null || process === void 0 ? void 0 : process.env["ZEP_API_KEY"];
      return { Authorization: `Api-Key ${apiKeyValue}` };
    });
  }
};

// node_modules/@getzep/zep-cloud/dist/esm/api/resources/thread/resources/message/client/Client.mjs
var __awaiter17 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var Message2 = class {
  constructor(_options = {}) {
    this._options = _options;
  }
  /**
   * Updates a message.
   *
   * @param {string} messageUuid - The UUID of the message.
   * @param {Zep.thread.ThreadMessageUpdate} request
   * @param {Message.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.NotFoundError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.thread.message.update("messageUUID", {
   *         metadata: {
   *             "key": "value"
   *         }
   *     })
   */
  update(messageUuid, request, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__update(messageUuid, request, requestOptions));
  }
  __update(messageUuid, request, requestOptions) {
    return __awaiter17(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, `messages/${encodeURIComponent(messageUuid)}`),
        method: "PATCH",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        contentType: "application/json",
        requestType: "json",
        body: thread_exports.ThreadMessageUpdate.jsonOrThrow(request, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: true
        }),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: Message.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 404:
            throw new NotFoundError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling PATCH /messages/{messageUUID}.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  _getCustomAuthorizationHeaders() {
    return __awaiter17(this, void 0, void 0, function* () {
      var _a;
      const apiKeyValue = (_a = yield Supplier.get(this._options.apiKey)) !== null && _a !== void 0 ? _a : process === null || process === void 0 ? void 0 : process.env["ZEP_API_KEY"];
      return { Authorization: `Api-Key ${apiKeyValue}` };
    });
  }
};

// node_modules/@getzep/zep-cloud/dist/esm/api/resources/thread/client/Client.mjs
var __awaiter18 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var Thread2 = class {
  constructor(_options = {}) {
    this._options = _options;
  }
  get message() {
    var _a;
    return (_a = this._message) !== null && _a !== void 0 ? _a : this._message = new Message2(this._options);
  }
  /**
   * Returns all threads.
   *
   * @param {Zep.ThreadListAllRequest} request
   * @param {Thread.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.thread.listAll({
   *         pageNumber: 1,
   *         pageSize: 1,
   *         orderBy: "order_by",
   *         asc: true
   *     })
   */
  listAll(request = {}, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__listAll(request, requestOptions));
  }
  __listAll() {
    return __awaiter18(this, arguments, void 0, function* (request = {}, requestOptions) {
      var _a, _b, _c, _d;
      const { pageNumber, pageSize, orderBy, asc } = request;
      const _queryParams = {};
      if (pageNumber != null) {
        _queryParams["page_number"] = pageNumber.toString();
      }
      if (pageSize != null) {
        _queryParams["page_size"] = pageSize.toString();
      }
      if (orderBy != null) {
        _queryParams["order_by"] = orderBy;
      }
      if (asc != null) {
        _queryParams["asc"] = asc.toString();
      }
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, "threads"),
        method: "GET",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        queryParameters: _queryParams,
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: ThreadListResponse.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling GET /threads.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Start a new thread.
   *
   * @param {Zep.CreateThreadRequest} request
   * @param {Thread.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.thread.create({
   *         threadId: "thread_id",
   *         userId: "user_id"
   *     })
   */
  create(request, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__create(request, requestOptions));
  }
  __create(request, requestOptions) {
    return __awaiter18(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, "threads"),
        method: "POST",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        contentType: "application/json",
        requestType: "json",
        body: CreateThreadRequest.jsonOrThrow(request, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: true
        }),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: Thread.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling POST /threads.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Deletes a thread.
   *
   * @param {string} threadId - The ID of the thread for which memory should be deleted.
   * @param {Thread.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.NotFoundError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.thread.delete("threadId")
   */
  delete(threadId, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__delete(threadId, requestOptions));
  }
  __delete(threadId, requestOptions) {
    return __awaiter18(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, `threads/${encodeURIComponent(threadId)}`),
        method: "DELETE",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: SuccessResponse.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 404:
            throw new NotFoundError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling DELETE /threads/{threadId}.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Returns most relevant context from the user graph (including memory from any/all past threads) based on the content of the past few messages of the given thread.
   *
   * @param {string} threadId - The ID of the current thread (for which context is being retrieved).
   * @param {Zep.ThreadGetUserContextRequest} request
   * @param {Thread.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.NotFoundError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.thread.getUserContext("threadId", {
   *         templateId: "template_id"
   *     })
   */
  getUserContext(threadId, request = {}, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__getUserContext(threadId, request, requestOptions));
  }
  __getUserContext(threadId_1) {
    return __awaiter18(this, arguments, void 0, function* (threadId, request = {}, requestOptions) {
      var _a, _b, _c, _d;
      const { templateId } = request;
      const _queryParams = {};
      if (templateId != null) {
        _queryParams["template_id"] = templateId;
      }
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, `threads/${encodeURIComponent(threadId)}/context`),
        method: "GET",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        queryParameters: _queryParams,
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: ThreadContextResponse.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 404:
            throw new NotFoundError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling GET /threads/{threadId}/context.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Returns messages for a thread.
   *
   * @param {string} threadId - Thread ID
   * @param {Zep.ThreadGetRequest} request
   * @param {Thread.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.NotFoundError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.thread.get("threadId", {
   *         limit: 1,
   *         cursor: 1,
   *         lastn: 1
   *     })
   */
  get(threadId, request = {}, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__get(threadId, request, requestOptions));
  }
  __get(threadId_1) {
    return __awaiter18(this, arguments, void 0, function* (threadId, request = {}, requestOptions) {
      var _a, _b, _c, _d;
      const { limit, cursor, lastn } = request;
      const _queryParams = {};
      if (limit != null) {
        _queryParams["limit"] = limit.toString();
      }
      if (cursor != null) {
        _queryParams["cursor"] = cursor.toString();
      }
      if (lastn != null) {
        _queryParams["lastn"] = lastn.toString();
      }
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, `threads/${encodeURIComponent(threadId)}/messages`),
        method: "GET",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        queryParameters: _queryParams,
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: MessageListResponse.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 404:
            throw new NotFoundError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling GET /threads/{threadId}/messages.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Add messages to a thread.
   *
   * @param {string} threadId - The ID of the thread to which messages should be added.
   * @param {Zep.AddThreadMessagesRequest} request
   * @param {Thread.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.thread.addMessages("threadId", {
   *         messages: [{
   *                 content: "content",
   *                 role: "norole"
   *             }]
   *     })
   */
  addMessages(threadId, request, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__addMessages(threadId, request, requestOptions));
  }
  __addMessages(threadId, request, requestOptions) {
    return __awaiter18(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, `threads/${encodeURIComponent(threadId)}/messages`),
        method: "POST",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        contentType: "application/json",
        requestType: "json",
        body: AddThreadMessagesRequest.jsonOrThrow(request, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: true
        }),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: AddThreadMessagesResponse.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling POST /threads/{threadId}/messages.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Add messages to a thread in batch mode. This will process messages concurrently, which is useful for data migrations.
   *
   * @param {string} threadId - The ID of the thread to which messages should be added.
   * @param {Zep.AddThreadMessagesRequest} request
   * @param {Thread.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.thread.addMessagesBatch("threadId", {
   *         messages: [{
   *                 content: "content",
   *                 role: "norole"
   *             }]
   *     })
   */
  addMessagesBatch(threadId, request, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__addMessagesBatch(threadId, request, requestOptions));
  }
  __addMessagesBatch(threadId, request, requestOptions) {
    return __awaiter18(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, `threads/${encodeURIComponent(threadId)}/messages-batch`),
        method: "POST",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        contentType: "application/json",
        requestType: "json",
        body: AddThreadMessagesRequest.jsonOrThrow(request, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: true
        }),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: AddThreadMessagesResponse.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling POST /threads/{threadId}/messages-batch.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  _getCustomAuthorizationHeaders() {
    return __awaiter18(this, void 0, void 0, function* () {
      var _a;
      const apiKeyValue = (_a = yield Supplier.get(this._options.apiKey)) !== null && _a !== void 0 ? _a : process === null || process === void 0 ? void 0 : process.env["ZEP_API_KEY"];
      return { Authorization: `Api-Key ${apiKeyValue}` };
    });
  }
};

// node_modules/@getzep/zep-cloud/dist/esm/api/resources/user/client/Client.mjs
var __awaiter19 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var User2 = class {
  constructor(_options = {}) {
    this._options = _options;
  }
  /**
   * Lists all user summary instructions for a project, user.
   *
   * @param {Zep.UserListUserSummaryInstructionsRequest} request
   * @param {User.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.NotFoundError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.user.listUserSummaryInstructions({
   *         userId: "user_id"
   *     })
   */
  listUserSummaryInstructions(request = {}, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__listUserSummaryInstructions(request, requestOptions));
  }
  __listUserSummaryInstructions() {
    return __awaiter19(this, arguments, void 0, function* (request = {}, requestOptions) {
      var _a, _b, _c, _d;
      const { userId } = request;
      const _queryParams = {};
      if (userId != null) {
        _queryParams["user_id"] = userId;
      }
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, "user-summary-instructions"),
        method: "GET",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        queryParameters: _queryParams,
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: ListUserInstructionsResponse.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 404:
            throw new NotFoundError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling GET /user-summary-instructions.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Adds new summary instructions for users graphs without removing existing ones. If user_ids is empty, adds to project-wide default instructions.
   *
   * @param {Zep.AddUserInstructionsRequest} request
   * @param {User.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.NotFoundError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.user.addUserSummaryInstructions({
   *         instructions: [{
   *                 name: "name",
   *                 text: "text"
   *             }]
   *     })
   */
  addUserSummaryInstructions(request, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__addUserSummaryInstructions(request, requestOptions));
  }
  __addUserSummaryInstructions(request, requestOptions) {
    return __awaiter19(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, "user-summary-instructions"),
        method: "POST",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        contentType: "application/json",
        requestType: "json",
        body: AddUserInstructionsRequest.jsonOrThrow(request, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: true
        }),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: SuccessResponse.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 404:
            throw new NotFoundError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling POST /user-summary-instructions.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Deletes user summary/instructions for users or project wide defaults.
   *
   * @param {Zep.DeleteUserInstructionsRequest} request
   * @param {User.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.NotFoundError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.user.deleteUserSummaryInstructions()
   */
  deleteUserSummaryInstructions(request = {}, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__deleteUserSummaryInstructions(request, requestOptions));
  }
  __deleteUserSummaryInstructions() {
    return __awaiter19(this, arguments, void 0, function* (request = {}, requestOptions) {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, "user-summary-instructions"),
        method: "DELETE",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        contentType: "application/json",
        requestType: "json",
        body: DeleteUserInstructionsRequest.jsonOrThrow(request, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: true
        }),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: SuccessResponse.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 404:
            throw new NotFoundError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling DELETE /user-summary-instructions.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Adds a user.
   *
   * @param {Zep.CreateUserRequest} request
   * @param {User.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.user.add({
   *         userId: "user_id"
   *     })
   */
  add(request, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__add(request, requestOptions));
  }
  __add(request, requestOptions) {
    return __awaiter19(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, "users"),
        method: "POST",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        contentType: "application/json",
        requestType: "json",
        body: CreateUserRequest.jsonOrThrow(request, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: true
        }),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: User.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling POST /users.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Returns all users.
   *
   * @param {Zep.UserListOrderedRequest} request
   * @param {User.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.user.listOrdered({
   *         pageNumber: 1,
   *         pageSize: 1,
   *         search: "search",
   *         orderBy: "order_by",
   *         asc: true
   *     })
   */
  listOrdered(request = {}, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__listOrdered(request, requestOptions));
  }
  __listOrdered() {
    return __awaiter19(this, arguments, void 0, function* (request = {}, requestOptions) {
      var _a, _b, _c, _d;
      const { pageNumber, pageSize, search, orderBy, asc } = request;
      const _queryParams = {};
      if (pageNumber != null) {
        _queryParams["pageNumber"] = pageNumber.toString();
      }
      if (pageSize != null) {
        _queryParams["pageSize"] = pageSize.toString();
      }
      if (search != null) {
        _queryParams["search"] = search;
      }
      if (orderBy != null) {
        _queryParams["order_by"] = orderBy;
      }
      if (asc != null) {
        _queryParams["asc"] = asc.toString();
      }
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, "users-ordered"),
        method: "GET",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        queryParameters: _queryParams,
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: UserListResponse.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling GET /users-ordered.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Returns a user.
   *
   * @param {string} userId - The user_id of the user to get.
   * @param {User.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.NotFoundError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.user.get("userId")
   */
  get(userId, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__get(userId, requestOptions));
  }
  __get(userId, requestOptions) {
    return __awaiter19(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, `users/${encodeURIComponent(userId)}`),
        method: "GET",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: User.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 404:
            throw new NotFoundError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling GET /users/{userId}.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Deletes a user.
   *
   * @param {string} userId - User ID
   * @param {User.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.NotFoundError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.user.delete("userId")
   */
  delete(userId, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__delete(userId, requestOptions));
  }
  __delete(userId, requestOptions) {
    return __awaiter19(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, `users/${encodeURIComponent(userId)}`),
        method: "DELETE",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: SuccessResponse.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 404:
            throw new NotFoundError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling DELETE /users/{userId}.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Updates a user.
   *
   * @param {string} userId - User ID
   * @param {Zep.UpdateUserRequest} request
   * @param {User.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.NotFoundError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.user.update("userId")
   */
  update(userId, request = {}, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__update(userId, request, requestOptions));
  }
  __update(userId_1) {
    return __awaiter19(this, arguments, void 0, function* (userId, request = {}, requestOptions) {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, `users/${encodeURIComponent(userId)}`),
        method: "PATCH",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        contentType: "application/json",
        requestType: "json",
        body: UpdateUserRequest.jsonOrThrow(request, {
          unrecognizedObjectKeys: "strip",
          omitUndefined: true
        }),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: User.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 400:
            throw new BadRequestError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 404:
            throw new NotFoundError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling PATCH /users/{userId}.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Returns a user's node.
   *
   * @param {string} userId - The user_id of the user to get the node for.
   * @param {User.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.NotFoundError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.user.getNode("userId")
   */
  getNode(userId, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__getNode(userId, requestOptions));
  }
  __getNode(userId, requestOptions) {
    return __awaiter19(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, `users/${encodeURIComponent(userId)}/node`),
        method: "GET",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: UserNodeResponse.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 404:
            throw new NotFoundError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling GET /users/{userId}/node.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Returns all threads for a user.
   *
   * @param {string} userId - User ID
   * @param {User.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.user.getThreads("userId")
   */
  getThreads(userId, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__getThreads(userId, requestOptions));
  }
  __getThreads(userId, requestOptions) {
    return __awaiter19(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, `users/${encodeURIComponent(userId)}/threads`),
        method: "GET",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: user_exports.getThreads.Response.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling GET /users/{userId}/threads.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  /**
   * Hints Zep to warm a user's graph for low-latency search
   *
   * @param {string} userId - User ID
   * @param {User.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.NotFoundError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     await client.user.warm("userId")
   */
  warm(userId, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__warm(userId, requestOptions));
  }
  __warm(userId, requestOptions) {
    return __awaiter19(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;
      const _response = yield ((_a = this._options.fetcher) !== null && _a !== void 0 ? _a : fetcher)({
        url: url_exports.join((_c = (_b = yield Supplier.get(this._options.baseUrl)) !== null && _b !== void 0 ? _b : yield Supplier.get(this._options.environment)) !== null && _c !== void 0 ? _c : ZepEnvironment.Default, `users/${encodeURIComponent(userId)}/warm`),
        method: "GET",
        headers: mergeHeaders((_d = this._options) === null || _d === void 0 ? void 0 : _d.headers, mergeOnlyDefinedHeaders(Object.assign({}, yield this._getCustomAuthorizationHeaders())), requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers),
        timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
        maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
        abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal
      });
      if (_response.ok) {
        return {
          data: SuccessResponse.parseOrThrow(_response.body, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: true,
            allowUnrecognizedEnumValues: true,
            skipValidation: true,
            breadcrumbsPrefix: ["response"]
          }),
          rawResponse: _response.rawResponse
        };
      }
      if (_response.error.reason === "status-code") {
        switch (_response.error.statusCode) {
          case 404:
            throw new NotFoundError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          case 500:
            throw new InternalServerError(ApiError.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true,
              skipValidation: true,
              breadcrumbsPrefix: ["response"]
            }), _response.rawResponse);
          default:
            throw new ZepError({
              statusCode: _response.error.statusCode,
              body: _response.error.body,
              rawResponse: _response.rawResponse
            });
        }
      }
      switch (_response.error.reason) {
        case "non-json":
          throw new ZepError({
            statusCode: _response.error.statusCode,
            body: _response.error.rawBody,
            rawResponse: _response.rawResponse
          });
        case "timeout":
          throw new ZepTimeoutError("Timeout exceeded when calling GET /users/{userId}/warm.");
        case "unknown":
          throw new ZepError({
            message: _response.error.errorMessage,
            rawResponse: _response.rawResponse
          });
      }
    });
  }
  _getCustomAuthorizationHeaders() {
    return __awaiter19(this, void 0, void 0, function* () {
      var _a;
      const apiKeyValue = (_a = yield Supplier.get(this._options.apiKey)) !== null && _a !== void 0 ? _a : process === null || process === void 0 ? void 0 : process.env["ZEP_API_KEY"];
      return { Authorization: `Api-Key ${apiKeyValue}` };
    });
  }
};

// node_modules/@getzep/zep-cloud/dist/esm/Client.mjs
var ZepClient = class {
  constructor(_options = {}) {
    this._options = Object.assign(Object.assign({}, _options), { headers: mergeHeaders({
      "X-Fern-Language": "JavaScript",
      "X-Fern-SDK-Name": "zep-cloud",
      "X-Fern-SDK-Version": "3.18.0",
      "User-Agent": "zep-cloud/3.18.0",
      "X-Fern-Runtime": RUNTIME.type,
      "X-Fern-Runtime-Version": RUNTIME.version
    }, _options === null || _options === void 0 ? void 0 : _options.headers) });
  }
  get context() {
    var _a;
    return (_a = this._context) !== null && _a !== void 0 ? _a : this._context = new Context(this._options);
  }
  get graph() {
    var _a;
    return (_a = this._graph) !== null && _a !== void 0 ? _a : this._graph = new Graph2(this._options);
  }
  get project() {
    var _a;
    return (_a = this._project) !== null && _a !== void 0 ? _a : this._project = new Project(this._options);
  }
  get task() {
    var _a;
    return (_a = this._task) !== null && _a !== void 0 ? _a : this._task = new Task(this._options);
  }
  get thread() {
    var _a;
    return (_a = this._thread) !== null && _a !== void 0 ? _a : this._thread = new Thread2(this._options);
  }
  get user() {
    var _a;
    return (_a = this._user) !== null && _a !== void 0 ? _a : this._user = new User2(this._options);
  }
};

// node_modules/@getzep/zep-cloud/node_modules/zod/v3/external.js
var external_exports = {};
__export(external_exports, {
  BRAND: () => BRAND,
  DIRTY: () => DIRTY,
  EMPTY_PATH: () => EMPTY_PATH,
  INVALID: () => INVALID,
  NEVER: () => NEVER,
  OK: () => OK,
  ParseStatus: () => ParseStatus,
  Schema: () => ZodType,
  ZodAny: () => ZodAny,
  ZodArray: () => ZodArray,
  ZodBigInt: () => ZodBigInt,
  ZodBoolean: () => ZodBoolean,
  ZodBranded: () => ZodBranded,
  ZodCatch: () => ZodCatch,
  ZodDate: () => ZodDate,
  ZodDefault: () => ZodDefault,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
  ZodEffects: () => ZodEffects,
  ZodEnum: () => ZodEnum,
  ZodError: () => ZodError,
  ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
  ZodFunction: () => ZodFunction,
  ZodIntersection: () => ZodIntersection,
  ZodIssueCode: () => ZodIssueCode,
  ZodLazy: () => ZodLazy,
  ZodLiteral: () => ZodLiteral,
  ZodMap: () => ZodMap,
  ZodNaN: () => ZodNaN,
  ZodNativeEnum: () => ZodNativeEnum,
  ZodNever: () => ZodNever,
  ZodNull: () => ZodNull,
  ZodNullable: () => ZodNullable,
  ZodNumber: () => ZodNumber,
  ZodObject: () => ZodObject,
  ZodOptional: () => ZodOptional,
  ZodParsedType: () => ZodParsedType,
  ZodPipeline: () => ZodPipeline,
  ZodPromise: () => ZodPromise,
  ZodReadonly: () => ZodReadonly,
  ZodRecord: () => ZodRecord,
  ZodSchema: () => ZodType,
  ZodSet: () => ZodSet,
  ZodString: () => ZodString,
  ZodSymbol: () => ZodSymbol,
  ZodTransformer: () => ZodEffects,
  ZodTuple: () => ZodTuple,
  ZodType: () => ZodType,
  ZodUndefined: () => ZodUndefined,
  ZodUnion: () => ZodUnion,
  ZodUnknown: () => ZodUnknown,
  ZodVoid: () => ZodVoid,
  addIssueToContext: () => addIssueToContext,
  any: () => anyType,
  array: () => arrayType,
  bigint: () => bigIntType,
  boolean: () => booleanType,
  coerce: () => coerce,
  custom: () => custom,
  date: () => dateType,
  datetimeRegex: () => datetimeRegex,
  defaultErrorMap: () => en_default,
  discriminatedUnion: () => discriminatedUnionType,
  effect: () => effectsType,
  enum: () => enumType,
  function: () => functionType,
  getErrorMap: () => getErrorMap,
  getParsedType: () => getParsedType,
  instanceof: () => instanceOfType,
  intersection: () => intersectionType,
  isAborted: () => isAborted,
  isAsync: () => isAsync,
  isDirty: () => isDirty,
  isValid: () => isValid,
  late: () => late,
  lazy: () => lazyType,
  literal: () => literalType,
  makeIssue: () => makeIssue,
  map: () => mapType,
  nan: () => nanType,
  nativeEnum: () => nativeEnumType,
  never: () => neverType,
  null: () => nullType,
  nullable: () => nullableType,
  number: () => numberType,
  object: () => objectType,
  objectUtil: () => objectUtil,
  oboolean: () => oboolean,
  onumber: () => onumber,
  optional: () => optionalType,
  ostring: () => ostring,
  pipeline: () => pipelineType,
  preprocess: () => preprocessType,
  promise: () => promiseType,
  quotelessJson: () => quotelessJson,
  record: () => recordType,
  set: () => setType,
  setErrorMap: () => setErrorMap,
  strictObject: () => strictObjectType,
  string: () => stringType,
  symbol: () => symbolType,
  transformer: () => effectsType,
  tuple: () => tupleType,
  undefined: () => undefinedType,
  union: () => unionType,
  unknown: () => unknownType,
  util: () => util,
  void: () => voidType
});

// node_modules/@getzep/zep-cloud/node_modules/zod/v3/helpers/util.js
var util;
(function(util2) {
  util2.assertEqual = (_) => {
  };
  function assertIs(_arg) {
  }
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object2) => {
    const keys2 = [];
    for (const key in object2) {
      if (Object.prototype.hasOwnProperty.call(object2, key)) {
        keys2.push(key);
      }
    }
    return keys2;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return void 0;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
      // second overwrites first
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType = (data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};

// node_modules/@getzep/zep-cloud/node_modules/zod/v3/ZodError.js
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var quotelessJson = (obj) => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, "$1:");
};
var ZodError = class _ZodError extends Error {
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = (error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof _ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        const firstEl = sub.path[0];
        fieldErrors[firstEl] = fieldErrors[firstEl] || [];
        fieldErrors[firstEl].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
};
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};

// node_modules/@getzep/zep-cloud/node_modules/zod/v3/locales/en.js
var errorMap = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "bigint")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
var en_default = errorMap;

// node_modules/@getzep/zep-cloud/node_modules/zod/v3/errors.js
var overrideErrorMap = en_default;
function setErrorMap(map) {
  overrideErrorMap = map;
}
function getErrorMap() {
  return overrideErrorMap;
}

// node_modules/@getzep/zep-cloud/node_modules/zod/v3/helpers/parseUtil.js
var makeIssue = (params) => {
  const { data, path, errorMaps, issueData } = params;
  const fullPath = [...path, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== void 0) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m) => !!m).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage
  };
};
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === en_default ? void 0 : en_default
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
var ParseStatus = class _ParseStatus {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return _ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
};
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = (value) => ({ status: "dirty", value });
var OK = (value) => ({ status: "valid", value });
var isAborted = (x) => x.status === "aborted";
var isDirty = (x) => x.status === "dirty";
var isValid = (x) => x.status === "valid";
var isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;

// node_modules/@getzep/zep-cloud/node_modules/zod/v3/helpers/errorUtil.js
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message?.message;
})(errorUtil || (errorUtil = {}));

// node_modules/@getzep/zep-cloud/node_modules/zod/v3/types.js
var ParseInputLazyPath = class {
  constructor(parent, value, path, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (Array.isArray(this._key)) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
};
var handleResult = (ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      }
    };
  }
};
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message ?? ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: message ?? required_error ?? ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: message ?? invalid_type_error ?? ctx.defaultError };
  };
  return { errorMap: customMap, description };
}
var ZodType = class {
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    const ctx = {
      common: {
        issues: [],
        async: params?.async ?? false,
        contextualErrorMap: params?.errorMap
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data) {
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err) {
        if (err?.message?.toLowerCase()?.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
      value: result.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params?.errorMap,
        async: true
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = (val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = () => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      });
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (data) => this["~validate"](data)
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform2) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform: transform2 }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
};
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    if (!header)
      return false;
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if ("typ" in decoded && decoded?.typ !== "JWT")
      return false;
    if (!decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch {
    return false;
  }
}
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
var ZodString = class _ZodString extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({
      kind: "base64url",
      ...errorUtil.errToObj(message)
    });
  }
  jwt(options) {
    return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  cidr(options) {
    return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      offset: options?.offset ?? false,
      local: options?.local ?? false,
      ...errorUtil.errToObj(options?.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      ...errorUtil.errToObj(options?.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options?.position,
      ...errorUtil.errToObj(options?.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodString.create = (params) => {
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}
var ZodNumber = class _ZodNumber extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null;
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
};
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodBigInt = class _ZodBigInt extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodBigInt.create = (params) => {
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
var ZodBoolean = class extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodDate = class _ZodDate extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (Number.isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new _ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
};
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: params?.coerce || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};
var ZodSymbol = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};
var ZodUndefined = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};
var ZodNull = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};
var ZodAny = class extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};
var ZodUnknown = class extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};
var ZodNever = class extends ZodType {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
};
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};
var ZodVoid = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};
var ZodArray = class _ZodArray extends ZodType {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new _ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new _ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new _ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
var ZodObject = class _ZodObject extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys2 = util.objectKeys(shape);
    this._cached = { shape, keys: keys2 };
    return this._cached;
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip") {
      } else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== void 0 ? {
        errorMap: (issue, ctx) => {
          const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: errorUtil.errToObj(message).message ?? defaultError
            };
          return {
            message: defaultError
          };
        }
      } : {}
    });
  }
  strip() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new _ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new _ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index) {
    return new _ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    for (const key of util.objectKeys(mask)) {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  omit(mask) {
    const shape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  required(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
};
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
var ZodUnion = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
};
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = (type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [void 0];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [void 0, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodNullable) {
    return [null, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodBranded) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch) {
    return getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
};
var ZodDiscriminatedUnion = class _ZodDiscriminatedUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(discriminator, options, params) {
    const optionsMap = /* @__PURE__ */ new Map();
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new _ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params)
    });
  }
};
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
var ZodIntersection = class extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
};
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};
var ZodTuple = class _ZodTuple extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new _ZodTuple({
      ...this._def,
      rest
    });
  }
};
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};
var ZodRecord = class _ZodRecord extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new _ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new _ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
};
var ZodMap = class extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
};
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};
var ZodSet = class _ZodSet extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new _ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new _ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};
var ZodFunction = class _ZodFunction extends ZodType {
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error
        }
      });
    }
    function makeReturnsIssue(returns, error) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error
        }
      });
    }
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function(...args) {
        const error = new ZodError([]);
        const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
          error.addIssue(makeArgsIssue(args, e));
          throw error;
        });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
          error.addIssue(makeReturnsIssue(result, e));
          throw error;
        });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function(...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new _ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new _ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new _ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
};
var ZodLazy = class extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
};
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};
var ZodLiteral = class extends ZodType {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
};
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
var ZodEnum = class _ZodEnum extends ZodType {
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(this._def.values);
    }
    if (!this._cache.has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return _ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
};
ZodEnum.create = createZodEnum;
var ZodNativeEnum = class extends ZodType {
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(util.getValidEnumValues(this._def.values));
    }
    if (!this._cache.has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
};
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};
var ZodPromise = class extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
};
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};
var ZodEffects = class extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = (acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return INVALID;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return INVALID;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
            status: status.value,
            value: result
          }));
        });
      }
    }
    util.assertNever(effect);
  }
};
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};
var ZodOptional = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};
var ZodNullable = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};
var ZodDefault = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};
var ZodCatch = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
};
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};
var ZodNaN = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
};
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = Symbol("zod_brand");
var ZodBranded = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
};
var ZodPipeline = class _ZodPipeline extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new _ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
};
var ZodReadonly = class extends ZodType {
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = (data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    };
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
function cleanParams(params, data) {
  const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
  const p2 = typeof p === "string" ? { message: p } : p;
  return p2;
}
function custom(check, _params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      const r = check(data);
      if (r instanceof Promise) {
        return r.then((r2) => {
          if (!r2) {
            const params = cleanParams(_params, data);
            const _fatal = params.fatal ?? fatal ?? true;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      }
      if (!r) {
        const params = cleanParams(_params, data);
        const _fatal = params.fatal ?? fatal ?? true;
        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny.create();
}
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = (cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom((data) => data instanceof cls, params);
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = () => stringType().optional();
var onumber = () => numberType().optional();
var oboolean = () => booleanType().optional();
var coerce = {
  string: ((arg) => ZodString.create({ ...arg, coerce: true })),
  number: ((arg) => ZodNumber.create({ ...arg, coerce: true })),
  boolean: ((arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  })),
  bigint: ((arg) => ZodBigInt.create({ ...arg, coerce: true })),
  date: ((arg) => ZodDate.create({ ...arg, coerce: true }))
};
var NEVER = INVALID;

// node_modules/@getzep/zep-cloud/dist/esm/wrapper/ontology.mjs
var EntityPropertyType2;
(function(EntityPropertyType3) {
  EntityPropertyType3["Text"] = "Text";
  EntityPropertyType3["Int"] = "Int";
  EntityPropertyType3["Float"] = "Float";
  EntityPropertyType3["Boolean"] = "Boolean";
})(EntityPropertyType2 || (EntityPropertyType2 = {}));
var EntityTypeBaseField = external_exports.object({
  type: external_exports.nativeEnum(EntityPropertyType2),
  description: external_exports.string()
});
var EntityTypeTextFieldSchema = EntityTypeBaseField.extend({
  type: external_exports.literal(EntityPropertyType2.Text),
  value: external_exports.string().optional()
});
var EntityTypeIntFieldSchema = EntityTypeBaseField.extend({
  type: external_exports.literal(EntityPropertyType2.Int),
  value: external_exports.number().int().optional()
});
var EntityTypeFloatFieldSchema = EntityTypeBaseField.extend({
  type: external_exports.literal(EntityPropertyType2.Float),
  value: external_exports.number().optional()
});
var EntityTypeBooleanFieldSchema = EntityTypeBaseField.extend({
  type: external_exports.literal(EntityPropertyType2.Boolean),
  value: external_exports.boolean().optional()
});
var EntityTypeFieldSchema = external_exports.union([
  EntityTypeTextFieldSchema,
  EntityTypeIntFieldSchema,
  EntityTypeFloatFieldSchema,
  EntityTypeBooleanFieldSchema
]);
var EntityFields = external_exports.record(EntityTypeFieldSchema);
var EntityTypeSchema = external_exports.object({
  description: external_exports.string().default(""),
  fields: external_exports.record(EntityTypeFieldSchema)
});
var EdgeSourceTarget = external_exports.object({
  source: external_exports.string().optional(),
  target: external_exports.string().optional()
});
var EdgeTypeSchema = EntityTypeSchema.extend({
  sourceTargets: external_exports.array(EdgeSourceTarget).optional()
});
function entityModelToAPISchema(entityType, name) {
  return {
    name,
    description: entityType.description,
    properties: Object.entries(entityType.fields).map(([fieldName, fieldDef]) => ({
      name: fieldName,
      type: fieldDef.type,
      description: fieldDef.description
    }))
  };
}
function edgeModelToAPISchema(entityType, name) {
  return {
    name,
    description: entityType.description,
    sourceTargets: entityType.sourceTargets,
    properties: Object.entries(entityType.fields).map(([fieldName, fieldDef]) => ({
      name: fieldName,
      type: fieldDef.type,
      description: fieldDef.description
    }))
  };
}

// node_modules/@getzep/zep-cloud/dist/esm/wrapper/graph.mjs
var __awaiter20 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var Graph3 = class extends Graph2 {
  /**
   * Sets the entity and edge types for the specified targets, replacing any existing ones in those targets. If no targets are specified, it sets the ontology for the entire project.
   *
   * @param {Record<string, EntityType>} entityTypes
   * @param {Record<string, EdgeType>} edgeTypes
   * @param {OntologyTargets} [ontologyTargets] - The targets for which to set the ontology. Can include userIds or graphIds. If none specified, sets for the entire project.
   * @param {Graph.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     const travelDestinationSchema: EntityType = {
   *         description: "A travel destination entity",
   *         fields: {
   *             destination_name: entityFields.text("The name of travel destination"),
   *         },
   *     };
   *
   *     const isTravelingTo: EdgeType = {
   *         description: "An edge representing a traveler going to a destination.",
   *         fields: {
   *             travel_date: entityFields.text("The date of the travel"),
   *             purpose: entityFields.text("The purpose of the travel"),
   *         },
   *         sourceTargets: [
   *             {
   *                 source: "User",
   *                 target: "TravelDestination",
   *             }
   *         ]
   *     }
   *
   *     await client.graph.setEntityTypes({
   *         TravelDestination: travelDestinationSchema,
   *     }, {
   *         IS_TRAVELING_TO: isTravelingTo,
   *     }, {userIds: ['user_1234']});
   */
  setEntityTypes(entityTypes, edgeTypes, ontologyTargets, requestOptions) {
    return __awaiter20(this, void 0, void 0, function* () {
      const validatedEntityTypes = Object.keys(entityTypes).map((key) => {
        const schema = entityTypes[key];
        return entityModelToAPISchema(schema, key);
      });
      const validatedEdgeTypes = Object.keys(edgeTypes).map((key) => {
        const schema = edgeTypes[key];
        return edgeModelToAPISchema(schema, key);
      });
      return this.setEntityTypesInternal({
        entityTypes: validatedEntityTypes,
        edgeTypes: validatedEdgeTypes,
        userIds: ontologyTargets === null || ontologyTargets === void 0 ? void 0 : ontologyTargets.userIds,
        graphIds: ontologyTargets === null || ontologyTargets === void 0 ? void 0 : ontologyTargets.graphIds
      }, requestOptions);
    });
  }
  /**
   * Sets the entity and edge types for the specified targets, replacing any existing ones in those targets. If no targets are specified, it sets the ontology for the entire project.
   *
   * @param {Record<string, EntityType>} entityTypes
   * @param {Record<string, EdgeType>} edgeTypes
   * @param {OntologyTargets} [ontologyTargets] - The targets for which to set the ontology. Can include userIds or graphIds. If none specified, sets for the entire project.
   * @param {Graph.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link Zep.BadRequestError}
   * @throws {@link Zep.InternalServerError}
   *
   * @example
   *     const travelDestinationSchema: EntityType = {
   *         description: "A travel destination entity",
   *         fields: {
   *             destination_name: entityFields.text("The name of travel destination"),
   *         },
   *     };
   *
   *     const isTravelingTo: EdgeType = {
   *         description: "An edge representing a traveler going to a destination.",
   *         fields: {
   *             travel_date: entityFields.text("The date of the travel"),
   *             purpose: entityFields.text("The purpose of the travel"),
   *         },
   *         sourceTargets: [
   *             {
   *                 source: "User",
   *                 target: "TravelDestination",
   *             }
   *         ]
   *     }
   *
   *     await client.graph.setEntityTypes({
   *         TravelDestination: travelDestinationSchema,
   *     }, {
   *         IS_TRAVELING_TO: isTravelingTo,
   *     }, {userIds: ['user_1234']});
   */
  setOntology(entityTypes, edgeTypes, ontologyTargets, requestOptions) {
    return __awaiter20(this, void 0, void 0, function* () {
      return this.setEntityTypes(entityTypes, edgeTypes, ontologyTargets, requestOptions);
    });
  }
};

// node_modules/@getzep/zep-cloud/dist/esm/wrapper/index.mjs
var ZepClient2 = class extends ZepClient {
  get graph() {
    return new Graph3(this._options);
  }
};

// context/zep-loop.mjs
var MAX_CONTENT_LENGTH = 4096;
var ZepLoop = class {
  constructor({ apiKey, userId, defaultTemplate = "general" }) {
    this.client = new ZepClient2({ apiKey });
    this.userId = userId;
    this.defaultTemplate = defaultTemplate;
    this.threadId = null;
    this.sessionType = null;
    this.episodeCount = 0;
    this._ready = false;
  }
  /**
   * Start a new Zep thread for this conversation session.
   * Warms the user graph and creates a thread.
   *
   * @param {string} sessionId - Claudia session ID (used as thread ID)
   * @param {string} [sessionType] - Session type: "general", "book-work", "coaching"
   * @returns {Promise<void>}
   */
  async start(sessionId, sessionType = "general") {
    this.threadId = `claudia-${sessionId}`;
    this.sessionType = sessionType;
    this.episodeCount = 0;
    try {
      try {
        await this.client.user.get(this.userId);
      } catch (e) {
        if (e.statusCode === 404) {
          await this.client.user.add({ userId: this.userId });
        } else {
          throw e;
        }
      }
      const warmPromise = this.client.user.warm(this.userId);
      const createPromise = this.client.thread.create({
        threadId: this.threadId,
        userId: this.userId,
        metadata: {
          source: "claudia",
          sessionType,
          machine: process.env.HOSTNAME || "unknown",
          startedAt: (/* @__PURE__ */ new Date()).toISOString()
        }
      });
      await Promise.all([warmPromise, createPromise]);
      this._ready = true;
    } catch (err) {
      if (err.statusCode === 409 || err.message?.includes("already exists")) {
        this._ready = true;
        return;
      }
      console.error("[ZepLoop] Failed to start:", err.message);
      this._ready = false;
    }
  }
  /**
   * Ingest a user message and retrieve context in a single API call.
   * This is the Zep-recommended pattern: addMessages with returnContext.
   *
   * @param {string} message - User message text
   * @returns {Promise<string|null>} Context block for system prompt injection
   */
  async ingestAndRetrieve(message) {
    if (!this._ready || !this.threadId) return null;
    try {
      const response = await this.client.thread.addMessages(this.threadId, {
        messages: [
          {
            content: message.slice(0, MAX_CONTENT_LENGTH),
            role: "user",
            name: "Jason"
          }
        ],
        returnContext: true
      });
      this.episodeCount++;
      return response.context || null;
    } catch (err) {
      console.error("[ZepLoop] ingestAndRetrieve failed:", err.message);
      return null;
    }
  }
  /**
   * Ingest an assistant message. Fire-and-forget — don't block the UI.
   * Uses ignoreRoles to prevent Claude's outputs from becoming graph facts.
   *
   * @param {string} message - Assistant response text
   */
  async ingestAssistant(message) {
    if (!this._ready || !this.threadId) return;
    try {
      await this.client.thread.addMessages(this.threadId, {
        messages: [
          {
            content: message.slice(0, MAX_CONTENT_LENGTH),
            role: "assistant",
            name: "Claude"
          }
        ],
        ignoreRoles: ["assistant"]
      });
      this.episodeCount++;
    } catch (err) {
      console.error("[ZepLoop] ingestAssistant failed:", err.message);
    }
  }
  /**
   * Search the knowledge graph. Used by Layer 2 (model tools), not the pipeline.
   *
   * @param {object} params - Search parameters
   * @param {string} params.query - Search query
   * @param {string} [params.scope="edges"] - "edges" or "nodes"
   * @param {number} [params.limit=10] - Max results
   * @param {string} [params.entityType] - Filter by entity type
   * @param {string} [params.reranker="rrf"] - Reranker strategy
   * @returns {Promise<Array>} Search results
   */
  async search({ query, scope = "edges", limit = 10, entityType, reranker = "rrf" }) {
    try {
      const searchParams = {
        query,
        userId: this.userId,
        scope,
        limit,
        reranker
      };
      if (entityType) {
        searchParams.entityType = entityType;
      }
      const results = await this.client.graph.search(searchParams);
      return results.edges || results.nodes || [];
    } catch (err) {
      console.error("[ZepLoop] search failed:", err.message);
      return [];
    }
  }
  /**
   * Store a fact/decision/insight as a synthetic message.
   * Zep's entity extraction picks up the type from the content annotation.
   *
   * @param {string} content - What to store
   * @param {string} entityType - Type annotation: "Decision", "Insight", "Fact", etc.
   */
  async store(content, entityType) {
    if (!this._ready || !this.threadId) return;
    try {
      await this.client.thread.addMessages(this.threadId, {
        messages: [
          {
            content: `[${entityType}]: ${content}`,
            role: "user",
            name: "Jason"
          }
        ]
      });
      this.episodeCount++;
    } catch (err) {
      console.error("[ZepLoop] store failed:", err.message);
    }
  }
  /** Session stats for /memory-status */
  getStats() {
    return {
      ready: this._ready,
      threadId: this.threadId,
      sessionType: this.sessionType,
      episodeCount: this.episodeCount
    };
  }
};
export {
  ZepLoop
};
