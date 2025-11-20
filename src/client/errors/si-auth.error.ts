import { SiClientError } from './si-client.error';
import { Enumerable } from '../decorators';
import { SiResponse } from '../types';

export class SiAuthError extends SiClientError {
  @Enumerable(false)
  public text?: string;
  @Enumerable(false)
  public response?: SiResponse<string>;

  constructor(response: SiResponse<string>) {
    super(`${response.url} - ${response.statusCode}`);
    this.response = response;

    this.text = SiAuthError.extractMessageFromHtml(response.body) ?? 'Unknown login error';
  }
  private static extractMessageFromHtml(html: string): string | undefined {
    if (typeof html !== 'string') return undefined;
    const match = html.match(/var\s+authenticationException\s*=\s*["']([^"']+)["']/);
    return match ? decodeURIComponent(match[1]) : undefined;
  }
}
