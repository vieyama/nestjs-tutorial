export interface ITokenPayload {
  sub: string;
  email: string;
  role: string;
  isSecondFactorAuthenticated?: boolean;
  iat?: any;
}
