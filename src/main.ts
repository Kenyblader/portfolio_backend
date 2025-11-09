import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(
    {
      origin:true
      
    }
  );
  const port= process.env.PORT ?? 3000
  console.log("port",port)
  await app.listen(port);
}
bootstrap();
