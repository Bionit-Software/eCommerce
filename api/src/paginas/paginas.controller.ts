import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Request,
  UseInterceptors,
  Put,
} from '@nestjs/common';
import { PaginasService } from './paginas.service';
import { UpdatePaginaDto } from './dto/update-pagina.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('paginas')
export class PaginasController {
  constructor(private readonly paginasService: PaginasService) {}

  @Post('principal/slider/create')
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
    return this.paginasService.create(req.files);
  }

  @Get('principal/slider/all')
  async findAll() {
    console.log('findAll');
    return this.paginasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paginasService.findOne(+id);
  }

  @Put('principal/slider/update')
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
  async update(@Request() req): Promise<any> {
    return this.paginasService.update(req.body, req.files);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paginasService.remove(+id);
  }
}
