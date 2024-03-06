import { Injectable } from '@nestjs/common';
import { CreateDolarDto } from './dto/create-dolar.dto';
import db from 'src/db';
import { ResultSetHeader } from 'mysql2';
@Injectable()
export class DolarService {
  create(createDolarDto: CreateDolarDto) {
    return 'This action adds a new dolar';
  }

  findAll() {
    return `This action returns all dolar`;
  }

  async findOne(id: number) {
    try {
      const [valor] = await db.query<ResultSetHeader>(
        'SELECT * FROM dolar WHERE id = ?',
        [id],
      );
      return { status: 200, data: valor[0] };
    } catch (error) {
      console.log(error);
      return { status: 500, message: 'Error al buscar el dolar' };
    }
  }

  async update(id: number, body: any) {
    console.log(body);
    try {
      await db.query('UPDATE dolar SET valor = ? WHERE id = ?', [
        body.valor,
        id,
      ]);
      return { status: 200, message: 'Dolar actualizado' };
    } catch (error) {
      console.log(error);
      return { status: 500, message: 'Error al actualizar el dolar' };
    }
  }

  remove(id: number) {
    return `This action removes a #${id} dolar`;
  }
}
