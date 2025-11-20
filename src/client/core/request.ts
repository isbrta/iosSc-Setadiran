import { debug } from '../../lib/debug';
import { Subject } from '../../lib/observable';
import { defaultsDeep, isPlainObject, isString } from '../../lib/utils';
import { AttemptOptions, retry } from '../../lib/attempt';
import { ScRequest, Options, Response } from '../../lib/sc-request';
import { SiApiClient } from './client';
import { SiClientError, SiNetworkError, SiResponseError } from '../errors';
import { SiResponse } from '../types';

export type SiOptions = Options & { app: string };

export class SiRequest {
  private static requestDebug = debug('ig:request');

  end$ = new Subject();
  error$ = new Subject<SiClientError>();
  attemptOptions: Partial<AttemptOptions<any>> = {
    maxAttempts: 1,
  };
  defaults: Partial<SiOptions> = {};
  private scReq: ScRequest = new ScRequest();
  constructor(private client: SiApiClient) {}

  public async send<T = any>(userOptions: SiOptions): Promise<SiResponse<T>> {
    const options = defaultsDeep(
      userOptions,
      {
        baseUrl: 'https://gw.setadiran.ir/api',
        jar: this.client.state.cookieJar,
        headers: this.getDefaultHeaders(),
        method: 'GET',
      },
      this.defaults,
    );
    SiRequest.requestDebug(`Requesting ${options.method} ${options.url || '[could not find url]'}`);
    const response = await this.faultTolerantRequest(options);
    this.updateState(response);
    this.end$.next(response);
    if (response.statusCode === 200) {
      return response;
    }
    const error = this.handleResponseError(response);
    Promise.resolve().then(() => this.error$.next(error));
    throw error;
  }

  private updateState(response: SiResponse<any>) {
    const { 'x-last-access-report': lastAccessReport } = response.headers || {};
    if (isString(lastAccessReport)) {
      this.client.state.lastAccessReport = lastAccessReport;
    }
  }

  async faultTolerantRequest(options: Options) {
    try {
      return await retry(async () => await this.scReq.request(options), this.attemptOptions);
    } catch (err) {
      throw new SiNetworkError(err instanceof Error ? err : new Error(String(err)));
    }
  }

  private handleResponseError(response: Response): SiClientError {
    SiRequest.requestDebug(
      `Request ${response.url} failed: ${
        typeof isPlainObject(response.body) ? JSON.stringify(response.body) : response.body
      }`,
    );
    throw new SiResponseError(response);
  }

  public getDefaultHeaders() {
    return {
      'User-Agent': 'Setad-Iran-App/1.0 (Scriptable)',
      Accept: 'application/json',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'X-Last-Access-Report': this.client.state.lastAccessReport || '0',
      'X-XSRF-TOKEN': this.client.state.getCookieCsrfToken(),
      Origin: 'https://fe.setadiran.ir',
    };
  }
}
