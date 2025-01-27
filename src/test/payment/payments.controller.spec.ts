import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { RegisterPaymentDto } from '../../payments/dto/register-payment.dto';

describe('PaymentsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/payments (POST)', async () => {
    const payment: RegisterPaymentDto = {
      name: 'John Doe',
      age: '0025',
      address: '123 Main St City',
      cpf: '12345678900',
      amountPaid: '0000000000001234',
      birthDate: '19900101',
    };

    return request(app.getHttpServer())
      .post('/payments')
      .send(payment)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toEqual(payment.name);
      });
  });

  it('/payments/upload (POST)', async () => {
    return request(app.getHttpServer())
      .post('/payments/upload')
      .attach('file', 'src/test/payment/test-file.txt')
      .expect(201)
      .expect((res) => {
        expect(res.body.message).toEqual('File uploaded successfully');
      });
  });

  it('/payments (GET)', async () => {
    return request(app.getHttpServer())
      .get('/payments')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it('/payments/:id (GET)', async () => {
    const payment = await request(app.getHttpServer()).post('/payments').send({
      name: 'Jane Doe',
      age: '0030',
      address: '456 Main St City',
      cpf: '09876543210',
      amountPaid: '0000000000005678',
      birthDate: '19950101',
    });

    return request(app.getHttpServer())
      .get(`/payments/${payment.body.id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toEqual('Jane Doe');
      });
  });

  it('/payments/:id (PUT)', async () => {
    const payment = await request(app.getHttpServer()).post('/payments').send({
      name: 'Jane Doe',
      age: '0030',
      address: '456 Main St City',
      cpf: '09876543210',
      amountPaid: '0000000000005678',
      birthDate: '19950101',
    });

    const updatedPayment: RegisterPaymentDto = {
      name: 'Jane Smith',
      age: '0031',
      address: '789 Main St City',
      cpf: '09876543210',
      amountPaid: '0000000000005679',
      birthDate: '19960101',
    };

    return request(app.getHttpServer())
      .put(`/payments/${payment.body.id}`)
      .send(updatedPayment)
      .expect(200)
      .expect((res) => {
        expect(res.body.name).toEqual(updatedPayment.name);
      });
  });

  it('/payments/:id (DELETE)', async () => {
    const payment = await request(app.getHttpServer()).post('/payments').send({
      name: 'Jane Doe',
      age: '0030',
      address: '456 Main St City',
      cpf: '09876543210',
      amountPaid: '0000000000005678',
      birthDate: '19950101',
    });

    return request(app.getHttpServer())
      .delete(`/payments/${payment.body.id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toEqual('Payment deleted successfully');
      });
  });
});
