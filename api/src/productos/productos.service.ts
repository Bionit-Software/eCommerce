import { Injectable } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import db from 'db/db';
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

  findOne(id: number) {
    return `This action returns a #${id} producto`;
  }

  update(id: number, updateProductoDto: UpdateProductoDto) {
    return `This action updates a #${id} producto`;
  }

  remove(id: number) {
    return `This action removes a #${id} producto`;
  }
}
