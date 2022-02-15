import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DemoUserService } from './demo-user.service';
import { CreateDemoUserDto } from './dto/create-demo-user.dto';
import { DemoUserDto } from './dto/demo-user.dto';
import { UpdateDemoUserDto } from './dto/update-demo-user.dto';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import {VALIDATION_SCHEMA_DEMO_USER_CREATE} from "../common/pipes/validation"

@Controller('demo-users')
export class DemoUserController {
  constructor(private readonly demoUserService: DemoUserService) {}

  @Post()
  async create(@Body(new ValidationPipe(VALIDATION_SCHEMA_DEMO_USER_CREATE)) createDemoUserDto: CreateDemoUserDto) : Promise<DemoUserDto> {
    return await this.demoUserService.create(createDemoUserDto);
  }

  @Get()
  findAll() {
    return this.demoUserService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.demoUserService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDemoUserDto: UpdateDemoUserDto) {
    return this.demoUserService.update(+id, updateDemoUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.demoUserService.remove(+id);
  }
}
