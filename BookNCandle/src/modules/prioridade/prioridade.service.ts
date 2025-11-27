import { Injectable } from '@nestjs/common';
import { Prioridade } from './prioridade.entity';

@Injectable()
export class PrioridadeService {
  async getAll() {
    return await Prioridade.find();
  }
}
