import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Request,
  UseInterceptors,
  Put,
  Query,
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
    return this.paginasService.findPoliticaPrivacidad();
  }

  @Put('politicas-privacidad/update')
  async updatePoliticaPrivacidad(@Request() req): Promise<any> {
    return this.paginasService.updatePoliticaPrivacidad(req.body);
  }

  @Get('terminos-condiciones')
  async findTerminosCondiciones() {
    return this.paginasService.findTerminosCondiciones();
  }

  @Put('terminos-condiciones/update')
  async updateTerminosCondiciones(@Request() req): Promise<any> {
    return this.paginasService.updateTerminosCondiciones(req.body);
  }

  @Post('preguntas-frecuentes/create')
  async createPreguntasFrecuentes(@Request() req): Promise<any> {
    return this.paginasService.createPreguntasFrecuentes(req.body);
  }

  @Get('preguntas-frecuentes')
  async findPreguntasFrecuentes() {
    return this.paginasService.findPreguntasFrecuentes();
  }

  @Put('preguntas-frecuentes/update')
  async updatePreguntasFrecuentes(@Request() req): Promise<any> {
    return this.paginasService.updatePreguntasFrecuentes(req.body);
  }

  @Delete('preguntas-frecuentes/delete/:id')
  async deletePreguntasFrecuentes(@Param() id: any): Promise<any> {
    console.log(id.id);
    return this.paginasService.deletePreguntasFrecuentes(id.id);
  }

  @Post('preguntas-frecuentes/item/create')
  async createPreguntaFrecuenteItem(@Request() req): Promise<any> {
    return this.paginasService.createPreguntaFrecuenteItem(req.body);
  }

  @Delete('preguntas-frecuentes/item/delete/:id')
  async deletePreguntaFrecuenteItem(@Param('id') id: string) {
    return this.paginasService.deletePreguntaFrecuenteItem(id);
  }

  @Put('preguntas-frecuentes/item/update')
  async updatePreguntaFrecuenteItem(@Request() req): Promise<any> {
    return this.paginasService.updatePreguntaFrecuenteItem(req.body);
  }

  @Get('email')
  async findEmail() {
    return this.paginasService.findEmail();
  }

  @Put('email/update')
  async updateEmail(@Request() req): Promise<any> {
    return this.paginasService.updateEmail(req.body);
  }
  @Post('contacto/email/:id')
  async sendEmail(
    @Param('id') id: number,
    @Query('estado') estado: string,
    @Query('from') from: string,
    @Query('to') to: string,
    @Request() req,
  ): Promise<any> {
    return this.paginasService.sendEmail(id, estado, from, to, req.body);
  }
  @Post('contacto/create')
  async createContacto(@Request() req): Promise<any> {
    return this.paginasService.createContacto(req.body);
  }

  @Get('contacto/all')
  async findAllContacto() {
    return this.paginasService.findAllContacto();
  }

  @Get('contacto/totalPages')
  async totalPagesContacto() {
    return this.paginasService.totalPagesContacto();
  }

  @Get('contacto/pages/:page')
  async paginateContacto(
    @Param('page') page: string,
    @Query('estadoOrder') estadoOrder: string,
    @Query('createdOrder') createdOrder: string,
  ) {
    console.log(page, estadoOrder, createdOrder);
    return this.paginasService.paginateContacto(
      page,
      estadoOrder,
      createdOrder,
    );
  }
  @Get('contacto/:id')
  async findOneContacto(@Param('id') id: string) {
    return this.paginasService.findOneContacto(id);
  }

  @Post('arrepentimiento/email/:id')
  async sendEmailArrepentimiento(
    @Param('id') id: number,
    @Query('estado') estado: string,
    @Query('from') from: string,
    @Query('to') to: string,
    @Request() req,
  ): Promise<any> {
    return this.paginasService.sendEmailArrepentimiento(
      id,
      estado,
      from,
      to,
      req.body,
    );
  }
  @Post('arrepentimiento/create')
  async createarrepentimiento(@Request() req): Promise<any> {
    return this.paginasService.createArrepentimiento(req.body);
  }

  @Get('arrepentimiento/all')
  async findAllarrepentimiento() {
    return this.paginasService.findAllArrepentimiento();
  }

  @Get('arrepentimiento/totalPages')
  async totalPagesarrepentimiento() {
    return this.paginasService.totalPagesArrepentimiento();
  }

  @Get('arrepentimiento/pages/:page')
  async paginatearrepentimiento(
    @Param('page') page: string,
    @Query('estadoOrder') estadoOrder: string,
    @Query('createdOrder') createdOrder: string,
  ) {
    console.log(page, estadoOrder, createdOrder);
    return this.paginasService.paginateArrepentimiento(
      page,
      estadoOrder,
      createdOrder,
    );
  }
  @Get('arrepentimiento/:id')
  async findOnearrepentimiento(@Param('id') id: string) {
    return this.paginasService.findOneArrepentimiento(id);
  }
}
