import { SiClientError } from './si-client.error';
import { Enumerable } from '../decorators';
import { SiResponse } from '../types/common.types';

export class SiResponseError<TBody extends { [x: string]: any } = any> extends SiClientError {
  @Enumerable(false)
  public text?: string;
  @Enumerable(false)
  public response?: SiResponse<TBody>;

  constructor(response: SiResponse<TBody>) {
    super(`${response.url} - ${response.statusCode}`);
    this.response = response;

    if (Array.isArray(response.body)) {
      this.text = response.body
        .map((e) => e?.message)
        .filter(Boolean)
        .join(' | ');
    } else if (typeof response.body?.message === 'string') {
      this.text = response.body.message;
    }
  }
}
