import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePostDto } from './dto/create-post.dto.js';
import { UpdatePostDto } from './dto/update-post.dto.js';

// The largest number a PostgreSQL INTEGER column (our "id") can hold.
const MAX_POST_ID = 2_147_483_647;

// All the logic for posts lives here. The controller only passes data in;
// this service talks to the database through PrismaService.
@Injectable()
export class PostsService {
  // Dependency Injection: Nest sees that this constructor needs a
  // PrismaService and passes in the single instance created by PrismaModule.
  // `private readonly prisma` also stores it as this.prisma.
  constructor(private readonly prisma: PrismaService) {}

  // SELECT * FROM "Post" ORDER BY "createdAt" DESC
  findAll() {
    return this.prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
  }

  // SELECT * FROM "Post" WHERE id = $1
  async findOne(id: number) {
    // An id outside the INTEGER range can never exist. Asking PostgreSQL
    // anyway would make it throw an error (and Nest answer 500).
    if (id < 1 || id > MAX_POST_ID) {
      throw new NotFoundException(`Post with id ${id} not found.`);
    }

    const post = await this.prisma.post.findUnique({ where: { id } });

    if (!post) {
      // A built-in Nest exception: Nest turns it into a 404 response.
      throw new NotFoundException(`Post with id ${id} not found.`);
    }

    return post;
  }

  // INSERT INTO "Post" (title, body, ...) VALUES (...)
  create(data: CreatePostDto) {
    return this.prisma.post.create({ data });
  }

  // UPDATE "Post" SET ... WHERE id = $1
  async update(id: number, data: UpdatePostDto) {
    await this.findOne(id); // throws 404 if the post does not exist
    return this.prisma.post.update({ where: { id }, data });
  }

  // DELETE FROM "Post" WHERE id = $1
  async remove(id: number) {
    await this.findOne(id); // throws 404 if the post does not exist
    await this.prisma.post.delete({ where: { id } });
  }
}
