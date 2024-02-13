import { Injectable } from '@nestjs/common';
import { ResultSetHeader } from 'mysql2';
// import { CreateProductoDto } from './dto/create-producto.dto';
// import { UpdateProductoDto } from './dto/update-producto.dto';
import db from 'src/db';
@Injectable()
export class ProductosService {
  async create(createProductoDto: any, filename: any) {
    const { nombre, descripcion, precio, stock, idCategoria, idMarca } =
      createProductoDto;
    try {
      const [producto] = await db.query(
        'INSERT INTO productos (nombre, descripcion, url_image, precio, stock, idCategoria, idMarca) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          nombre,
          descripcion,
          // process.env.API_URL +
          'https://api.tenedores.ar/uploads/' + filename.filename,
          precio,
          stock,
          idCategoria,
          idMarca,
        ],
      );
      return producto;
    } catch (error) {
      console.log(error);
    }
  }

  async findAll() {
    const [productos] = await db.query(
      'SELECT * FROM productos ORDER BY createdAt DESC',
    );
    console.log(productos);
    return productos;
  }

  async findFirstTwelve() {
    const [productos] = await db.query(
      'SELECT * FROM productos ORDER BY id DESC LIMIT 12',
    );
    return productos;
  }

  async findOneById(id: number) {
    const [producto] = await db.query('SELECT * FROM productos WHERE id = ?', [
      id,
    ]);
    return producto;
  }

  async findLikeName(nombre: string) {
    const [productos] = await db.query(
      'SELECT * FROM productos WHERE nombre LIKE ?',
      [`%${nombre}%`],
    );
    console.log(productos);
    return productos;
  }
  // update(id: number, updateProductoDto: UpdateProductoDto) {
  //   return `This action updates a #${id} producto`;
  // }

  async remove(id: number) {
    await db.query('DELETE FROM productos WHERE id = ?', [id]);
    return `This action removes a #${id} producto`;
  }

  async totalPages() {
    const itemsPerPage = 12; // total de productos por pages
    const [result] = await db.query<ResultSetHeader>(
      'SELECT COUNT(*) as total FROM productos',
    );
    const totalPages = Math.ceil(result[0].total / itemsPerPage);
    return totalPages;
  }

  // async pages(page: number, searchTerm: string) {
  //   const itemsPerPage = 12; // total de productos por pages
  //   const offset = (page - 1) * itemsPerPage;
  //   const [productos] = await db.query(
  //     'SELECT * FROM productos ORDER BY createdAt DESC LIMIT ?, ?',
  //     [offset, itemsPerPage],
  //   );
  //   return productos;
  // }
  async pages(page: number, searchTerm: string) {
    const itemsPerPage = 12; // total de productos por página
    const offset = (page - 1) * itemsPerPage;
    const [productos] = await db.query(
      'SELECT * FROM productos WHERE nombre LIKE ? ORDER BY createdAt DESC LIMIT ?, ?',
      [`%${searchTerm}%`, offset, itemsPerPage],
    );
    const [totalMatch] = await db.query(
      'SELECT COUNT(*) as total FROM productos WHERE nombre LIKE ?',
      [`%${searchTerm}%`],
    );
    const totalPages = Math.ceil(totalMatch[0].total / itemsPerPage);
    return { productos, totalPages };
  }
}
