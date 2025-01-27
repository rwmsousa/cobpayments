import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../entities/client.entity';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async seed() {
    await this.seedClients();
  }

  private async seedClients() {
    const clients = [
      {
        name: 'client1',
        cpf: '11111111111',
        email: 'client1@example.com',
        color: 'red',
        annotations: 'annotation1',
      },
      {
        name: 'client2',
        cpf: '22222222222',
        email: 'client2@example.com',
        color: 'green',
        annotations: 'annotation2',
      },
      {
        name: 'client3',
        cpf: '33333333333',
        email: 'client3@example.com',
        color: 'blue',
        annotations: '',
      },
    ];

    for (const client of clients) {
      const existingClient = await this.clientRepository.findOne({
        where: { cpf: client.cpf },
      });
      if (!existingClient) {
        await this.clientRepository.save(client);
      }
    }
  }
}
