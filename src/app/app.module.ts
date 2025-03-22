import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from 'src/tasks/tasks.module';
import { UsersModule } from 'src/users/users.module';
import { LoggerMiddleware } from 'src/common/middlewares/logger.middleware';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
//import { APP_GUARD } from '@nestjs/core';
//import { AuthAdminGuard } from 'src/common/guards/admin.guard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    TasksModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService /*{ provide: APP_GUARD, useClass: AuthAdminGuard }*/],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
