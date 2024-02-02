import { Module } from '@nestjs/common';
import { MercadopagoService } from './mercadopago.service';
import { MercadopagoController } from './mercadopago.controller';

@Module({
  controllers: [MercadopagoController],
  providers: [MercadopagoService],
})
export class MercadopagoModule {}
