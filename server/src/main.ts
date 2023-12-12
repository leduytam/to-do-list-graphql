import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(8080);

  return app.getUrl();
}

void (async (): Promise<void> => {
  try {
    const url = await bootstrap();
    Logger.log(url, 'Bootstrap');
  } catch (error) {
    Logger.error(error, 'Bootstrap');
  }
})();
