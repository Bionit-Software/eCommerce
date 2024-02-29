import { Injectable } from '@nestjs/common';
import db from 'src/db';
import { RowDataPacket } from 'mysql2';
import { createHash } from 'crypto';

@Injectable()
export class UsuariosService {
  async login(body: any) {
    const { nombre, contrasena } = body;
    console.log(nombre, contrasena);

    // Obtener el usuario de la base de datos por nombre
    const [usuario] = await db.query<RowDataPacket[]>(
      'SELECT * FROM usuarios WHERE nombre = ?',
      [nombre],
    );

    if (usuario.length > 0) {
      try {
        // Comparar la contraseña ingresada con la contraseña hasheada almacenada en la base de datos
        const match =
          createHash('sha256').update(contrasena).digest('hex') ===
          usuario[0].contrasena;
        if (match === true) {
          return { status: 200, message: 'Usuario logueado' };
        } else {
          return { status: 400, message: 'Contraseña incorrecta' };
        }
      } catch (error) {
        console.log(error);
        return { status: 500, message: 'Error al loguear el usuario' };
      }
    } else {
      return { status: 400, message: 'Usuario no encontrado' };
    }
  }
}
