import { Module } from '@nestjs/common';
import { DolarService } from './dolar.service';
import { DolarController } from './dolar.controller';

@Module({
  controllers: [DolarController],
  providers: [DolarService],
})
export class DolarModule {}
