import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

// The entry point: `npm run start:dev` runs this file first.
async function bootstrap() {
  // Builds the whole application, starting from the root module.
  const app = await NestFactory.create(AppModule);

  // Every route starts with /api, e.g. GET /api/posts.
  app.setGlobalPrefix('api');

  // Checks every incoming request body against its DTO class
  // (e.g. CreatePostDto) before the controller runs.
  app.useGlobalPipes(
    new ValidationPipe({
      // Removes any property the DTO does not declare.
      whitelist: true,
      // ...and rejects the request with 400 instead of silently removing it.
      forbidNonWhitelisted: true,
      // Turns the plain JSON body into an instance of the DTO class.
      transform: true,
      // Reports only the first failed check per field, so the user gets
      // one clear message instead of several overlapping ones.
      stopAtFirstError: true,
    }),
  );

  // PORT comes from the .env file (loaded by ConfigModule in app.module.ts).
  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`API running on http://localhost:${port}/api`);
}

await bootstrap();
