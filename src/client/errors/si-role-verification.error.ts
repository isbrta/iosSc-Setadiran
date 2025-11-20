import { SiClientError } from './si-client.error';
import { Enumerable } from '../decorators';
import { SiResponse } from '../types/common.types';

export class SiRoleVerificationError extends SiClientError {
  @Enumerable(false)
  public text?: string;
  @Enumerable(false)
  public response?: SiResponse<string>;

  constructor(response: SiResponse<string>) {
    super(`${response.url} - ${response.statusCode}`);
    this.response = response;
  }
}
