import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import db from 'src/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import * as nodemailer from 'nodemailer';
const client = new MercadoPagoConfig({
  accessToken:
    'TEST-3284764560087056-020209-ab62d2134e27be274847edd0d1128763-1393479532', //para pruebas locales
  // 'APP_USR-6529193745095712-022112-08e931b1b75d1dd91721c26d292e95d5-1688403407',
});
@Injectable()
export class MercadopagoService {
  async create(data: any) {
    try {
      const [result] = await db.query<ResultSetHeader>(
        'INSERT INTO clientes (nombreApellido, email, telefono, provincia, ciudad, direccion, codigoPostal) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          data.formData.nombreApellido,
          data.formData.email,
          data.formData.telefono,
          data.formData.provincia,
          data.formData.ciudad,
          data.formData.direccion,
          data.formData.codigoPostal,
        ],
      );
      const [resultado] = await db.query<ResultSetHeader>(
        'INSERT INTO compras (id_cliente, fecha) VALUES (?, ?)',
        [result.insertId, new Date()],
      );
      const products = data.products.map((item: any) => {
        return {
          id: item._id,
          title: item.name,
          // description: item.description,
          quantity: Number(item.quantity),
          unit_price: Number(item.price),
          currency_id: 'ARS',
          category_id: resultado.insertId.toString(),
          picture_url: item.image,
        };
      });
      const body = {
        items: products,
        back_urls: {
          success: 'https://tiendadeautor.ar/exito',
          failure: 'https://tiendadeautor.ar/error',
          pending: 'https://tiendadeautor.ar/error',
        },
      };
      const preference = new Preference(client);
      const res = await preference.create({ body });
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
        to: data.formData.email,
        subject: 'Compra en Tienda de Autor',
        text: 'Gracias por su compra!',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
      <img src="https://api.tiendadeautor.ar/uploads/logo.jpg" alt="Tienda de Autor" style="max-width: 100%; height: auto; margin-bottom: 20px;">
      <h2 style="color: #007bff; margin-bottom: 10px;">¡Gracias por tu compra en Tienda de Autor!</h2>
      <p>Hola ${data.formData.nombreApellido},</p>
      <p>Queremos agradecerte por haber realizado una compra en nuestra tienda.</p>
      <p>Resumen de tu compra:</p>
      <ul style="list-style: none; padding-left: 0;">
        ${data.products
          .map(
            (item: any) => `
          <li style="margin-bottom: 20px;">
            <img src="${item.image}" alt="${item.name}" style="max-width: 100px; height: auto; margin-right: 10px; vertical-align: middle;">
            <span style="vertical-align: middle;">${item.name}: ${item.quantity} x $${item.price}</span>
          </li>
        `,
          )
          .join('')}
      </ul>
      <p style="font-weight: bold;">El total de tu compra es: $${data.products.reduce((total: any, item: any) => total + item.quantity * item.price, 0).toFixed(2)}</p>
      <p style="margin-top: 20px;">Si tienes alguna pregunta o necesitas asistencia, no dudes en ponerte en contacto con nosotros.</p>
      <p>¡Esperamos que disfrutes de tus productos!</p>
      <p>Atentamente,</p>
      <p>Equipo de Tienda de Autor</p>
    </div>
      `,
      });
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      return res.sandbox_init_point;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async webhook(body: any) {
    console.log(body.data.id);
    const payment = await new Payment(client).get({ id: body.data.id });
    payment.additional_info.items.forEach(async (item: any) => {
      await db.query(
        'INSERT INTO detallescompra (id_compra, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
        [item.category_id, item.id, item.quantity, item.unit_price],
      );
      await db.query('UPDATE productos SET stock = stock - ? WHERE id = ?', [
        item.quantity,
        item.id,
      ]);
      await db.query('UPDATE compras SET estado = ? WHERE id = ?', [
        payment.status === 'approved' ? 'aprobado' : 'rechazado',
        item.category_id,
      ]);
    });
    return Response.json({ success: true });
  }

  findAll() {
    return `This action returns all mercadopag`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mercadopago`;
  }

  remove(id: number) {
    return `This action removes a #${id} mercadopago`;
  }

  async totalPages() {
    const itemsPerPage = 12; // total de productos por pages
    const [result] = await db.query<RowDataPacket[]>(
      `SELECT 
      clientes.*, 
      compras.id AS id_compra,
      compras.fecha,
      compras.estado,
      GROUP_CONCAT(detallescompra.id_producto) AS id_productos,
      GROUP_CONCAT(detallescompra.cantidad) AS cantidades,
      GROUP_CONCAT(detallescompra.precio_unitario) AS precios_unitarios,
      GROUP_CONCAT(productos.nombre) AS nombres_productos
    FROM 
      compras
    JOIN 
      clientes ON compras.id_cliente = clientes.id
    JOIN 
      detallescompra ON compras.id = detallescompra.id_compra
    JOIN 
      productos ON detallescompra.id_producto = productos.id
    GROUP BY
      compras.id
    ORDER BY id_compra DESC`,
    );
    // console.log(result.length);
    const totalPages = Math.ceil(result.length / itemsPerPage);
    console.log(totalPages);
    return totalPages;
  }

  async facturas(page: number) {
    const itemsPerPage = 12; // total de productos por página
    const offset = (page - 1) * itemsPerPage;
    const [facturas] = await db.query<RowDataPacket[]>(
      `
      SELECT 
      clientes.*, 
      compras.id AS id_compra,
      compras.fecha,
      compras.estado,
      GROUP_CONCAT(detallescompra.id_producto) AS id_productos,
      GROUP_CONCAT(detallescompra.cantidad) AS cantidades,
      GROUP_CONCAT(detallescompra.precio_unitario) AS precios_unitarios,
      GROUP_CONCAT(productos.nombre) AS nombres_productos,
      (SELECT GROUP_CONCAT(imagenesproducto.url) 
       FROM imagenesproducto 
       WHERE productos.id = imagenesproducto.productoId
      ) AS imagenes_productos
  FROM 
      compras
  JOIN 
      clientes ON compras.id_cliente = clientes.id
  JOIN 
      detallescompra ON compras.id = detallescompra.id_compra
  JOIN 
      productos ON detallescompra.id_producto = productos.id
  GROUP BY
      compras.id
  ORDER BY 
      id_compra DESC LIMIT ?, ?`,
      [offset, itemsPerPage],
    );
    console.log(facturas);
    const productos = facturas.map((factura: any) => {
      const idProductos = factura.id_productos.split(',');
      const cantidades = factura.cantidades.split(',');
      const preciosUnitarios = factura.precios_unitarios.split(',');
      const nombresProductos = factura.nombres_productos.split(',');
      const productos = idProductos.map((id: any, index: number) => {
        return {
          id,
          nombre: nombresProductos[index],
          cantidad: cantidades[index],
          precio_unitario: preciosUnitarios[index],
          imagen: factura.imagenes_productos.split(',')[index],
        };
      });
      return {
        ...factura,
        productos,
      };
    });
    return productos;
  }
}
