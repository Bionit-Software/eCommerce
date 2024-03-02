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

  @Get('politicas-privacidad')
  async findPoliticaPrivacidad() {
    console.log('findAllPoliticaPrivacidad');
    return this.paginasService.findPoliticaPrivacidad();
  }

  @Put('politicas-privacidad/update')
  async updatePoliticaPrivacidad(@Request() req): Promise<any> {
    return this.paginasService.updatePoliticaPrivacidad(req.body);
  }

  @Get('terminos-condiciones')
  async findTerminosCondiciones() {
    console.log('findTerminosCondiciones');
    return this.paginasService.findTerminosCondiciones();
  }

  @Put('terminos-condiciones/update')
  async updateTerminosCondiciones(@Request() req): Promise<any> {
    return this.paginasService.updateTerminosCondiciones(req.body);
  }

}
