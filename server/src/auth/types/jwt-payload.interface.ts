export interface IJwtPayload {
  sub: string;
  username: string;
  iat?: number;
  exp?: number;
}
