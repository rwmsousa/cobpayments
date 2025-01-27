import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { Client } from '../entities/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
