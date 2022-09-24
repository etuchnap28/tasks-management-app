import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_USERNAME = process.env.MONGO_USERNAME ?? 'admin';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD ?? 'admin';
const MONGO_URI = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@task-manager.vnikm2z.mongodb.net/?retryWrites=true&w=majority`;

const SERVER_PORT = process.env.PORT ?? 8000;

const ALLOWED_ORIGINS = ['http://localhost:8000', 'http://localhost:3000'];

const CORS_OPTIONS: cors.CorsOptions = {
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token', 'Authorization'],
    credentials: true,
    methods: 'GET, HEAD, OPTIONS, PUT, PATCH, POST, DELETE',
    origin: ALLOWED_ORIGINS,
};

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET ?? 'accessSecret2801';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET ?? 'refreshSecret2801';

const ENV = process.env.NODE_ENV ?? 'development';
const isDevEnvironment = () => ENV === 'development';

const ACCESS_TOKEN_LIFE = isDevEnvironment() ? '1h' : '10m';
const REFRESH_TOKEN_LIFE = isDevEnvironment() ? '12h' : '1h';

const JWT_COOKIE_LIFE = isDevEnvironment() ? 12 * 60 * 60 * 1000 : 60 * 60 * 1000;

export const config = {
    app: {
        env: ENV,
        isDevEnvironment,
    },
    mongo: {
        uri: MONGO_URI,
    },
    server: {
        port: SERVER_PORT,
        allowedOrigins: ALLOWED_ORIGINS,
        corsOptions: CORS_OPTIONS,
    },
    cookie: {
        jwtLife: JWT_COOKIE_LIFE,
    },
    jwt: {
        accessTokenSecret: ACCESS_TOKEN_SECRET,
        refreshTokenSecret: REFRESH_TOKEN_SECRET,
        accessTokenLife: ACCESS_TOKEN_LIFE,
        refreshTokenLife: REFRESH_TOKEN_LIFE,
    },
};
