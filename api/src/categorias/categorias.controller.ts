import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { CategoriasService } from './categorias.service';

@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Post('create')
  create(@Body() body: any) {
    console.log(body);
    return this.categoriasService.create(body.Nombre);
  }

  @Get('all')
  findAll() {
    return this.categoriasService.findAll();
  }

  @Get('totalPages')
  async totalPages() {
    const res = await this.categoriasService.totalPages();
    return res;
  }

  @Get('pages/:page')
  async page(
    @Param('page') page: number,
    @Query('searchTerm') searchTerm: string,
  ) {
    console.log(searchTerm);
    const { categorias, totalPages } = await this.categoriasService.pages(
      page,
      searchTerm,
    );
    return { categorias, totalPages };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriasService.findOne(+id);
  }

  @Put('edit/:id')
  update(@Param('id') id: string, @Body() body: any) {
    console.log(body + 'asdcas');
    return this.categoriasService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriasService.remove(+id);
  }
}
