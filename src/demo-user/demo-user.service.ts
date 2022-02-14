import { Injectable } from '@nestjs/common';
import { DemoUser } from '@prisma/client';
import { PrismaService } from 'src/service/prisma.service';
import { CreateDemoUserDto } from './dto/create-demo-user.dto';
import { DemoUserDto } from './dto/demo-user.dto';
import { UpdateDemoUserDto } from './dto/update-demo-user.dto';

@Injectable()
export class DemoUserService {

  constructor(private prisma: PrismaService) {

  }

  async create(createDemoUserDto: CreateDemoUserDto): Promise<DemoUserDto> {

    const data = {
      name: createDemoUserDto.name,
      password: createDemoUserDto.password,
      deleted: false
    };

    let demoUser: DemoUser = await this.prisma.demoUser.create(
      {
        data
      }
    ) as DemoUser;

    // convert prisma persistency DemoUser object to DTO object that will be exposed to external world, invokers. We do not use demo-user.entity.ts 
    // here since our case is simple and we do not implement explicit persistency layer. Prisma handles it for us.
    let demoUserDTO = new DemoUserDto(demoUser.id, demoUser.name, demoUser.deleted, demoUser.createdAt, demoUser.updatedAt);
    return demoUserDTO;

  }

  findAll() {
    return `This action returns all demoUser`;
  }

  findOne(id: number) {
    return `This action returns a #${id} demoUser`;
  }

  update(id: number, updateDemoUserDto: UpdateDemoUserDto) {
    return `This action updates a #${id} demoUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} demoUser`;
  }
}
