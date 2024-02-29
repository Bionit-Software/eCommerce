import { Injectable } from '@nestjs/common';
import db from 'src/db';
import { ResultSetHeader } from 'mysql2';
@Injectable()
export class CategoriasService {
  async create(nombre: string) {
    try {
      await db.query<ResultSetHeader>(
        'INSERT INTO categorias (nombre) VALUES (?)',
        [nombre],
      );
      return { message: 'Categoria creada', status: 200 };
    } catch (error) {
      return { message: 'Error al crear categoria', status: 400 };
    }
  }

  async findAll() {
    const [categorias] = await db.query('SELECT * FROM categorias');
    return categorias;
  }

  async totalPages() {
    const itemsPerPage = 20; // total de productos por pages
    const [result] = await db.query<ResultSetHeader>(
      'SELECT COUNT(*) as total FROM categorias',
    );
    const totalPages = Math.ceil(result[0].total / itemsPerPage);
    console.log(totalPages);
    return totalPages;
  }

  async pages(page: number, searchTerm: string) {
    const itemsPerPage = 20; // total de productos por página
    const offset = (page - 1) * itemsPerPage;
    let query = `SELECT * FROM categorias WHERE nombre LIKE ?`;

    // Agregar ordenación por createdAt según el parámetro createdOrder

    // Agregar límite de resultados
    query += ` LIMIT ?, ?`;

    console.log(query);

    const [categorias] = await db.query(query, [
      `%${searchTerm}%`,
      offset,
      itemsPerPage,
    ]);
    console.log(categorias);
    const [totalMatch] = await db.query(
      'SELECT COUNT(*) as total FROM categorias WHERE nombre LIKE ?',
      [`%${searchTerm}%`],
    );
    const totalPages = Math.ceil(totalMatch[0].total / itemsPerPage);
    return { categorias, totalPages };
  }

  findOne(id: number) {
    return `This action returns a #${id} categoria`;
  }

  async update(id: string, body: any) {
    try {
      const [result] = await db.query(
        'UPDATE categorias SET nombre = ? WHERE id = ?',
        [body.Nombre, Number(id)],
      );
      return { message: 'Categoria actualizada', status: 200 };
    } catch (error) {
      return { message: 'Error al actualizar categoria', status: 400 };
    }
  }

  async remove(id: number) {
    try {
      const [result] = await db.query('DELETE FROM categorias WHERE id = ?', [
        id,
      ]);
      return { message: 'Categoria eliminada', status: 200 };
    } catch (error) {
      console.log(error);
      return {
        message: 'Error al eliminar categoria, está asociada a algún producto',
        status: 400,
      };
    }
  }
}
