import { Module } from '@nestjs/common';
import { ProductosController } from './productos/productos.controller';
import { ProductosModule } from './productos/productos.module';
import { ProductosService } from './productos/productos.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CategoriasModule } from './categorias/categorias.module';
import { MarcasModule } from './marcas/marcas.module';
import { MercadopagoModule } from './mercadopago/mercadopago.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PaginasModule } from './paginas/paginas.module';
import { DolarModule } from './dolar/dolar.module';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      // rootPath: join(__dirname, '../../'), por si le pinta no andar
      rootPath: join(__dirname, '../'), //produccion
      serveStaticOptions: {
        index: false,
      },
    }),
    ProductosModule,
    CategoriasModule,
    MarcasModule,
    MercadopagoModule,
    UsuariosModule,
    PaginasModule,
    DolarModule,
  ],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class AppModule {}
