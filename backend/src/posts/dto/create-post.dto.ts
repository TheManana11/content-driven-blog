import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

// The shape of the JSON body for POST /api/posts.
// ValidationPipe (set up in main.ts) checks every decorator below before the
// controller runs. If a check fails, Nest answers 400 Bad Request with the
// message, and the controller is never called.
//
// Note: class-validator runs a property's decorators from the BOTTOM up, and
// main.ts stops at the first failure. So the most basic checks (is it text?
// is it empty?) are written last, and their message is the one users see.
export class CreatePostDto {
  @MaxLength(100, { message: 'Title must be 100 characters or fewer.' })
  @MinLength(3, { message: 'Title must be at least 3 characters.' })
  @IsNotEmpty({ message: 'Title is required.' })
  @IsString({ message: 'Title must be text.' })
  title: string;

  @MaxLength(2000, { message: 'Content must be 2000 characters or fewer.' })
  @MinLength(10, { message: 'Content must be at least 10 characters.' })
  @IsNotEmpty({ message: 'Content is required.' })
  @IsString({ message: 'Content must be text.' })
  body: string;
}
