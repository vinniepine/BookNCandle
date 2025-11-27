import { Module } from '@nestjs/common';
import { PrioridadeService } from '../prioridade/prioridade.service';
import { ChamadoController } from './chamado.controller';
import { ChamadoService } from './chamado.service';

@Module({
    imports: [],
    controllers: [ChamadoController],
    providers: [ChamadoService, PrioridadeService],
})
export class ChamadoModule { }
