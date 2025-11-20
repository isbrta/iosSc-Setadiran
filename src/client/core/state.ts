import * as Constants from './constants';
import { Enumerable } from '../decorators';
import { debug } from './../../lib/debug';
import { ScCookieJar } from '../../lib/sc-cookie-jar';
import { SiCookieNotFoundError } from '../errors';
import { base64Decode } from '../../lib/scriptable';
import { isPlainObject, isString } from '../../lib/utils';
import { AppTagCode, AppType, EAucTagCode, EAucTagType } from './constants';

const AUTHORIZATION_TAG: unique symbol = Symbol('authorization-tag');

interface ParsedAuthorization {
  ds_user_id: string;
  sessionid: string;
  should_use_header_over_cookie: string;
  sub: string;
  [AUTHORIZATION_TAG]: string;
}

export class State {
  private static stateDebug = debug('ig:state');

  @Enumerable(false)
  constants = Constants;

  @Enumerable(false)
  cookieJar = new ScCookieJar();

  lastAccessReport?: string;
  authorization: Record<string, string> = {};

  @Enumerable(false)
  parsedAuthorization: Record<string, ParsedAuthorization> = {};

  getAppType(type: AppTagCode): AppType {
    const key = AppTagCode[type] as keyof typeof AppType;
    if (!(key in AppType)) {
      throw new Error(`Invalid AppTagCode: ${type}`);
    }
    return AppType[key];
  }

  getEAucTagType(type: EAucTagCode): EAucTagType {
    const key = EAucTagCode[type] as keyof typeof EAucTagType;
    if (!(key in EAucTagType)) {
      throw new Error(`Invalid EAucTagCode: ${type}`);
    }
    return EAucTagType[key];
  }

  getCookieCsrfToken(url: string = 'https://gw.setadiran.ir/api'): string {
    try {
      return this.extractCookieValue('XSRF-TOKEN', url);
    } catch {
      State.stateDebug('csrftoken lookup failed, returning "missing".');
      return 'missing';
    }
  }

  extractCookieValue(key: string, url: string): string {
    const cookie = this.cookieJar?.getCookie(key, url);
    if (!cookie) {
      State.stateDebug(`Could not find ${key}`);
      throw new SiCookieNotFoundError(key);
    }
    return cookie.value;
  }

  public getCurrentUser(app: string) {
    this.updateAuthorization(app);
    if (!this.parsedAuthorization[app]) {
      // State.logger.error('Could not find sub (user ID)');
      //throw new AuthorizationError('User ID not found in authorization token');
    }
    return this.parsedAuthorization[app].sub;
  }

  public deserialize(state: string | any) {
    State.stateDebug(`Deserializing state of type ${typeof state}`);

    const obj = isString(state) ? JSON.parse(state) : state;
    if (!isPlainObject(obj)) {
      State.stateDebug(`State deserialization failed, obj is of type ${typeof obj} (object expected)`);
      throw new TypeError("State isn't an object or serialized JSON");
    }
    State.stateDebug(`Deserializing ${Object.keys(obj).join(', ')}`);
    if (obj.cookies) {
      this.cookieJar.deserialize(obj.cookies);
      delete obj.cookies;
    }
    for (const [key, value] of Object.entries(obj)) {
      this[key] = value;
    }
  }
  public serialize() {
    const obj = {
      cookies: this.cookieJar.serialize(),
    };
    for (const [key, value] of Object.entries(this)) {
      obj[key] = value;
    }
    return obj;
  }

  private hasValidAuthorization(app: string) {
    return (
      this.authorization[app] &&
      this.parsedAuthorization &&
      this.parsedAuthorization[app] &&
      this.parsedAuthorization[app][AUTHORIZATION_TAG] === this.authorization[app]
    );
  }

  private updateAuthorization(app: string) {
    if (!this.hasValidAuthorization(app)) {
      const parts = this.authorization[app] && this.authorization[app].split('.');
      if (parts.length === 3) {
        try {
          const payloadBase64 = parts[1];
          // Handle base64url format (replace - with + and _ with /)
          const cleanBase64 = payloadBase64
            .replace(/-/g, '+')
            .replace(/_/g, '/')
            .padEnd(payloadBase64.length + ((4 - (payloadBase64.length % 4)) % 4), '=');

          // Add a tag to track which token this parsed data belongs to
          this.parsedAuthorization[app] = {
            ...JSON.parse(base64Decode(cleanBase64)),
            [AUTHORIZATION_TAG]: this.authorization[app],
          };
        } catch (e) {
          State.stateDebug(`Could not parse authorization: ${e}`);
          delete this.parsedAuthorization[app];
        }
      } else {
        delete this.parsedAuthorization[app];
      }
    }
  }
}
