import { PrismaClient } from '@prisma/client';

let prismaInstance: PrismaClient;

export const getPrisma = () => {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient();
  }
  return prismaInstance;
};

// Lazy getter for the prisma export to avoid breaking existing code
export const prisma = new Proxy({} as PrismaClient, {
  get: (target, prop) => {
    return (getPrisma() as any)[prop];
  }
});
