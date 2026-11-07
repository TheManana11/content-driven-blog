// Configuration for the Prisma CLI (prisma migrate, prisma generate, prisma studio).
// The running NestJS app does not use this file; it connects in PrismaService.
import 'dotenv/config'; // loads DATABASE_URL from .env into process.env
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env['DATABASE_URL'],
  },
});
