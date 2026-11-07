import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

// Packages PrismaService so other modules can use it.
// `providers` tells Nest to create PrismaService;
// `exports` lets any module that imports PrismaModule inject it.
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
