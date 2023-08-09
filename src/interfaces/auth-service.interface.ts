export interface IRegisterUserPayload {
  name: string;
  email: string;
  password: string;
}

export interface ILoginUserPayload {
  email: string;
  password: string;
}

export interface IAuthTokens {
  access_token: string;
}

export interface IAuthanticatedUser {
  _id?: number;
}

export interface IAuthResolvers {
  register(payload: IRegisterUserPayload): Promise<string>;

  login(payload: ILoginUserPayload): Promise<IAuthTokens>;
}
