import { Test, TestingModule } from '@nestjs/testing';
import { DemoUserService } from './demo-user.service';

describe('DemoUserService', () => {
  let service: DemoUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DemoUserService],
    }).compile();

    service = module.get<DemoUserService>(DemoUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
