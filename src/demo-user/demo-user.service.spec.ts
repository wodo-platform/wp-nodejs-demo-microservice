import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../service/prisma.service';
import { DemoUserService } from './demo-user.service';
import { mockDeep } from 'jest-mock-extended'

describe('DemoUserService', () => {

  var demoUserModuleRef : TestingModule;
  let demoUserService:DemoUserService;
  let prismaService;

  beforeAll(async () => {
    prismaService = mockDeep<PrismaService>();

    // define a Nest custom value provider: https://docs.nestjs.com/fundamentals/custom-providers
    let PrismaServiceProvider = {
      provide: PrismaService,
      useValue: prismaService
    };

    demoUserModuleRef = await Test.createTestingModule({
      controllers: [],
      providers: [String,DemoUserService, PrismaServiceProvider],
    }).compile();
  });

  beforeEach(async () => {

    demoUserService = demoUserModuleRef.get<DemoUserService>(DemoUserService);
  });

  it('should be defined', () => {
    expect(demoUserService).toBeDefined();
  });
});
