import { FastifyInstance } from "fastify";
import { getPrisma } from "../lib/prisma";

export async function healthRoutes(app: FastifyInstance) {
  app.get("/health", async (request, reply) => {
    try {
      const prisma = getPrisma();
      await prisma.$queryRaw`SELECT 1`;
      return { status: "ok", database: "connected" };
    } catch (error) {
      console.error("Database connection failed", error);
      return reply.status(500).send({
        status: "error",
        message: "Database connection failed",
        error: String(error),
      });
    }
  });
}

export default healthRoutes;
