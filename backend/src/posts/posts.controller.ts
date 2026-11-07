import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto.js';
import { UpdatePostDto } from './dto/update-post.dto.js';
import { PostsService } from './posts.service.js';

// @Controller('posts') + the global 'api' prefix = routes under /api/posts.
// The controller only maps HTTP requests to service methods.
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // GET /api/posts -> 200 with an array of posts
  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  // GET /api/posts/5 -> 200 with one post, or 404
  // ParseIntPipe turns the text "5" from the URL into the number 5.
  // For /api/posts/abc it answers 400 before this method runs.
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  // POST /api/posts -> 201 with the created post
  // @Body() gives us the JSON body, already validated against CreatePostDto.
  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  // PATCH /api/posts/5 -> 200 with the updated post, or 404
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(id, updatePostDto);
  }

  // DELETE /api/posts/5 -> 204 No Content (success, nothing to send back), or 404
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.remove(id);
  }
}
