import { PartialType } from '@nestjs/swagger';
import { CreateDolarDto } from './create-dolar.dto';

export class UpdateDolarDto extends PartialType(CreateDolarDto) {}
