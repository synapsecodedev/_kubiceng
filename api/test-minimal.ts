import type { VercelRequest, VercelResponse } from "@vercel/node";
import fastify from "fastify";
import cors from "@fastify/cors";

const app = fastify({ logger: true });

app.register(cors, { origin: "*" });

app.get("/test-minimal", async () => {
  return { status: "minimal-ok", time: new Date().toISOString() };
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const response = await app.inject({
      method: req.method as any,
      url: "/test-minimal",
      headers: req.headers as any,
      payload: req.body || undefined,
    });

    res.status(response.statusCode);
    res.send(response.body);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
