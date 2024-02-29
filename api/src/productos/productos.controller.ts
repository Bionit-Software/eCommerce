import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Request,
  UseInterceptors,
  Query,
  Put,
} from '@nestjs/common';
import { ProductosService } from './productos.service';
// import { UpdateProductoDto } from './dto/update-producto.dto';
import { ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
@ApiTags('productos')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post('add')
  @UseInterceptors(
    FilesInterceptor('files', 4, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const originalNameWithoutSpacesAndCommas = file.originalname.replace(
            /\s|,/g,
            '_',
          );

          cb(null, `${Date.now()}-${originalNameWithoutSpacesAndCommas}`);
        },
      }),
    }),
  )
  async create(@Request() req): Promise<any> {
    console.log(req.files);
    return this.productosService.create(req.body, req.files);
  }

  @Get('all')
  findAll() {
    try {
      return this.productosService.findAll();
    } catch (error) {
      console.log(error);
    }
  }

  @Get('search/:name')
  findOne(@Param('name') name: string) {
    const res = this.productosService.findLikeName(name);
    return res;
  }

  @Get('first-twelve')
  async findFirstTwelve() {
    const res = await this.productosService.findFirstTwelve();
    return res;
  }

  @Get('findOneById/:id')
  async findOneByName(@Param('id') id: number) {
    console.log(id);
    const res = await this.productosService.findOneById(id);
    return res;
  }

  @Put('edit/:id')
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const originalNameWithoutSpacesAndCommas = file.originalname.replace(
            /\s|,/g,
            '_',
          );

          cb(null, `${Date.now()}-${originalNameWithoutSpacesAndCommas}`);
        },
      }),
    }),
  )
  async update(@Param('id') id: number, @Request() req): Promise<any> {
    return this.productosService.update(id, req.body, req.files);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productosService.remove(+id);
  }

  @Get('totalPages')
  async totalPages() {
    const res = await this.productosService.totalPages();
    return res;
  }

  @Get('pages/:page')
  async page(
    @Param('page') page: number,
    @Query('searchTerm') searchTerm: string,
    @Query('stockOrder') stockOrder: string,
    @Query('createdOrder') createdOrder: string,
  ) {
    console.log(searchTerm);
    const { productos, totalPages } = await this.productosService.pages(
      page,
      searchTerm,
      stockOrder,
      createdOrder,
    );
    return { productos, totalPages };
  }
  @Get('tienda/pages/:page')
  async tiendaPage(
    @Param('page') page: number,
    @Query('categoria') categoria: string,
    @Query('precioDesde') precioDesde: string,
    @Query('precioHasta') precioHasta: string,
  ) {
    const { productos, totalPages } = await this.productosService.tiendaPages(
      page,
      categoria,
      precioDesde,
      precioHasta,
    );
    return { productos, totalPages };
  }
}
