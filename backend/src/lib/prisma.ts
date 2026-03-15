import { PrismaClient } from '@prisma/client';

let prismaInstance: PrismaClient;

export const getPrisma = () => {
  if (!prismaInstance) {
    // Runtime override for DATABASE_URL specifically for Vercel/Supabase Pooler
    let url = process.env.DATABASE_URL || "";
    
    if (url.includes('pooler.supabase.com')) {
      // Force port 6543
      if (url.includes(':5432')) {
        url = url.replace(':5432', ':6543');
      }
      // Force pgbouncer=true
      if (!url.includes('pgbouncer=true')) {
        const separator = url.includes('?') ? '&' : '?';
        url = `${url}${separator}pgbouncer=true`;
      }
      
      console.log('Prisma Lazy Init: Applying Supabase Pooler overrides');
      const maskedUrl = url.replace(/:([^:@]+)@/, ':****@');
      console.log(`Prisma final URL: ${maskedUrl}`);
      
      prismaInstance = new PrismaClient({
        datasources: {
          db: { url }
        }
      });
    } else {
      console.log('Prisma Lazy Init: Using default configuration');
      prismaInstance = new PrismaClient();
    }
  }
  return prismaInstance;
};

// Lazy getter for the prisma export to avoid breaking existing code
export const prisma = new Proxy({} as PrismaClient, {
  get: (target, prop) => {
    const instance = getPrisma();
    const value = (instance as any)[prop];
    return typeof value === 'function' ? value.bind(instance) : value;
  }
});
