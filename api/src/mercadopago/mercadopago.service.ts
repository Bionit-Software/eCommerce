import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import db from 'src/db';
import { ResultSetHeader } from 'mysql2';
const client = new MercadoPagoConfig({
  accessToken:
    'TEST-3284764560087056-020209-ab62d2134e27be274847edd0d1128763-1393479532', //para pruebas locales
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
        // payer: {
        //   email: data.formData.email,
        //   address: {
        //     zip_code: data.formData.codigoPostal,
        //     street_name: data.formData.direccion,
        //   },
        //   name: data.formData.nombreApellido,
        //   phone: {
        //     area_code: '',
        //     number: data.formData.telefono,
        //   },
        // },
        back_urls: {
          success: 'http://localhost:3001/',
          failure: 'http://localhost:3001/',
          pending: 'http://localhost:3001/',
        },
        // auto_return: 'approved',
      };
      const preference = new Preference(client);
      const res = await preference.create({ body });
      console.log(res);
      // const init_point = res.body.init_point;
      return res.sandbox_init_point;
    } catch (error) {
      console.error('Error:', error);
      // Handle error here, if needed
      // You can also throw the error again if necessary
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

  async facturas() {
    const [facturas] = await db.query(`
    SELECT 
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
  `);
    return facturas;
  }
}
