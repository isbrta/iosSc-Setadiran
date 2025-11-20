import { SiApiClient } from './client';
import { Enumerable } from '../decorators';

export abstract class Repository {
  @Enumerable(false)
  protected client!: SiApiClient;
  constructor(client: SiApiClient) {
    this.client = client;
  }
}
