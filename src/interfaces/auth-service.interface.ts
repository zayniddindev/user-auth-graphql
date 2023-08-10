export interface IRegisterUserPayload {
  name: string;
  email: string;
  password: string;
}

export interface IUpdate2FAOptions {
  twofa_enabled?: boolean;
  twofa_code?: string;
}

export interface ILoginUserPayload {
  email: string;
  password: string;
}

export interface ILoginUserWith2FAPayload {
  email: string;
  password: string;
  otp: string;
}

export interface IAuthTokens {
  access_token: string;
}

export interface IAuthanticatedUser {
  _id?: string;
}

export interface IAuthResolvers {
  register(payload: IRegisterUserPayload): Promise<string>;

  login(payload: ILoginUserPayload): Promise<IAuthTokens>;

  generateQRCode(_id: string): Promise<string>;

  enable2fa(_id: string, twofa_code: string): Promise<boolean>;

  loginWith2fa(payload: ILoginUserWith2FAPayload): Promise<IAuthTokens>;
}
