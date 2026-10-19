import 'dotenv/config';

function required(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function port(name: string, fallback: number): number {
  const value = process.env[name];

  if (!value) {
    return fallback;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65_535) {
    throw new Error(`${name} must be a valid port number`);
  }

  return parsed;
}

const nodeEnv = process.env.NODE_ENV ?? 'development';
const databaseUrl = required('DATABASE_URL');

const host = new URL(databaseUrl).hostname;
const isLocal = host === 'localhost' || host === '127.0.0.1';

if (nodeEnv !== 'development' && nodeEnv !== 'production') {
  throw new Error('NODE_ENV must be development or production');
}

if (nodeEnv === 'development' && !isLocal) {
  throw new Error(
    'NODE_ENV development requires a local PostgreSQL connection',
  );
}

if (nodeEnv === 'production' && isLocal) {
  throw new Error(
    'NODE_ENV production requires a remote PostgreSQL connection',
  );
}

export const env = {
  nodeEnv,
  port: port('PORT', 3000),
  databaseUrl,
  googleApiKey: required('GOOGLE_API_KEY'),
  jwtSecret: required('JWT_SECRET'),
} as const;
