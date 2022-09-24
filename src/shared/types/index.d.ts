// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Express } from 'express-serve-static-core';
import { Types } from 'mongoose';

interface CookiesProps {
    jwt?: string;
}

export interface DecodedPayload {
    user: Types.ObjectId;
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
