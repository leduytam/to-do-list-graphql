import { IUserPayload } from '../auth/types/user-payload.interface';

export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;

      JWT_SECRET: string;
      JWT_EXPIRES_IN: string;
      JWT_REFRESH_SECRET: string;
      JWT_REFRESH_EXPIRES_IN: string;

      DB_TYPE: string;
      DB_HOST: string;
      DB_PORT: string;
      DB_USERNAME: string;
      DB_PASSWORD: string;
      DB_DATABASE: string;
    }
  }

  namespace Express {
    interface User extends IUserPayload {}
  }
}
