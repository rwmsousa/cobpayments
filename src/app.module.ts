import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentsModule } from './payments/payments.module';
import * as dotenv from 'dotenv';
import { PaymentsService } from './payments/payments.service';
import { PaymentsController } from './payments/payments.controller';
import { Payment } from './entities/payment.entity';

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
      // synchronize: true,
      schema: process.env.DATABASE_SCHEMA,
      logging: Boolean(process.env.DATABASE_LOGGING),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
    }),
    PaymentsModule,
    TypeOrmModule.forFeature([Payment]),
  ],
  controllers: [AppController, PaymentsController],
  providers: [AppService, PaymentsService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply()
      .forRoutes(
        { path: 'payments', method: RequestMethod.GET },
        { path: 'payments/:id', method: RequestMethod.GET },
        { path: 'payments/:id', method: RequestMethod.PUT },
        { path: 'payments/:id', method: RequestMethod.DELETE },
        { path: 'payments/upload', method: RequestMethod.POST },
      );
  }
}
