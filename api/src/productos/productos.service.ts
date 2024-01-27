import { Injectable } from '@nestjs/common';
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
          process.env.API_URL + 'uploads/' + filename.filename,
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
    const [productos] = await db.query('SELECT * FROM productos');
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
      'SELECT * FROM productos WHERE nombre == ?',
      [nombre],
    );
    return productos;
  }
  // update(id: number, updateProductoDto: UpdateProductoDto) {
  //   return `This action updates a #${id} producto`;
  // }

  async remove(id: number) {
    await db.query('DELETE FROM productos WHERE id = ?', [id]);
    return `This action removes a #${id} producto`;
  }
}
