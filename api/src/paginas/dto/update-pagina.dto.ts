import { PartialType } from '@nestjs/swagger';
import { CreatePaginaDto } from './create-pagina.dto';

export class UpdatePaginaDto extends PartialType(CreatePaginaDto) {}
