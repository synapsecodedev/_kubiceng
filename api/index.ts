// api/index.ts — VERIFY DEPLOYMENT v7
import type { VercelRequest, VercelResponse } from "@vercel/node";
import Fastify from "fastify";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const app = Fastify();
  res.status(200).json({ 
    status: "deployment_v7_fastify_imported", 
    fastify_version: app.version
  });
}
