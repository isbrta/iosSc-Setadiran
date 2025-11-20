export class SiClientError extends Error {
  constructor(message: string = 'Setadiran.ir API error was made.') {
    super(message);

    Object.defineProperty(this, 'name', {
      value: new.target?.name ?? 'SiClientError',
      enumerable: false,
    });

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
