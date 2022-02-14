import { Module } from '@nestjs/common';
import { DemoUserService } from './demo-user.service';
import { DemoUserController } from './demo-user.controller';

@Module({
  controllers: [DemoUserController],
  providers: [DemoUserService]
})
export class DemoUserModule {}
