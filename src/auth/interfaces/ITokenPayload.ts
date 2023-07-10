export interface ITokenPayload {
  sub: number;
  email: string;
  role: string;
  isSecondFactorAuthenticated?: boolean;
  iat?: any;
}
