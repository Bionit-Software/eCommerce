import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaginasService } from './paginas.service';
import { CreatePaginaDto } from './dto/create-pagina.dto';
import { UpdatePaginaDto } from './dto/update-pagina.dto';

@Controller('paginas')
export class PaginasController {
  constructor(private readonly paginasService: PaginasService) {}

  @Post()
  create(@Body() createPaginaDto: CreatePaginaDto) {
    return this.paginasService.create(createPaginaDto);
  }

  @Get()
  findAll() {
    return this.paginasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paginasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaginaDto: UpdatePaginaDto) {
    return this.paginasService.update(+id, updatePaginaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paginasService.remove(+id);
  }
}
