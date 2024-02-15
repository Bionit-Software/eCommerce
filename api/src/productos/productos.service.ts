import { Injectable } from '@nestjs/common';
import { ResultSetHeader } from 'mysql2';
import * as path from 'path';
import * as fs from 'fs/promises';
// import { CreateProductoDto } from './dto/create-producto.dto';
// import { UpdateProductoDto } from './dto/update-producto.dto';
import db from 'src/db';
@Injectable()
export class ProductosService {
  async create(createProductoDto: any, filenames: any[]) {
    const { nombre, descripcion, precio, stock, idCategoria, idMarca } =
      createProductoDto;
    try {
      // Insertar el producto en la tabla de productos
      const [producto] = await db.query<ResultSetHeader>(
        'INSERT INTO productos (nombre, descripcion, precio, stock, idCategoria, idMarca) VALUES (?, ?, ?, ?, ?, ?)',
        [nombre, descripcion, precio, stock, idCategoria, idMarca],
      );

      // Obtener el ID del producto recién insertado
      const productoId = producto.insertId;

      // Insertar las URL de las imágenes en la tabla de imágenes y vincularlas al producto
      for (const filename of filenames) {
        await db.query(
          'INSERT INTO imagenesproducto (url, productoId) VALUES (?, ?)',
          ['https://api.tenedores.ar/uploads/' + filename.filename, productoId],
        );
      }

      return producto;
    } catch (error) {
      console.log(error);
    }
  }

  async findAll() {
    const [productos] = await db.query(
      `SELECT p.id, p.nombre, p.descripcion, p.precio, p.stock, p.idCategoria, p.idMarca, p.createdAt, p.updatedAt, GROUP_CONCAT(ip.url) AS imagenes
      FROM productos p
      LEFT JOIN imagenesproducto ip ON p.id = ip.productoId
      GROUP BY p.id ORDER BY p.createdAt DESC`,
    );
    console.log(productos);
    return productos;
  }

  async findFirstTwelve() {
    const [productos] = await db.query(
      `SELECT p.id, p.nombre, p.descripcion, p.precio, p.stock, p.idCategoria, p.idMarca, p.createdAt, p.updatedAt, GROUP_CONCAT(ip.url) AS imagenes
      FROM productos p
      LEFT JOIN imagenesproducto ip ON p.id = ip.productoId
      GROUP BY p.id LIMIT 12`,
    );
    return productos;
  }

  async findOneById(id: number) {
    const [producto] = await db.query(
      `SELECT p.id, p.nombre, p.descripcion, p.precio, p.stock, p.idCategoria, p.idMarca, p.createdAt, p.updatedAt, GROUP_CONCAT(ip.url) AS imagenes
    FROM productos p
    LEFT JOIN imagenesproducto ip ON p.id = ip.productoId
    WHERE p.id = ?
    GROUP BY p.id`,
      [id],
    );
    return producto;
  }

  async findLikeName(nombre: string) {
    const [productos] = await db.query(
      `SELECT p.id, p.nombre, p.descripcion, p.precio, p.stock, p.idCategoria, p.idMarca, p.createdAt, p.updatedAt, GROUP_CONCAT(ip.url) AS imagenes
      FROM productos p
      LEFT JOIN imagenesproducto ip ON p.id = ip.productoId
      WHERE p.nombre LIKE ?
      GROUP BY p.id`,
      [`%${nombre}%`],
    );
    console.log(productos);
    return productos;
  }
  update(id: number, body: any, filenames: any[]) {
    console.log(body);
    console.log(filenames);
    const {
      nombre,
      descripcion,
      precio,
      stock,
      idCategoria,
      idMarca,
      photosRemoved,
    } = body;
    const removedPhotos = photosRemoved.split(',');
    // console.log(removedPhotos);
    try {
      db.query(
        'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, idCategoria = ?, idMarca = ? WHERE id = ?',
        [nombre, descripcion, precio, stock, idCategoria, idMarca, id],
      );
      const uploadDirectory = path.join(__dirname, '../..', 'uploads'); // entorno local
      // const uploadDirectory = path.join(__dirname, '..', 'uploads'); //produccion
      if (photosRemoved !== '') {
        for (const photo of removedPhotos) {
          const url = photo.split('/').pop();
          console.log(url);
          console.log('---');
          const partes = photo.split('/');
          console.log(partes[partes.length - 1]);
          fs.unlink(path.join(uploadDirectory, partes[partes.length - 1]));
          db.query('DELETE FROM imagenesproducto WHERE url = ?', [photo]);
        }
      }
      if (filenames) {
        for (const filename of filenames) {
          db.query(
            'INSERT INTO imagenesproducto (url, productoId) VALUES (?, ?)',
            ['https://api.tenedores.ar/uploads/' + filename.filename, id],
          );
        }
      }
      return 'Producto actualizado';
    } catch (error) {
      console.log(error);
      return error;
    }
  }

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

  async pages(
    page: number,
    searchTerm: string,
    stockOrder: string,
    createdOrder: string,
  ) {
    const itemsPerPage = 12; // total de productos por página
    const offset = (page - 1) * itemsPerPage;
    let query = `SELECT p.id, p.nombre, p.descripcion, p.precio, p.stock, p.idCategoria, p.idMarca, p.createdAt, p.updatedAt, GROUP_CONCAT(ip.url) AS imagenes
    FROM productos p
    LEFT JOIN imagenesproducto ip ON p.id = ip.productoId
    WHERE p.nombre LIKE ?
    GROUP BY p.id`;

    // Agregar ordenación por createdAt según el parámetro createdOrder
    if (createdOrder !== 'neutral') {
      query += ` ORDER BY createdAt ${createdOrder}`;
    }
    // Agregar ordenación por stock si stockOrder no es neutral
    if (stockOrder !== 'neutral') {
      console.log(stockOrder);
      if (createdOrder === 'neutral') {
        query += ` ORDER BY stock ${stockOrder}`;
      } else {
        query += `, stock ${stockOrder}`;
      }
    }
    // Agregar límite de resultados
    query += ` LIMIT ?, ?`;

    console.log(query);

    const [productos] = await db.query(query, [
      `%${searchTerm}%`,
      offset,
      itemsPerPage,
    ]);
    console.log(productos);
    const [totalMatch] = await db.query(
      'SELECT COUNT(*) as total FROM productos WHERE nombre LIKE ?',
      [`%${searchTerm}%`],
    );
    const totalPages = Math.ceil(totalMatch[0].total / itemsPerPage);
    return { productos, totalPages };
  }
}
