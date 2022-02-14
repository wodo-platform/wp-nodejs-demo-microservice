import { Test, TestingModule } from '@nestjs/testing';
import { DemoUserController } from './demo-user.controller';
import { DemoUserService } from './demo-user.service';

describe('DemoUserController', () => {
  let controller: DemoUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DemoUserController],
      providers: [DemoUserService],
    }).compile();

    controller = module.get<DemoUserController>(DemoUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
