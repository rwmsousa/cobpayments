import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  Logger,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PaymentsService } from './payments.service';
import { RegisterPaymentDto } from './dto/register-payment.dto';
import { registerPaymentSchema } from './dto/register-payment.schema';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { Multer } from 'multer';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiBody({ type: RegisterPaymentDto })
  @ApiResponse({ status: 201, description: 'Payment created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async registerPayment(@Body() paymentData: RegisterPaymentDto) {
    const { error } = registerPaymentSchema.validate(paymentData);
    if (error) {
      throw new BadRequestException(error.details[0].message);
    }

    try {
      return await this.paymentsService.registerPayment(paymentData);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Error registering payment', error.stack);
      throw new InternalServerErrorException(
        'Error registering payment: ' + error.message,
        error,
      );
    }
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  )
  @ApiOperation({ summary: 'Upload a file to seed payments' })
  @ApiResponse({
    status: 201,
    description: 'File uploaded and data seeded successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async uploadFile(@UploadedFile() file: Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    try {
      return await this.paymentsService.processFile(file.path);
    } catch (error) {
      this.logger.error('Error processing file', error.stack);
      throw new InternalServerErrorException(
        'Error processing file',
        error.message,
      );
    }
  }

  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Get all payments (admin only)' })
  @ApiResponse({ status: 200, description: 'Payments retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async listPayments() {
    try {
      return await this.paymentsService.listPayments();
    } catch (error) {
      this.logger.error('Error listing payments', error.stack);
      throw new InternalServerErrorException('Error listing payments', error);
    }
  }

  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({ summary: 'Get a payment by ID (admin only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Payment retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Payment not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async getPayment(@Param('id') id: number) {
    try {
      const payment = await this.paymentsService.getPayment(id);
      if (!payment) {
        throw new NotFoundException('Payment not found');
      }
      return payment;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Payment not found');
      }
      this.logger.error('Error getting payment', error.stack);
      throw new InternalServerErrorException('Error getting payment', error);
    }
  }

  @ApiBearerAuth()
  @Put(':id')
  @ApiOperation({ summary: 'Update a payment by ID (admin only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: RegisterPaymentDto })
  @ApiResponse({ status: 200, description: 'Payment updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Payment not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async updatePayment(
    @Param('id') id: number,
    @Body() paymentData: RegisterPaymentDto,
  ) {
    try {
      return await this.paymentsService.updatePayment(id, paymentData);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Payment not found');
      }
      this.logger.error('Error updating payment', error.stack);
      throw new InternalServerErrorException('Error updating payment', error);
    }
  }

  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a payment by ID (admin only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Payment deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Payment not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async deletePayment(@Param('id') id: number) {
    try {
      await this.paymentsService.deletePayment(id);
      return { message: 'Payment deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Payment not found');
      }
      this.logger.error('Error deleting payment', error.stack);
      throw new InternalServerErrorException('Error deleting payment', error);
    }
  }
}
