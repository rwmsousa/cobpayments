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
        age: '0025',
        address: 'Rua Exemplo 123',
        cpf: '11111111111',
        amountPaid: '00000000100000',
        birthDate: '01011990',
      },
      {
        name: 'payment2',
        age: '0030',
        address: 'Avenida Exemplo 456',
        cpf: '22222222222',
        amountPaid: '00000000200000',
        birthDate: '02021985',
      },
      {
        name: 'payment3',
        age: '0040',
        address: 'Praça Exemplo 789',
        cpf: '33333333333',
        amountPaid: '00000000300000',
        birthDate: '03031975',
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
