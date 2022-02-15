import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DemoModule } from './demo/demo.module';
import { WPErrorsInterceptor } from '@wodo-platform/wp-shared-lib/dist/wodoplatform/error/wp.errors.interceptor'
import { ErrorsInterceptor } from '@wodo-platform/wg-shared-lib/dist/wodogaming/error/errors.interceptor'

import { DemoUserModule } from './demo-user/demo-user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    RouterModule.register([
      {
        path: 'api',
        module: DemoModule
      },
      {
        path: 'api',
        module: DemoUserModule
      }
    ]),
    DemoUserModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor,
    }, 
    AppService],
})
export class AppModule {}
