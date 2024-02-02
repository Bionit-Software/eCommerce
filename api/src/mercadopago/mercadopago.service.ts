import { Injectable } from '@nestjs/common';
import { UpdateMercadopagoDto } from './dto/update-mercadopago.dto';
import { MercadoPagoConfig, Preference } from 'mercadopago';
@Injectable()
export class MercadopagoService {
  async create(bodys: any) {
    const client = new MercadoPagoConfig({
      accessToken:
        'TEST-6704254495675715-020115-3207408da7478cc8df4a9783b0374469-324549984',
    });

    try {
      const body = {
        items: [
          {
            id: '1234',
            title: 'Dummy Item',
            // description: 'Multicolor Item',
            quantity: 1,
            unit_price: 10.0,
            currency_id: 'ARS',
          },
        ],
        // back_urls: {
        //   success: 'http://localhost:3000/success',
        //   failure: 'http://localhost:3000/failure',
        //   pending: 'http://localhost:3000/pending',
        // },
        // auto_return: 'approved',
      };
      const preference = new Preference(client);
      const res = await preference.create({ body });
      console.log(res);
      return res.sandbox_init_point;
    } catch (error) {
      console.error('Error:', error);
      // Handle error here, if needed
      // You can also throw the error again if necessary
      throw error;
    }
  }
  findAll() {
    return `This action returns all mercadopago`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mercadopago`;
  }

  update(id: number, updateMercadopagoDto: UpdateMercadopagoDto) {
    return `This action updates a #${id} mercadopago`;
  }

  remove(id: number) {
    return `This action removes a #${id} mercadopago`;
  }
}
