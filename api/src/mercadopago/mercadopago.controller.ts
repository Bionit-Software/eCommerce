import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { MercadopagoService } from './mercadopago.service';
import { UpdateMercadopagoDto } from './dto/update-mercadopago.dto';

@Controller('mercadopago')
export class MercadopagoController {
  constructor(private readonly mercadopagoService: MercadopagoService) {}

  @Post('create')
  async create(@Request() req): Promise<any> {
    console.log(req.body);
    const res = this.mercadopagoService.create(req.body);
    console.log(res);
  }

  @Get()
  findAll() {
    return this.mercadopagoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mercadopagoService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMercadopagoDto: UpdateMercadopagoDto,
  ) {
    return this.mercadopagoService.update(+id, updateMercadopagoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mercadopagoService.remove(+id);
  }
}
