import { ApiProperty } from '@nestjs/swagger';

export class RegisterPaymentDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the payment' })
  name: string;

  @ApiProperty({
    example: '0025',
    description: 'The age of the payment',
  })
  age: string;

  @ApiProperty({
    example: '123 Main St City',
    description: 'The address of the payment',
  })
  address: string;

  @ApiProperty({
    example: '12345678900',
    description: 'The CPF of the payment',
  })
  cpf: string;

  @ApiProperty({
    example: '0000000000001234',
    description: 'The amount paid',
  })
  amountPaid: string;

  @ApiProperty({
    example: '19900101',
    description: 'The birth date of the payment',
  })
  birthDate: string;
}
