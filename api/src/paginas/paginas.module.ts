import { Module } from '@nestjs/common';
import { PaginasService } from './paginas.service';
import { PaginasController } from './paginas.controller';

@Module({
  controllers: [PaginasController],
  providers: [PaginasService],
})
export class PaginasModule {}
