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
