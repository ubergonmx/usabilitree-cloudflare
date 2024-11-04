import { getRequestContext } from "@cloudflare/next-on-pages";
import { drizzle } from "drizzle-orm/d1";

const { env } = getRequestContext();

export const db = drizzle(env.DB);
