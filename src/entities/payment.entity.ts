import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 15, default: ' ' })
  name: string;

  @Column({ length: 4, default: '0000' })
  age: string;

  @Column({ length: 34, default: ' ' })
  address: string;

  @Column({ length: 11, default: '00000000000' })
  cpf: string;

  @Column({ length: 16, default: '0000000000000000' })
  amountPaid: string;

  @Column({ length: 8, default: '00000000' })
  birthDate: string;
}
