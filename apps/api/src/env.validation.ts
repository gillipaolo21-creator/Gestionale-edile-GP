import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().min(16).required(),
  FRONTEND_URL: Joi.string().uri().required(),
  STORAGE_BASE_PATH: Joi.string().required(),

  // Opzionali con default
  API_PORT: Joi.number().port().default(3001),
  API_HOST: Joi.string().default('0.0.0.0'),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
});
