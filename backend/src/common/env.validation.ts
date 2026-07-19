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
  CORS_ORIGIN: Joi.string().required().messages({
    "any.required": "CORS_ORIGIN es requerida (orígenes separados por coma, ej: https://kusiqumir.com)",
  }),
  WHATSAPP_PHONE: Joi.string()
    .pattern(/^\d{10,15}$/)
    .default("51999000000")
    .messages({
      "string.pattern.base":
        "WHATSAPP_PHONE debe ser un número de 10-15 dígitos (ej: 51999000000)",
    }),
  SENTRY_DSN: Joi.string().uri().optional().allow(""),
});

export type EnvConfig = {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  CORS_ORIGIN: string;
  WHATSAPP_PHONE: string;
  SENTRY_DSN?: string;
};
