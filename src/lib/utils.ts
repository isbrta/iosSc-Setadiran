export const { isArray } = Array;

export const isFunction = (val: unknown): val is Function => typeof val === 'function';

export const isString = (val: unknown): val is string => typeof val === 'string';

export const isNumber = (val: unknown): val is number => typeof val === 'number';

export const isUndefined = (val: unknown): val is undefined => typeof val === 'undefined';

export const isPromise = <T = unknown>(val: unknown): val is Promise<T> =>
  isObject(val) && isFunction((val as any).then);

export const isObject = (thing: unknown): thing is object => thing !== null && typeof thing === 'object';

export const isBoolean = (thing: unknown): thing is boolean => thing === true || thing === false;

export const isPlainObject = (val: unknown): val is Record<string | symbol, unknown> => {
  if (Object.prototype.toString.call(val) !== '[object Object]') return false;

  const proto = Object.getPrototypeOf(val);
  return proto === null || proto === Object.prototype || Object.getPrototypeOf(proto) === null;
};

export const isEmptyObject = (val: unknown): val is Record<string | symbol, never> => {
  return isObject(val) && Object.keys(val).length === 0 && Object.getPrototypeOf(val) === Object.prototype;
};

export const isDate = (val: unknown): val is Date => Object.prototype.toString.call(val) === '[object Date]';

// parseUrl
export interface ParsedUrl {
  protocol?: string;
  domain?: string;
  path?: string;
  query?: string;
  fragment?: string;
}

export const parseUrl = (url: string): ParsedUrl => {
  const pattern = /^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;

  const match = url.match(pattern);

  if (!match) {
    return {};
  }

  const [, , protocol, , domain, path, , query, , fragment] = match;

  return {
    protocol,
    domain,
    path,
    query,
    fragment,
  };
};

// defaultsDeep
export const defaultsDeep = <T extends object>(target: T, ...sources: Array<Partial<T>>): T => {
  if (!isObject(target)) return target;

  for (const source of sources) {
    if (!isObject(source)) continue;

    for (const key of Reflect.ownKeys(source)) {
      const srcVal = (source as any)[key];
      const tgtVal = (target as any)[key];

      if (tgtVal === undefined) {
        (target as any)[key] = srcVal;
      } else if (isPlainObject(tgtVal) && isPlainObject(srcVal)) {
        defaultsDeep(tgtVal, srcVal);
      } else if (Array.isArray(tgtVal) && Array.isArray(srcVal)) {
        for (let i = 0; i < tgtVal.length; i++) {
          if (srcVal[i] !== undefined && isPlainObject(tgtVal[i]) && isPlainObject(srcVal[i])) {
            defaultsDeep(tgtVal[i], srcVal[i]);
          }
        }
      }
    }
  }

  return target;
};

// deepAssign
type Constructor<T> = new (...args: any[]) => T;

interface DeepAssignOptions {
  typeMap?: Record<string, Constructor<any>>;
  excludeExtraneousValues?: boolean;
}

export const deepAssign = <T extends Record<string, any>>(
  target: T,
  plain: Partial<T>,
  options: DeepAssignOptions = {},
): T => {
  const { typeMap = {}, excludeExtraneousValues = false } = options;

  if (!plain || typeof plain !== 'object') {
    return target;
  }

  Object.keys(plain).forEach((key) => {
    const value = plain[key as keyof T];

    if (excludeExtraneousValues && !(key in target)) {
      return;
    }
    if (value === undefined) {
      return;
    }

    const targetValue = target[key];

    // Nested object transformation based on typeMap
    if (typeMap[key] && value && typeof value === 'object' && !Array.isArray(value)) {
      const cls = typeMap[key];
      const nestedInstance = targetValue instanceof cls ? targetValue : new cls();
      (target as any)[key] = deepAssign(nestedInstance, value, options);
    } else if (
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      targetValue &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      deepAssign(targetValue, value, options);
    } else if (Array.isArray(targetValue) && Array.isArray(value)) {
      const itemType = typeMap[`${key}[]`];
      (target as any)[key] = value.map((item: any, index: number) => {
        const existingItem = targetValue[index];
        if (
          item &&
          typeof item === 'object' &&
          !Array.isArray(item) &&
          (itemType || (existingItem && typeof existingItem === 'object'))
        ) {
          const cls = itemType || (existingItem ? existingItem.constructor : undefined);
          if (!cls) return item;
          const nestedInstance = existingItem instanceof cls ? existingItem : new cls();
          return deepAssign(nestedInstance, item, options);
        }
        return item;
      });
    } else {
      (target as any)[key] = value;
    }
  });

  return target;
};

export const joinIfArray = <T>(v: T[] | T | null | undefined): string | null =>
  v ? (isArray(v) ? v.join(',') : String(v)) : null;

export const formatDateISO = (v: Date | string | number | null | undefined): string | null => {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
};
