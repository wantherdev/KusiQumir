import * as Joi from "joi";

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),
  PORT: Joi.number().port().default(3000),
  DATABASE_URL: Joi.string().uri().required().messages({
    "any.required": "DATABASE_URL es requerida",
    "string.uri": "DATABASE_URL debe ser una URL válida",
  }),
  CSRF_SECRET: Joi.string().min(16).optional(),
  JWT_SECRET: Joi.string().min(16).required().messages({
    "any.required": "JWT_SECRET es requerida",
    "string.min":
      "JWT_SECRET debe tener al menos 16 caracteres por seguridad",
  }),
  JWT_EXPIRES_IN: Joi.string().default("1h").messages({
    "string.base": "JWT_EXPIRES_IN debe ser un string (ej: 1h, 7d)",
  }),
  JWT_COOKIE_MAX_AGE: Joi.number().integer().positive().default(604800000).messages({
    "number.base": "JWT_COOKIE_MAX_AGE debe ser un número en milisegundos",
  }),
  CORS_ORIGIN: Joi.string().required().custom((value, helpers) => {
    const origins = value.split(",").map((s: string) => s.trim()).filter(Boolean);
    for (const origin of origins) {
      if (origin !== "*" && Joi.string().uri().validate(origin).error) {
        return helpers.error("any.invalid", { value: origin });
      }
    }
    return value;
  }).messages({
    "any.required": "CORS_ORIGIN es requerida (orígenes separados por coma, ej: https://kusiqumir.com)",
    "any.invalid": "Cada origen en CORS_ORIGIN debe ser una URL válida o '*'",
  }),
  WHATSAPP_PHONE: Joi.string()
    .pattern(/^\d{10,15}$/)
    .default("51999000000")
    .messages({
      "string.pattern.base":
        "WHATSAPP_PHONE debe ser un número de 10-15 dígitos (ej: 51999000000)",
    }),
  DEFAULT_NATIONALITY: Joi.string().length(2).default("PE").messages({
    "string.length": "DEFAULT_NATIONALITY debe ser un código de país de 2 caracteres (ISO 3166-1 alpha-2)",
  }),
  COMMISSION_RATE: Joi.number().min(0).max(1).default(0.12).messages({
    "number.min": "COMMISSION_RATE debe ser un número entre 0 y 1",
    "number.max": "COMMISSION_RATE debe ser un número entre 0 y 1",
  }),
  PRISMA_MAX_RETRIES: Joi.number().integer().min(1).max(10).default(3).messages({
    "number.min": "PRISMA_MAX_RETRIES debe ser al menos 1",
    "number.max": "PRISMA_MAX_RETRIES no debe exceder 10",
  }),
  PRISMA_RETRY_DELAY: Joi.number().integer().min(100).max(10000).default(1000).messages({
    "number.min": "PRISMA_RETRY_DELAY debe ser al menos 100ms",
    "number.max": "PRISMA_RETRY_DELAY no debe exceder 10000ms",
  }),
  NOTIFICATIONS_ENABLED: Joi.boolean().default(false).messages({
    "boolean.base": "NOTIFICATIONS_ENABLED debe ser true o false",
  }),
  CSRF_SKIP_PATHS: Joi.string().default("auth/csrf,auth/login,auth/register,health").messages({
    "string.base": "CSRF_SKIP_PATHS debe ser un string de rutas separadas por coma",
  }),
  CSRF_SECURE: Joi.boolean().default(false).messages({
    "boolean.base": "CSRF_SECURE debe ser true o false",
  }),
  SENTRY_DSN: Joi.string().uri().optional().allow("").messages({
    "string.uri": "SENTRY_DSN debe ser una URL válida",
  }),
});

export type EnvConfig = {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_COOKIE_MAX_AGE: number;
  CORS_ORIGIN: string;
  WHATSAPP_PHONE: string;
  SENTRY_DSN?: string;
  DEFAULT_NATIONALITY: string;
  COMMISSION_RATE: number;
  PRISMA_MAX_RETRIES: number;
  PRISMA_RETRY_DELAY: number;
  NOTIFICATIONS_ENABLED: boolean;
  CSRF_SKIP_PATHS: string;
  CSRF_SECURE: boolean;
};
