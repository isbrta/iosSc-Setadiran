import { SiClientError } from './si-client.error';

export class SiNetworkError extends SiClientError {
  constructor(e: Error) {
    super();
    Object.assign(this, e);
  }
}
