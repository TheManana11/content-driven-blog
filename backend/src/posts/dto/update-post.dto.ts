import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

// The shape of the JSON body for PATCH /api/posts/:id.
// Same rules as CreatePostDto, but each field is optional: PATCH may change
// only the title, only the body, or both. @IsOptional() skips the other
// checks when the field is missing.
// (Decorators run from the bottom up; see create-post.dto.ts.)
export class UpdatePostDto {
  @MaxLength(100, { message: 'Title must be 100 characters or fewer.' })
  @MinLength(3, { message: 'Title must be at least 3 characters.' })
  @IsNotEmpty({ message: 'Title is required.' })
  @IsString({ message: 'Title must be text.' })
  @IsOptional()
  title?: string;

  @MaxLength(2000, { message: 'Content must be 2000 characters or fewer.' })
  @MinLength(10, { message: 'Content must be at least 10 characters.' })
  @IsNotEmpty({ message: 'Content is required.' })
  @IsString({ message: 'Content must be text.' })
  @IsOptional()
  body?: string;
}
