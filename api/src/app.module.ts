import { Module } from '@nestjs/common';
import { ProductosController } from './productos/productos.controller';
import { ProductosModule } from './productos/productos.module';
import { ProductosService } from './productos/productos.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CategoriasModule } from './categorias/categorias.module';
import { MarcasModule } from './marcas/marcas.module';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../'),
      renderPath: '/uploads',
    }),
    ProductosModule,
    CategoriasModule,
    MarcasModule,
  ],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class AppModule {}
