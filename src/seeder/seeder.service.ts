import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    await this.seedPayments();
  }

  private async seedPayments() {
    const filePath = path.resolve(
      process.cwd(),
      'src',
      'seeder',
      'mock',
      'teste.txt',
    );
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const payments = fileContent.split('\n').map((line) => {
      const name = line.substring(0, 15).trim();
      const age = line.substring(15, 19).trim();
      const address = line.substring(19, 53).trim();
      const cpf = line.substring(53, 64).trim();
      const amountPaid = line.substring(64, 80).trim();
      const birthDate = line.substring(80, 88).trim();
      return { name, age, address, cpf, amountPaid, birthDate };
    });

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
