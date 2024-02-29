import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import db from 'src/db';
import { RowDataPacket } from 'mysql2';
@Injectable()
export class PaginasService {
  async create(filenames: any[]) {
    try {
      for (const filename of filenames) {
        await db.query('INSERT INTO slider (url) VALUES (?)', [
          'https://api.tiendadeautor.ar/uploads/' + filename.filename,
        ]);
      }
      return { status: 201, message: 'Slider creado' };
    } catch (error) {
      console.log(error);
      return { status: 500, message: 'Error al crear el slider' };
    }
  }

  async findAll() {
    try {
      const [slider] = await db.query<RowDataPacket[]>('SELECT * FROM slider');
      if (slider.length === 0) {
        return { message: 'No hay sliders cargados' };
      } else {
        const urls = slider.map((slider) => slider.url).join(',');
        console.log(urls);
        return { status: 200, urls, data: slider };
      }
    } catch (error) {
      console.log(error);
      return { status: 500, message: 'Error al buscar los sliders' };
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} pagina`;
  }

  async update(body: any, filenames: any[]) {
    console.log(body);
    console.log(filenames);
    const { photosRemoved } = body;
    const removedPhotos = photosRemoved.split(',');
    try {
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
          db.query('DELETE FROM slider WHERE url = ?', [photo]);
        }
      }
      if (filenames) {
        for (const filename of filenames) {
          db.query('INSERT INTO slider (url) VALUES (?)', [
            'https://api.tiendadeautor.ar/uploads/' + filename.filename,
          ]);
        }
      }
      return { status: 200, message: 'Slider actualizado' };
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} pagina`;
  }
}
