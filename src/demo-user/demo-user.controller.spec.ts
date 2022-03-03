import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../service/prisma.service';
import { DemoUserController } from './demo-user.controller';
import { DemoUserService } from './demo-user.service';
import { mockDeep } from 'jest-mock-extended'

describe('DemoUserController', () => {

  var demoUserModuleRef : TestingModule;
  let demoUserController:DemoUserController;
  let demoUserService: DemoUserService;
  let prismaService;

  beforeAll(async () => {
    prismaService = mockDeep<PrismaService>();

    // define a Nest custom value provider: https://docs.nestjs.com/fundamentals/custom-providers
    let PrismaServiceProvider = {
      provide: PrismaService,
      useValue: prismaService
    };

    demoUserModuleRef = await Test.createTestingModule({
      controllers: [DemoUserController],
      providers: [String,DemoUserService, PrismaServiceProvider],
    }).compile();
    demoUserModuleRef.init();
  });

  beforeEach(async () => {
    prismaService = demoUserModuleRef.get<PrismaService>(PrismaService);
    demoUserService = demoUserModuleRef.get<DemoUserService>(DemoUserService);
    demoUserController = demoUserModuleRef.get<DemoUserController>(DemoUserController);
  });

  it('should be defined', () => {
    expect(demoUserController).toBeDefined();
  });
});
