import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const { env: cfEnv } = await getCloudflareContext();

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
    NEXT_PUBLIC_APP_URL: cfEnv.NEXT_PUBLIC_APP_URL,
    NODE_ENV: cfEnv.NODE_ENV,
    CLOUDFLARE_ACCOUNT_ID: cfEnv.CLOUDFLARE_ACCOUNT_ID,
    CLOUDFLARE_DATABASE_ID: cfEnv.CLOUDFLARE_DATABASE_ID,
    CLOUDFLARE_D1_TOKEN: cfEnv.CLOUDFLARE_D1_TOKEN,
    DISCORD_CLIENT_ID: cfEnv.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: cfEnv.DISCORD_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: cfEnv.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: cfEnv.GOOGLE_CLIENT_SECRET,
    SECRET_HASH: cfEnv.SECRET_HASH,
    MOCK_SEND_EMAIL: cfEnv.MOCK_SEND_EMAIL,
    SENDGRID_API_KEY: cfEnv.SENDGRID_API_KEY,
    EMAIL_SENDER: cfEnv.EMAIL_SENDER,
    SMTP_HOST: cfEnv.SMTP_HOST,
    SMTP_PORT: parseInt(cfEnv.SMTP_PORT ?? ""),
    SMTP_USER: cfEnv.SMTP_USER,
    SMTP_PASSWORD: cfEnv.SMTP_PASSWORD,
  },
  emptyStringAsUndefined: true,
});
