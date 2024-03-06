import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { DolarService } from './dolar.service';
import { CreateDolarDto } from './dto/create-dolar.dto';
import { UpdateDolarDto } from './dto/update-dolar.dto';

@Controller('dolar')
export class DolarController {
  constructor(private readonly dolarService: DolarService) {}

  @Post()
  create(@Body() createDolarDto: CreateDolarDto) {
    return this.dolarService.create(createDolarDto);
  }

  @Get()
  findAll() {
    return this.dolarService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.dolarService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: any) {
    return this.dolarService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dolarService.remove(+id);
  }
}
