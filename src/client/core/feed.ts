import { SiResponseError } from '../errors';
import { Repository } from './repository';
import { AttemptOptions, retry } from '../../lib/attempt';
import { Observable } from '../../lib/observable';

export abstract class Feed<Response = any, Item = any> extends Repository {
  public attemptOptions: Partial<AttemptOptions<any>> = {
    delay: 60000,
    factor: 1.5,
    maxAttempts: 10,
    minDelay: 60000,
    maxDelay: 300000,
    jitter: true,
  };

  pageNumber = 0;
  pageCount = 10;
  protected moreAvailable: boolean = false;

  public get items$() {
    return this.observable();
  }
  public observable(attemptOptions?: Partial<AttemptOptions<any>>) {
    return new Observable<Item[]>((observer) => {
      let subscribed = true;
      const run = async () => {
        do {
          try {
            await retry(
              async () => {
                const items = await this.items();
                observer.next(items);
              },
              {
                handleError(error, context) {
                  // If instagram just tells us to wait - we are waiting.
                  /*  if (
                    error instanceof IgResponseError &&
                    [400, 429, 500, 502].includes(error.response.statusCode) &&
                    subscribed
                  ) {
                    return;
                  } else {*/
                  context.abort();
                  // }
                },
                ...(attemptOptions ?? this.attemptOptions),
              },
            );
          } catch (e) {
            observer.error(e);
          }
        } while (this.isMoreAvailable() && subscribed);
        observer.complete();
      };
      Promise.resolve().then(run);
      return function unsubscribe() {
        subscribed = false;
      };
    });
  }
  protected abstract set state(response: Response);

  abstract request(...args: any[]): Promise<Response>;

  abstract items(): Promise<Item[]>;

  public isMoreAvailable() {
    return !!this.moreAvailable;
  }
}
