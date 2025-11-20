import { SiClientError } from './si-client.error';

export class SiCookieNotFoundError extends SiClientError {
  constructor(name: string) {
    super(`Cookie "${name}" not found`);
  }
}
