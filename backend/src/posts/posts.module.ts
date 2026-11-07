import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { PostsController } from './posts.controller.js';
import { PostsService } from './posts.service.js';

// Groups everything about posts.
// imports: PrismaModule, so PostsService can receive PrismaService.
@Module({
  imports: [PrismaModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
