export interface IAppConfig {
  port: number;
}

export interface IAuthConfig {
  jwt: {
    secret: string;
    expiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
  };
}

export interface IDbConfig {
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
}

export interface IConfig {
  app: IAppConfig;
  auth: IAuthConfig;
  db: IDbConfig;
}
