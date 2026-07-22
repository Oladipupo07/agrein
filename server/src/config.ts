import dotenv from 'dotenv';

// Ensure environment variables are loaded regardless of import order
dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value || value.length === 0) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
      `See server/.env.example for the full list of supported variables.`
    );
  }
  return value;
}

export const config = {
  jwtSecret: required('JWT_SECRET'),
  port: Number(process.env.PORT) || 5000,
  databaseUrl: process.env.DATABASE_URL,
};
