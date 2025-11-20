import { Response } from '../../lib/sc-request';

export type SiResponse<Body> = Pick<Response, Exclude<keyof Response, 'body'>> & { body: Body };
