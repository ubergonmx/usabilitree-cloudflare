import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import { EMAIL_SENDER } from "./lib/constants";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production", "test"]),
    CLOUDFLARE_ACCOUNT_ID: z.string().trim().min(1),
    CLOUDFLARE_DATABASE_ID: z.string().trim().min(1),
    CLOUDFLARE_D1_TOKEN: z.string().trim().min(1),
    DISCORD_CLIENT_ID: z.string().trim().min(1),
    DISCORD_CLIENT_SECRET: z.string().trim().min(1),
    GOOGLE_CLIENT_ID: z.string().trim().min(1),
    GOOGLE_CLIENT_SECRET: z.string().trim().min(1),
    SECRET_HASH: z.string().trim().min(1),
    MOCK_SEND_EMAIL: z.enum(["true", "false"]).transform((v) => v === "true"),
    SENDGRID_API_KEY: z.string().trim().min(1),
    EMAIL_SENDER: z.string().trim().min(1),
    SMTP_HOST: z.string().trim().min(1),
    SMTP_PORT: z.number().int().min(1),
    SMTP_USER: z.string().trim().min(1),
    SMTP_PASSWORD: z.string().trim().min(1),
  },
  client: { NEXT_PUBLIC_APP_URL: z.string().url() },
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NODE_ENV: process.env.NODE_ENV,
    CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
    CLOUDFLARE_DATABASE_ID: process.env.CLOUDFLARE_DATABASE_ID,
    CLOUDFLARE_D1_TOKEN: process.env.CLOUDFLARE_D1_TOKEN,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    SECRET_HASH: process.env.SECRET_HASH,
    MOCK_SEND_EMAIL: process.env.MOCK_SEND_EMAIL,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    EMAIL_SENDER: process.env.EMAIL_SENDER,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: parseInt(process.env.SMTP_PORT ?? ""),
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  },
  emptyStringAsUndefined: true,
});
