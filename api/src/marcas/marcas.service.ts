import { Injectable } from '@nestjs/common';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import db from 'src/db';
import { ResultSetHeader } from 'mysql2';

@Injectable()
export class MarcasService {
  async create(nombre: string) {
    try {
      await db.query<ResultSetHeader>(
        'INSERT INTO marcas (nombre) VALUES (?)',
        [nombre],
      );
      return { message: 'Marca creada', status: 200 };
    } catch (error) {
      return { message: 'Error al crear marca error: ' + error, status: 400 };
    }
  }

  async findAll() {
    const [marcas] = await db.query('SELECT * FROM marcas');
    return marcas;
  }

  async totalPages() {
    const itemsPerPage = 20; // total de productos por pages
    const [result] = await db.query<ResultSetHeader>(
      'SELECT COUNT(*) as total FROM marcas',
    );
    const totalPages = Math.ceil(result[0].total / itemsPerPage);
    console.log(totalPages);
    return totalPages;
  }

  async pages(page: number, searchTerm: string) {
    const itemsPerPage = 20; // total de productos por página
    const offset = (page - 1) * itemsPerPage;
    let query = `SELECT * FROM marcas WHERE nombre LIKE ?`;

    // Agregar ordenación por createdAt según el parámetro createdOrder

    // Agregar límite de resultados
    query += ` LIMIT ?, ?`;

    console.log(query);

    const [marcas] = await db.query(query, [
      `%${searchTerm}%`,
      offset,
      itemsPerPage,
    ]);
    const [totalMatch] = await db.query(
      'SELECT COUNT(*) as total FROM marcas WHERE nombre LIKE ?',
      [`%${searchTerm}%`],
    );
    const totalPages = Math.ceil(totalMatch[0].total / itemsPerPage);
    return { marcas, totalPages };
  }

  findOne(id: number) {
    return `This action returns a #${id} marca`;
  }

  async update(id: string, body: any) {
    try {
      const [result] = await db.query(
        'UPDATE marcas SET nombre = ? WHERE id = ?',
        [body.Nombre, Number(id)],
      );
      return { message: 'Marcas actualizada', status: 200 };
    } catch (error) {
      return { message: 'Error al actualizar marca', status: 400 };
    }
  }

  async remove(id: number) {
    try {
      const [result] = await db.query('DELETE FROM marcas WHERE id = ?', [id]);
      return { message: 'Marca eliminada', status: 200 };
    } catch (error) {
      console.log(error);
      return {
        message: 'Error al eliminar Marca, está asociada a algún producto',
        status: 400,
      };
    }
  }
}
