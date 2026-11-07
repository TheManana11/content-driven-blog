import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';

// The root module. Nest starts here and loads every module listed in `imports`.
// PostsModule (Phase 4) will be added to this list.
@Module({
  imports: [
    // Reads the .env file into process.env when the app starts.
    // isGlobal: true makes ConfigService available in every module
    // without importing ConfigModule again.
    ConfigModule.forRoot({ isGlobal: true }),
    // Creates PrismaService, which connects to PostgreSQL on startup.
    PrismaModule,
  ],
})
export class AppModule {}
