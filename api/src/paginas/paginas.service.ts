import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import db from 'src/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import constantes from 'src/constantes';
import * as nodemailer from 'nodemailer';

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

  async createPreguntasFrecuentes(body: any) {
    const { titulo } = body;
    try {
      await db.query('INSERT INTO preguntasfrecuentes (titulo) VALUES (?)', [
        titulo,
      ]);
      return { status: 201, message: 'Pregunta frecuente creada' };
    } catch (error) {
      console.log(error);
      return { status: 500, message: 'Error al crear la pregunta frecuente' };
    }
  }

  async findPreguntasFrecuentes() {
    try {
      const query = `
      SELECT pf.id, pf.titulo AS pregunta_frecuente,
    CONCAT('[', GROUP_CONCAT(
        CONCAT('{"id":', pfi.id, ', "titulo":"', pfi.titulo, '", "contenido":"', pfi.contenido, '"}')
        ORDER BY pfi.id
    ), ']') AS items
FROM preguntasfrecuentes pf
LEFT JOIN preguntasfrecuentesitem pfi ON pf.id = pfi.idPadre
GROUP BY pf.id, pf.titulo;
      `;
      const [preguntasFrecuentes] = await db.query<RowDataPacket[]>(query);
      if (preguntasFrecuentes.length === 0) {
        return {
          status: 204,
          message: 'No hay preguntas frecuentes cargadas',
        };
      } else {
        const formattedData = preguntasFrecuentes.map((pf) => ({
          pregunta_frecuente: pf.pregunta_frecuente,
          id: pf.id,
          items: JSON.parse(pf.items),
        }));
        return { status: 200, data: formattedData };
      }
    } catch (error) {
      console.error('Error al buscar las preguntas frecuentes:', error);
      return {
        status: 500,
        message: 'Error al buscar las preguntas frecuentes',
      };
    }
  }

  async updatePreguntasFrecuentes(body: any) {
    const { id, titulo } = body;
    try {
      await db.query('UPDATE preguntasfrecuentes SET titulo = ? WHERE id = ?', [
        titulo,
        id,
      ]);
      return { status: 200, message: 'Pregunta frecuente actualizada' };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        message: 'Error al actualizar la pregunta frecuente',
      };
    }
  }

  async deletePreguntasFrecuentes(id: number) {
    console.log(id);
    try {
      await db.query('DELETE FROM preguntasfrecuentesitem WHERE idPadre = ?', [
        id,
      ]);
      await db.query('DELETE FROM preguntasfrecuentes WHERE id = ?', [id]);
      return { status: 200, message: 'Pregunta frecuente eliminada' };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        message: 'Error al eliminar la pregunta frecuente',
      };
    }
  }

  async deletePreguntaFrecuenteItem(id: string) {
    try {
      await db.query('DELETE FROM preguntasfrecuentesitem WHERE id = ?', [
        Number(id),
      ]);
      return { status: 200, message: 'Item de pregunta frecuente eliminado' };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        message: 'Error al eliminar el item de pregunta frecuente',
      };
    }
  }

  async updatePreguntaFrecuenteItem(body: any) {
    const { id, titulo, contenido } = body;
    try {
      await db.query(
        'UPDATE preguntasfrecuentesitem SET titulo = ?, contenido = ? WHERE id = ?',
        [titulo, contenido, id],
      );
      return { status: 200, message: 'Item de pregunta frecuente actualizado' };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        message: 'Error al actualizar el item de pregunta frecuente',
      };
    }
  }

  async createPreguntaFrecuenteItem(body: any) {
    console.log(body);
    const { idPadre, titulo, contenido } = body;
    try {
      // await db.query(
      //   'INSERT INTO preguntasfrecuentesitem (idPadre, titulo, contenido) VALUES (?, ?, ?)',
      //   [idPadre, titulo, contenido],
      // );
      const [result] = await db.query<ResultSetHeader>(
        'INSERT INTO preguntasfrecuentesitem (idPadre, titulo, contenido) VALUES (?, ?, ?)',
        [idPadre, titulo, contenido],
      );
      return {
        status: 201,
        message: 'Item de pregunta frecuente creado',
        id: result.insertId,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        message: 'Error al crear el item de pregunta frecuente',
      };
    }
  }

  async findEmail() {
    try {
      const [terminosCondiciones] = await db.query<RowDataPacket[]>(
        'SELECT * FROM email',
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
  async updateEmail(body: any) {
    const { contenido } = body;
    try {
      await db.query('UPDATE email SET contenido = ?', [contenido]);
      return { status: 200, message: 'Email contenido actualizada' };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        message: 'Error al actualizar email personalizado',
      };
    }
  }
  async sendEmail(
    id: number,
    estado: string,
    from: string,
    to: string,
    body: any,
  ) {
    console.log(body);
    console.log(id);
    console.log(estado);
    try {
      const transporter = nodemailer.createTransport({
        host: 'pampa.whservers.net',
        port: 465, //465 es true, sino false
        secure: true,
        auth: {
          user: 'no-reply@tiendadeautor.ar',
          pass: '{+gQbtSivj$)',
        },
      });
      const info = await transporter.sendMail({
        from: '"Tienda de Autor" <no-reply@tiendadeautor.ar>',
        to: to,
        subject: 'Tienda de Autor',
        // text: 'Gracias por su compra!',
        html: body.contenido,
      });
      return { status: 200, message: 'Email enviado' };
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async createContacto(body: any) {
    const { nombre, email, telefono, mensaje } = body;
    console.log(Number(telefono));
    try {
      await db.query(
        'INSERT INTO contacto (nombre, email, telefono, mensaje, createdAt) VALUES (?, ?, ?, ?, ?)',
        [nombre, email, Number(telefono), mensaje, new Date()],
      );
      return { status: 201, message: 'Mensaje enviado' };
    } catch (error) {
      console.log(error);
      return { status: 500, message: 'Error al enviar el mensaje' };
    }
  }
  async findAllContacto() {
    try {
      const [contacto] = await db.query<RowDataPacket[]>(
        'SELECT * FROM contacto',
      );
      if (contacto.length === 0) {
        return { status: 204, message: 'No hay mensajes' };
      } else {
        return { status: 200, data: contacto };
      }
    } catch (error) {
      console.log(error);
      return { status: 500, message: 'Error al buscar los mensajes' };
    }
  }
  async totalPagesContacto() {
    try {
      const itemsPerPage = 12;
      const [result] = await db.query<ResultSetHeader>(
        'SELECT COUNT(*) as total FROM contacto',
      );
      const totalPages = Math.ceil(result[0].total / itemsPerPage);
      return totalPages;
    } catch (error) {
      console.log(error);
      return { status: 500, message: 'Error al buscar los mensajes' };
    }
  }
  async paginateContacto(
    page: string,
    estadoOrder: string,
    createdOrder: string,
  ) {
    const itemsPerPage = 12;
    const offset = (parseInt(page) - 1) * itemsPerPage;
    let sqlQuery = `SELECT * FROM contacto`;
    const queryParams = [];
    if (estadoOrder !== 'todos') {
      sqlQuery += ` WHERE estado = ?`;
      queryParams.push(estadoOrder);
    }
    sqlQuery += ` ORDER BY createdAt ${createdOrder}`;
    sqlQuery += ` LIMIT ?, ?`;
    console.log(sqlQuery, queryParams);
    try {
      const [contacto] = await db.query<RowDataPacket[]>(sqlQuery, [
        ...queryParams,
        offset,
        itemsPerPage,
      ]);
      let totalMatch;

      if (estadoOrder === 'todos') {
        [totalMatch] = await db.query('SELECT COUNT(*) as total FROM contacto');
      } else {
        [totalMatch] = await db.query(
          'SELECT COUNT(*) as total FROM contacto WHERE estado = ?',
          [estadoOrder],
        );
      }
      console.log(totalMatch[0].total);
      const totalPages = Math.ceil(totalMatch[0].total / itemsPerPage);
      return { contacto, totalPages };
    } catch (error) {
      console.log(error);
      return { status: 500, message: 'Error al buscar los mensajes' };
    }
  }
  async findOneContacto(id: string) {
    try {
      const [contacto] = await db.query<RowDataPacket[]>(
        'SELECT * FROM contacto WHERE id = ?',
        [id],
      );
      if (contacto.length === 0) {
        return { status: 204, message: 'No hay mensajes' };
      } else {
        return { status: 200, data: contacto[0] };
      }
    } catch (error) {
      console.log(error);
      return { status: 500, message: 'Error al buscar los mensajes' };
    }
  }

  async sendEmailArrepentimiento(
    id: number,
    estado: string,
    from: string,
    to: string,
    body: any,
  ) {
    console.log(body);
    console.log(id);
    console.log(estado);
    try {
      const transporter = nodemailer.createTransport({
        host: 'pampa.whservers.net',
        port: 465, //465 es true, sino false
        secure: true,
        auth: {
          user: 'no-reply@tiendadeautor.ar',
          pass: '{+gQbtSivj$)',
        },
      });
      const info = await transporter.sendMail({
        from: '"Tienda de Autor" <no-reply@tiendadeautor.ar>',
        to: to,
        subject: 'Tienda de Autor',
        // text: 'Gracias por su compra!',
        html: body.contenido,
      });
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      return { status: 200, message: 'Email enviado' };
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async createArrepentimiento(body: any) {
    const { nombre, email, telefono, mensaje, motivo, pedido } = body;
    console.log(body);
    try {
      await db.query(
        'INSERT INTO arrepentimientos (nombre, email, telefono, estado, motivo, mensaje, createdAt, numeroPedido) VALUES (?, ?, ?, ?, ?, ?, ?,?)',
        [
          nombre,
          email,
          telefono,
          'sin responder',
          motivo,
          mensaje,
          new Date(),
          pedido,
        ],
      );
      return { status: 201, message: 'Mensaje enviado' };
    } catch (error) {
      console.log(error);
      return { status: 500, message: 'Error al enviar el mensaje' };
    }
  }
  async findAllArrepentimiento() {
    try {
      const [arrepentimiento] = await db.query<RowDataPacket[]>(
        'SELECT * FROM arrepentimientos',
      );
      if (arrepentimiento.length === 0) {
        return { status: 204, message: 'No hay mensajes' };
      } else {
        return { status: 200, data: arrepentimiento };
      }
    } catch (error) {
      console.log(error);
      return { status: 500, message: 'Error al buscar los mensajes' };
    }
  }
  async totalPagesArrepentimiento() {
    try {
      const itemsPerPage = 12;
      const [result] = await db.query<ResultSetHeader>(
        'SELECT COUNT(*) as total FROM arrepentimientos',
      );
      const totalPages = Math.ceil(result[0].total / itemsPerPage);
      return totalPages;
    } catch (error) {
      console.log(error);
      return { status: 500, message: 'Error al buscar los mensajes' };
    }
  }
  async paginateArrepentimiento(
    page: string,
    estadoOrder: string,
    createdOrder: string,
  ) {
    const itemsPerPage = 12;
    const offset = (parseInt(page) - 1) * itemsPerPage;
    let sqlQuery = `SELECT * FROM arrepentimientos`;
    const queryParams = [];
    if (estadoOrder !== 'todos') {
      sqlQuery += ` WHERE estado = ?`;
      queryParams.push(estadoOrder);
    }
    sqlQuery += ` ORDER BY createdAt ${createdOrder}`;
    sqlQuery += ` LIMIT ?, ?`;
    console.log(sqlQuery, queryParams);
    try {
      const [arrepentimiento] = await db.query<RowDataPacket[]>(sqlQuery, [
        ...queryParams,
        offset,
        itemsPerPage,
      ]);
      let totalMatch;

      if (estadoOrder === 'todos') {
        [totalMatch] = await db.query(
          'SELECT COUNT(*) as total FROM arrepentimientos',
        );
      } else {
        [totalMatch] = await db.query(
          'SELECT COUNT(*) as total FROM arrepentimientos WHERE estado = ?',
          [estadoOrder],
        );
      }
      console.log(totalMatch[0].total);
      const totalPages = Math.ceil(totalMatch[0].total / itemsPerPage);
      return { status: 200, data: arrepentimiento, totalPages };
    } catch (error) {
      console.log(error);
      return { status: 500, message: 'Error al buscar los mensajes' };
    }
  }
  async findOneArrepentimiento(id: string) {
    try {
      const [arrepentimiento] = await db.query<RowDataPacket[]>(
        'SELECT * FROM arrepentimientos WHERE id = ?',
        [id],
      );
      if (arrepentimiento.length === 0) {
        return { status: 204, message: 'No hay mensajes' };
      } else {
        return { status: 200, data: arrepentimiento[0] };
      }
    } catch (error) {
      console.log(error);
      return { status: 500, message: 'Error al buscar los mensajes' };
    }
  }
}
