import { config } from "dotenv";
import { cleanEnv, str } from "envalid";
config();

export const env = cleanEnv(process.env, {
  DB_URL: str(),
  DB_NAME: str(),
  JWT_SECRET: str(),
  JWT_EXPIRES_IN: str(),
  TWOFA_APP_NAME: str(),
});
