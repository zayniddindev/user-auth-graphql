export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  twofa_enabled?: boolean;
  twofa_code?: string;
}
