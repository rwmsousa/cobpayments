import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { RegisterPaymentDto } from './dto/register-payment.dto';
import { registerPaymentSchema } from './dto/register-payment.schema';
import * as fs from 'fs';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async registerPayment(paymentData: RegisterPaymentDto) {
    const { error } = registerPaymentSchema.validate(paymentData);
    if (error) {
      throw new BadRequestException(error.details[0].message);
    }

    try {
      return await this.paymentRepository.save(paymentData);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error registering payment: ' + error.message,
      );
    }
  }

  async processFile(filePath: string) {
    try {
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

      return { message: 'File uploaded and data seeded successfully' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error processing file',
        error.message,
      );
    } finally {
      fs.unlinkSync(filePath);
    }
  }

  async listPayments() {
    try {
      return await this.paymentRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(
        'Error listing payments: ' + error.message,
      );
    }
  }

  async getPayment(id: number) {
    try {
      const payment = await this.paymentRepository.findOne({ where: { id } });
      if (!payment) {
        throw new NotFoundException('Payment not found');
      }
      return payment;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error getting payment: ' + error.message,
      );
    }
  }

  async getPaymentByCpf(cpf: string): Promise<Payment | undefined> {
    return await this.paymentRepository.findOne({ where: { cpf } });
  }

  async updatePayment(
    id: number,
    paymentData: RegisterPaymentDto,
  ): Promise<Payment> {
    try {
      const existingPayment = await this.paymentRepository.findOne({
        where: { id },
      });
      if (!existingPayment) {
        throw new NotFoundException('Payment not found');
      }

      const updatedPayment = { ...existingPayment, ...paymentData };
      return await this.paymentRepository.save(updatedPayment);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error updating payment: ' + error.message,
      );
    }
  }

  async deletePayment(id: number): Promise<void> {
    try {
      const result = await this.paymentRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('Payment not found');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error deleting payment: ' + error.message,
      );
    }
  }
}
