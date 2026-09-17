export default interface ConfigTypes {
  // Server
  PORT: string;
  SERVER_URL: string;
  CLIENT_URL: string;
  NODE_ENV: string;

  // JWT Secret
  JWT_SECRET: string;

  // Database
  MONGO_URI: string;

  // SMS Providers
  BULK_API_KEY: string;
  BULK_SENDER_ID: string;

  GATE_USERNAME: string;
  GATE_PASSWORD: string;
  GATE_DEVICE_ID: string;
  GATE_SIM: string;

  // Cloudflare
  MAIL_API_KEY: string;
  CLOUDFLARE_ACCOUNT_ID: string;
  MAIL_FROM: string;
  APP_NAME: string;
}
