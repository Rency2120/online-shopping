import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN } = process.env;
export const { DB_URL } = process.env;
export const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;
export const { REDIS_HOST, REDIS_PORT } = process.env;

export const { STRIPE_SECRET_KEY } = process.env;

export const { COMMUNICATION_KEY, COMMUNICATION_KEY_ID, FRONT_END_URL, ADMIN_EMAIL, IMAGE_URL, S3_IMAGE_URL } = process.env;

export const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, QUEUE_URL, REGION, API_VERSION, LIVE_STREAM_BUCKET_NAME, BUCKET_REGION, SERVER_SECRET, APP_ID } =
  process.env;

export const DATATABLE = { limit: 100, skip: 0 };

export const MODULES = ['user', 'country', 'review', 'helpSupport', 'category', 'subscriptions'];
export const FEATURES = {
  user: ['read', 'write', 'update', 'delete'],
  country: ['read', 'write', 'update', 'delete'],
  review: ['read', 'write', 'update', 'delete'],
  helpSupport: ['read', 'write', 'update', 'delete'],
  category: ['read', 'write', 'update', 'delete'],
  subscriptions: ['read', 'write', 'update', 'delete'],
};
export const ROLES = ['USER', 'ADMIN'];
