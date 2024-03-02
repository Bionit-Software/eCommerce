import { Controller, Get, Post, Param, Delete, Request } from '@nestjs/common';
import { MercadopagoService } from './mercadopago.service';

@Controller('mercadopago')
export class MercadopagoController {
  constructor(private readonly mercadopagoService: MercadopagoService) {}

  @Post('create')
  async create(@Request() req): Promise<any> {
    console.log(req.body);
    const res = this.mercadopagoService.create(req.body);
    console.log(res);
    return res;
  }

  @Post('webhook')
  async webhook(@Request() req: any): Promise<any> {
    console.log(req.body);
    const res = this.mercadopagoService.webhook(req.body);
    console.log(res);
    return res;
  }

  @Get()
  findAll() {
    return this.mercadopagoService.findAll();
  }

  @Get('facturas/totalPages')
  async totalPages() {
    const totalPages = this.mercadopagoService.totalPages();
    return totalPages;
  }

  @Get('facturas/pages/:page')
  async facturas(@Param('page') page: number) {
    return this.mercadopagoService.facturas(page);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateMercadopagoDto: UpdateMercadopagoDto,
  // ) {
  //   return this.mercadopagoService.update(+id, updateMercadopagoDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mercadopagoService.remove(+id);
  }
}
