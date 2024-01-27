import {
  Controller,
  Get,
  Post,
  // Body,
  // Patch,
  Param,
  Delete,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { ProductosService } from './productos.service';
// import { UpdateProductoDto } from './dto/update-producto.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
@ApiTags('productos')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post('add')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    }),
  )
  async create(@Request() req): Promise<any> {
    const filename = req.file;
    console.log(filename);
    return this.productosService.create(req.body, filename);
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

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateProductoDto: UpdateProductoDto,
  // ) {
  //   return this.productosService.update(+id, updateProductoDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productosService.remove(+id);
  }
}
