import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
async function bootstrap() {
  //cors
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  //CORS CONFIGURACION
  app.enableCors({
    credentials: true,
    //colocar url valida del front del admin y del front del cliente
    // origin: [
    //   'http://localhost:5173',
    //   'https://admin.lacocina.com',
    //   'https://lacocina.com',
    //   'https://api.lacocina.ar',
    // ],
    origin: '*',
  });
  app.useStaticAssets('uploads', {
    prefix: '/uploads',
  });
  //configuracion de archivos estaticos
  app.useGlobalPipes(new ValidationPipe()); // validacion de clases global
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('e-commerce')
    .setDescription('The e-commerce API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);
  await app.listen(3000);
}
bootstrap();
