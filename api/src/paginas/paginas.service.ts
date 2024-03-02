import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import db from 'src/db';
import { RowDataPacket } from 'mysql2';
import constantes from 'src/constantes';
@Injectable()
export class PaginasService {
  async create(filenames: any[]) {
    try {
      for (const filename of filenames) {
        await db.query('INSERT INTO slider (url) VALUES (?)', [
          constantes.API_URL + 'uploads/' + filename.filename,
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

  async update(body: any, filenames: any[]) {
    console.log(body);
    console.log(filenames);
    const { photosRemoved } = body;
    const removedPhotos = photosRemoved.split(',');
    try {
      const uploadDirectory = path.join(
        __dirname,
        constantes.PUNTOS,
        'uploads',
      ); // entorno local
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
            constantes.API_URL + 'uploads/' + filename.filename,
          ]);
        }
      }
      return { status: 200, message: 'Slider actualizado' };
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async findPoliticaPrivacidad() {
    try {
      const [politicaPrivacidad] = await db.query<RowDataPacket[]>(
        'SELECT * FROM politicaprivacidad',
      );
      if (politicaPrivacidad.length === 0) {
        return {
          status: 204,
          message: 'No hay politica de privacidad cargada',
        };
      } else {
        return { status: 200, data: politicaPrivacidad[0] };
      }
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        message: 'Error al buscar la politica de privacidad',
      };
    }
  }

  async updatePoliticaPrivacidad(body: any) {
    const { contenido } = body;
    console.log(contenido);
    try {
      await db.query('UPDATE politicaprivacidad SET contenido = ?', [
        contenido,
      ]);
      return { status: 200, message: 'Politica de privacidad actualizada' };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        message: 'Error al actualizar la politica de privacidad',
      };
    }
  }

  async findTerminosCondiciones() {
    try {
      const [terminosCondiciones] = await db.query<RowDataPacket[]>(
        'SELECT * FROM terminoscondiciones',
      );
      if (terminosCondiciones.length === 0) {
        return {
          status: 204,
          message: 'No hay terminos y condiciones cargados',
        };
      } else {
        return { status: 200, data: terminosCondiciones[0] };
      }
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        message: 'Error al buscar los terminos y condiciones',
      };
    }
  }

  async updateTerminosCondiciones(body: any) {
    const { contenido } = body;
    console.log(contenido);
    try {
      await db.query('UPDATE terminoscondiciones SET contenido = ?', [
        contenido,
      ]);
      return { status: 200, message: 'terminos y condiciones actualizada' };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        message: 'Error al actualizar los terminos y condiciones',
      };
    }
  }

}
