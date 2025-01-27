import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async seed() {
    await this.seedPayments();
  }

  private async seedPayments() {
    const payments = [
      {
        name: 'payment1',
        cpf: '11111111111',
        email: 'payment1@example.com',
        color: 'red',
        annotations: 'annotation1',
      },
      {
        name: 'payment2',
        cpf: '22222222222',
        email: 'payment2@example.com',
        color: 'green',
        annotations: 'annotation2',
      },
      {
        name: 'payment3',
        cpf: '33333333333',
        email: 'payment3@example.com',
        color: 'blue',
        annotations: '',
      },
    ];

    for (const payment of payments) {
      const existingPayment = await this.paymentRepository.findOne({
        where: { cpf: payment.cpf },
      });
      if (!existingPayment) {
        await this.paymentRepository.save(payment);
      }
    }
  }
}
