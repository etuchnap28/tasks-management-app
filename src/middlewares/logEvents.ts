import { config } from '@config/config';
import { logger } from '@shared/classes/Logger';
import morgan, { StreamOptions } from 'morgan';

const stream: StreamOptions = {
    write: message => logger.info(message),
};

const skip = () => {
    return !config.app.isDevEnvironment();
};

export const morganMiddleware = morgan('dev', { stream, skip });
