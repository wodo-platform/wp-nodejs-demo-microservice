import { Module } from '@nestjs/common';
import { DemoUserService } from './demo-user.service';
import { DemoUserController } from './demo-user.controller';
import { PrismaService } from 'src/service/prisma.service';

@Module({
  controllers: [DemoUserController],
  providers: [DemoUserService,PrismaService]
})
export class DemoUserModule {}
