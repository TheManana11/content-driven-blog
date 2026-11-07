import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

// PrismaService IS a PrismaClient (it extends it), so any service that
// receives it can run queries such as this.prisma.post.findMany().
//
// @Injectable() lets Nest create one instance and inject it wherever it is
// asked for in a constructor (Dependency Injection).
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  // Nest injects ConfigService here, because ConfigModule is global.
  constructor(configService: ConfigService) {
    // Prisma 7 talks to PostgreSQL through a "driver adapter".
    // PrismaPg uses the standard `pg` driver with our connection string.
    const adapter = new PrismaPg({
      connectionString: configService.getOrThrow<string>('DATABASE_URL'),
    });
    super({ adapter });
  }

  // Lifecycle hook: Nest calls this once when the app starts.
  // Connecting here means a wrong DATABASE_URL fails at startup, not later.
  async onModuleInit() {
    await this.$connect();
  }

  // Lifecycle hook: Nest calls this when the app shuts down.
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
