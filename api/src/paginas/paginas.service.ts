import { Injectable } from '@nestjs/common';
import { CreatePaginaDto } from './dto/create-pagina.dto';
import { UpdatePaginaDto } from './dto/update-pagina.dto';

@Injectable()
export class PaginasService {
  create(createPaginaDto: CreatePaginaDto) {
    return 'This action adds a new pagina';
  }

  findAll() {
    return `This action returns all paginas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pagina`;
  }

  update(id: number, updatePaginaDto: UpdatePaginaDto) {
    return `This action updates a #${id} pagina`;
  }

  remove(id: number) {
    return `This action removes a #${id} pagina`;
  }
}
