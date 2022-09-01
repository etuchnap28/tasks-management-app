// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Express } from 'express-serve-static-core';

interface CookiesProps {
  jwt?: string;
}

export interface DecodedPayload {
  user: string;
}

interface Context {
  decodedPayload: DecodedPayload;
}

declare module 'express-serve-static-core' {
  interface Request {
    context?: Context;
    cookies: CookiesProps;
  }
}
