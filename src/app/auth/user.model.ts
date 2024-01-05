import { JwtHelperService } from '@auth0/angular-jwt';

export class User {
  constructor(
    public _id: string,
    public name: string,
    public email: string,
    public age: number,
    public _token: string
  ) {}

  static jwtHelper: JwtHelperService = new JwtHelperService();

  get token() {
    try {
      if (User.jwtHelper.isTokenExpired(this._token)) {
        return null;
      }
      return this._token;
    } catch (error) {
      return null;
    }
  }

  static getTokenExpirationDuration(authToken: string): number {
    const decodedToken = this.jwtHelper.decodeToken(authToken);
    if (decodedToken?.exp) {
      const expirationDuration =
        new Date(+decodedToken.exp * 1000).getTime() - new Date().getTime();
      return expirationDuration;
    }
  }
}
