import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";

export async function initializeDB(): Promise<DrizzleD1Database> {
  const { env } = await getCloudflareContext();
  return drizzle(env.DB);
}
