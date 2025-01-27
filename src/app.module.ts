import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from './clients/clients.module';
import { SeederModule } from './seeder/seeder.module';
import * as dotenv from 'dotenv';
import { ClientsService } from './clients/clients.service';
import { ClientsController } from './clients/clients.controller';
import { Client } from './entities/client.entity';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE),
      schema: process.env.DATABASE_SCHEMA,
      logging: Boolean(process.env.DATABASE_LOGGING),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
    }),
    ClientsModule,
    SeederModule,
    TypeOrmModule.forFeature([Client]),
  ],
  controllers: [AppController, ClientsController],
  providers: [AppService, ClientsService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply()
      .forRoutes(
        { path: 'clients', method: RequestMethod.GET },
        { path: 'clients/:id', method: RequestMethod.GET },
        { path: 'clients/:id', method: RequestMethod.PUT },
        { path: 'clients/:id', method: RequestMethod.DELETE },
      );
  }
}
