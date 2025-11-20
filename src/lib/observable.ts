import { isFunction } from './utils';

export interface Observer<T> {
  next(value: T): void;
  error(err: unknown): void;
  complete(): void;
}

export interface Subscription {
  unsubscribe(): void;
  readonly closed: boolean;
}

export type TeardownLogic = (() => void) | void;

function normalizeObserver<T>(input?: Partial<Observer<T>> | ((value: T) => void)): Observer<T> {
  if (isFunction(input)) {
    return {
      next: input,
      error: (err) => {
        throw err;
      },
      complete: () => {},
    };
  }

  return {
    next: input?.next ?? (() => {}),
    error:
      input?.error ??
      ((err) => {
        throw err;
      }),
    complete: input?.complete ?? (() => {}),
  };
}

export class Observable<T> {
  private readonly _subscribe: (observer: Observer<T>) => TeardownLogic;

  constructor(subscribe: (observer: Observer<T>) => TeardownLogic) {
    this._subscribe = subscribe;
  }

  subscribe(observerOrNext?: Partial<Observer<T>> | ((value: T) => void)): Subscription {
    const observer = normalizeObserver(observerOrNext);
    let closed = false;

    const teardown = this._subscribe(observer);

    return {
      unsubscribe: () => {
        if (!closed) {
          closed = true;
          if (typeof teardown === 'function') teardown();
        }
      },
      get closed() {
        return closed;
      },
    };
  }
}

export class Subject<T> extends Observable<T> implements Observer<T> {
  private observers = new Set<Observer<T>>();
  private isStopped = false;
  private hasError = false;
  private thrownError: unknown = null;

  constructor() {
    super((observer) => {
      if (this.hasError) {
        observer.error(this.thrownError);
        return;
      }
      if (this.isStopped) {
        observer.complete();
        return;
      }
      this.observers.add(observer);
      return () => this.observers.delete(observer);
    });
  }

  next(value: T): void {
    if (!this.isStopped) {
      for (const observer of this.observers) {
        observer.next(value);
      }
    }
  }

  error(err: unknown): void {
    if (!this.isStopped) {
      this.hasError = true;
      this.thrownError = err;
      for (const observer of this.observers) {
        observer.error(err);
      }
      this.observers.clear();
      this.isStopped = true;
    }
  }

  complete(): void {
    if (!this.isStopped) {
      for (const observer of this.observers) {
        observer.complete();
      }
      this.observers.clear();
      this.isStopped = true;
    }
  }
}
