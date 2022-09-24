import winston from 'winston';
import { config } from '@config/config';

const customLevels = {
    levels: {
        trace: 5,
        debug: 4,
        info: 3,
        warn: 2,
        error: 1,
        fatal: 0,
    },
    colors: {
        trace: 'white',
        debug: 'green',
        info: 'blue',
        warn: 'yellow',
        error: 'red',
        fatal: 'red',
    },
};

const level = () => {
    return config.app.isDevEnvironment() ? 'trace' : 'warn';
};

const formatter = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(info => {
        const { timestamp, level, message, ...meta } = info;

        /* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */
        return `${timestamp} [${level}]: ${message} ${
            Object.keys(meta).length > 0 ? JSON.stringify(meta, null, 2) : ''
        }`;
    })
);

class Logger {
    private readonly logger: winston.Logger;

    constructor() {
        const prodTransport = new winston.transports.File({
            filename: '../../logs/error.log',
            level: 'error',
        });
        const transport = new winston.transports.Console({
            format: formatter,
        });
        this.logger = winston.createLogger({
            level: level(),
            levels: customLevels.levels,
            transports: [config.app.isDevEnvironment() ? transport : prodTransport],
        });
        winston.addColors(customLevels.colors);
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    trace(msg: any, meta?: any) {
        this.logger.log('trace', msg, meta);
    }

    debug(msg: any, meta?: any) {
        this.logger.debug(msg, meta);
    }

    info(msg: any, meta?: any) {
        this.logger.info(msg, meta);
    }

    warn(msg: any, meta?: any) {
        this.logger.warn(msg, meta);
    }

    error(msg: any, meta?: any) {
        this.logger.error(msg, meta);
    }

    fatal(msg: any, meta?: any) {
        this.logger.log('fatal', msg, meta);
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */
}

export const logger = new Logger();
