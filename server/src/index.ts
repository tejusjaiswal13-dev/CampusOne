import { createProvider } from "./ai/provider";
import { mountAI } from "./ai/routes";
import "dotenv/config";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { openDatabase } from "./db";
import { createApp } from "./app";
const filename = process.env.DATABASE_PATH || "server/data/campusone.sqlite";
mkdirSync(dirname(filename), { recursive: true });
const store = openDatabase(filename);
if (process.env.SEED_DEMO === "true") {
  if (!process.env.DEMO_PASSWORD || process.env.DEMO_PASSWORD.length < 12)
    throw new Error(
      "Set DEMO_PASSWORD with at least 12 characters to seed sample accounts",
    );
  store.seedDatabase(process.env.DEMO_PASSWORD);
}
const server = createApp(store, {
  secret: process.env.JWT_SECRET || "",
  origins: process.env.CORS_ORIGINS?.split(","),
});
mountAI(server, createProvider());
server
  .finish()
  .listen(Number(process.env.PORT || 3001), "0.0.0.0", () =>
    console.log("CampusOne API listening on configured port"),
  );
