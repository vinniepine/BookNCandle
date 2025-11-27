import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { UsersModule } from './users/users.module'; 
import { AuthModule } from './auth/auth.module';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthenticatedMiddleware } from './common/middlewares/authenticated.middleware';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true, // carrega todas as entidades automaticamente
      synchronize: true,      // ok em DESENVOLVIMENTO
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticatedMiddleware)
      .exclude(
        { path: 'login', method: RequestMethod.GET },
        { path: 'login', method: RequestMethod.POST }
      )
      .forRoutes(
        { path: 'users', method: RequestMethod.GET },
        { path: 'users', method: RequestMethod.ALL }
      );
  }
}
