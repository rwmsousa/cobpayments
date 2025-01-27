import { ApiProperty } from '@nestjs/swagger';

export class RegisterPaymentDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the payment' })
  name: string;

  @ApiProperty({
    example: '12345678900',
    description: 'The CPF of the payment',
  })
  cpf: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the payment',
  })
  email: string;

  @ApiProperty({
    example: 'blue',
    description: 'The favorite color of the payment',
  })
  color: string;

  @ApiProperty({
    example: 'Some annotations',
    description: 'Additional annotations',
  })
  annotations: string;
}
