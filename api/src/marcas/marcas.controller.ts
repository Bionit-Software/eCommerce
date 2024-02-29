import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { MarcasService } from './marcas.service';

@Controller('marcas')
export class MarcasController {
  constructor(private readonly marcasService: MarcasService) {}

  @Post('create')
  create(@Body() body: any) {
    console.log(body);
    return this.marcasService.create(body.Nombre);
  }

  @Get('all')
  findAll() {
    return this.marcasService.findAll();
  }

  @Get('totalPages')
  async totalPages() {
    const res = await this.marcasService.totalPages();
    return res;
  }

  @Get('pages/:page')
  async page(
    @Param('page') page: number,
    @Query('searchTerm') searchTerm: string,
  ) {
    console.log(searchTerm);
    const { marcas, totalPages } = await this.marcasService.pages(
      page,
      searchTerm,
    );
    return { marcas, totalPages };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marcasService.findOne(+id);
  }

  @Put('edit/:id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.marcasService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marcasService.remove(+id);
  }
}
