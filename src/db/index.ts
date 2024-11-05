import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";

let db: ReturnType<typeof drizzle>;

async function initializeDB() {
  const { env } = await getCloudflareContext();
  db = drizzle(env.DB);
}

initializeDB();

export { db };
