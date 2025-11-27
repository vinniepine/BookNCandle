import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as flash from 'express-flash';
import * as exphbs from 'express-handlebars';
import * as session from 'express-session';
import * as methodOverride from 'method-override';
import { join } from 'path';
import { AppModule } from './app.module';
import { NotFoundExceptionFilter } from './common/filters/not-found-exception.filter';
import { helpers } from './common/helpers/hbs-functions';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const hbs = exphbs.create({
    extname: '.hbs',
    layoutsDir: join(__dirname, '..', 'views/_layouts'),
    partialsDir: join(__dirname, '..', 'views/_partials'),
    defaultLayout: 'main',
    helpers,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, 'views'));
  app.engine('.hbs', hbs.engine);
  app.setViewEngine('hbs');

  app.use(methodOverride('_method'));
  app.use(flash());
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.useGlobalFilters(new NotFoundExceptionFilter());

  await app.listen(3000);
}
bootstrap();
