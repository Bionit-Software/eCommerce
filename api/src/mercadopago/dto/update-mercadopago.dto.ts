import { PartialType } from '@nestjs/swagger';
import { CreateMercadopagoDto } from './create-mercadopago.dto';

export class UpdateMercadopagoDto extends PartialType(CreateMercadopagoDto) {}
