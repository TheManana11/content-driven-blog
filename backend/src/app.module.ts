import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module.js';

// The root module. Nest starts here and loads every module listed in `imports`.
@Module({
  imports: [
    // Reads the .env file into process.env when the app starts.
    // isGlobal: true makes ConfigService available in every module
    // without importing ConfigModule again.
    ConfigModule.forRoot({ isGlobal: true }),
    // The posts feature. It imports PrismaModule itself, so the database
    // connection is created (and checked) when the app starts.
    PostsModule,
  ],
})
export class AppModule {}
