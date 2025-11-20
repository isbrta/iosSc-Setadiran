import { isString, parseUrl } from './utils';

// scriptable-ios Request.response.cookie
export interface Cookie {
  name: string;
  value: string;
  domain?: string;
  path?: string;
  expiresDate?: string;
  [key: string]: any;
}

export type CookieMap = Record<string, Cookie[]>;

export class ScCookieJar {
  private cookies: CookieMap;

  constructor(cookies: CookieMap = {}) {
    this.cookies = cookies;
  }

  setCookie(cookie: Cookie): Cookie | false {
    const remove = cookie.expiresDate && Date.parse(cookie.expiresDate) <= Date.now();
    const cookiesList = this.cookies[cookie.name] || [];
    const existingIndex = cookiesList.findIndex((c) => this.matches(c, cookie.domain, cookie.path));

    if (existingIndex !== -1) {
      if (remove) {
        cookiesList.splice(existingIndex, 1);
        if (!cookiesList.length) {
          delete this.cookies[cookie.name];
        }
        return false;
      }
      cookiesList[existingIndex] = cookie;
      return cookie;
    }

    if (remove) {
      return false;
    }

    cookiesList.push(cookie);
    this.cookies[cookie.name] = cookiesList;
    return cookie;
  }

  getCookie(cookieName: string, url: string): Cookie | undefined {
    const parsedUrl = parseUrl(url);
    const cookiesList = this.cookies[cookieName];
    if (!cookiesList) {
      return;
    }

    for (const cookie of cookiesList) {
      if (!this.isExpired(cookie) && this.matches(cookie, parsedUrl.domain, parsedUrl.path)) {
        return cookie;
      }
    }
    return;
  }

  getCookies(url: string): Cookie[] & { toValueString(): string } {
    const parsedUrl = parseUrl(url);
    const matches = Object.values(this.cookies)
      .flat()
      .filter((cookie) => !this.isExpired(cookie) && this.matches(cookie, parsedUrl.domain, parsedUrl.path));

    const result = Object.assign([...matches], {
      toValueString: () => matches.map((c) => `${c.name}=${c.value}`).join('; '),
    });
    return result;
  }

  setCookies(cookieArray: Cookie[], url: string): Cookie[] {
    const successful: Cookie[] = [];
    for (const cookie of cookieArray) {
      if (cookie.name && cookie.value && this.setCookie(cookie)) {
        successful.push(cookie);
      }
    }
    return successful;
  }

  serialize(): string {
    return JSON.stringify(this.cookies);
  }

  deserialize(data: string | CookieMap): this {
    let parsed: CookieMap;

    if (isString(data)) {
      parsed = JSON.parse(data) as CookieMap;
    } else {
      parsed = data;
    }

    this.cookies = parsed;
    return this;
  }
  private matches(cookie: Cookie, domain?: string, path?: string): boolean {
    if (!path || !domain) {
      return false;
    }
    if (cookie.path && !path.startsWith(cookie.path)) {
      return false;
    }

    const accessDomain = domain.replace(/^\./, '');
    const cookieDomain = cookie.domain?.replace(/^\./, '');

    if (cookieDomain === accessDomain) {
      return true;
    }
    return cookieDomain ? accessDomain.endsWith(cookieDomain) : false;
  }

  private isExpired(cookie: Cookie): boolean {
    return !!cookie.expiresDate && Date.parse(cookie.expiresDate) <= Date.now();
  }
}
