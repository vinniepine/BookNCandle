import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Render,
    Req,
    Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { validate } from 'src/common/validator/generic.validator';
import { PrioridadeService } from '../prioridade/prioridade.service';
import { ChamadoDto } from './chamado.dto';
import { ChamadoService } from './chamado.service';

@Controller('/chamado')
export class ChamadoController {
    constructor(
        private readonly chamadoService: ChamadoService,
        private readonly prioridadeService: PrioridadeService,
    ) { }

    @Get()
    @Render('chamado/listagem')
    async consulta() {
        const chamados = await this.chamadoService.getAll();

        return { listaChamados: chamados };
    }

    @Get('/novo')
    @Render('chamado/formulario-cadastro')
    async formularioCadastro() {
        const prioridades = await this.prioridadeService.getAll();
        return { prioridades };
    }

    @Post('/novo/salvar')
    async formularioCadastroSalvar(
        @Body() dadosForm: any,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        //import { validate } from "src/common/validator/generic.validator";

        const resultado = await validate(ChamadoDto, dadosForm);

        if (resultado.isError) {
            req.addFlash('error', resultado.getErrors);
            req.setOld(dadosForm);

            return res.redirect('/chamado/novo');
        } else {
            await this.chamadoService.create(dadosForm);

            req.addFlash('success', 'Chamado adicionado com sucesso!');

            return res.redirect('/chamado');
        }
    }

    /**
     * Get por Id para Exclusao
     */
    @Get('/:id/exclusao')
    @Render('chamado/formulario-exclusao')
    async formularioExclusao(
        @Param('id') id: number,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const chamado = await this.chamadoService.findOne(id);

        if (chamado == null) {
            req.addFlash('error', 'O chamado solicitado não foi encontrado!');

            return res.redirect('/chamado');
        }

        return { chamado };
    }

    @Delete('/:id/exclusao')
    async excluir(
        @Param('id') id: number,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const chamado = await this.chamadoService.findOne(id);

        if (chamado == null) {
            req.addFlash('error', 'O chamado solicitado não foi encontrado!');
        } else {
            req.addFlash(
                'success',
                `Chamado: ${chamado.titulo} excluído com sucesso!`,
            );
            await this.chamadoService.remove(id);
        }

        return res.redirect('/chamado');
    }

    /**
     * Get por Id - Atualização
     */
    @Get('/:id/atualizacao')
    @Render('chamado/formulario-atualizacao')
    async formularioAtualizacao(
        @Param('id') id: number,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const chamado = await this.chamadoService.findOne(id);

        if (chamado == null) {
            req.addFlash('error', 'O chamado solicitado não foi encontrado!');

            return res.redirect('/chamado');
        }

        const prioridades = await this.prioridadeService.getAll();

        return { chamado, prioridades };
    }

    @Put('/:id/atualizacao-salvar')
    async atualizacaoSalvar(
        @Param('id') id: number,
        @Body() dados: any,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const chamado = await this.chamadoService.findOne(id);

        if (chamado == null) {
            req.addFlash('error', 'O chamado solicitado não foi encontrado!');
            return res.redirect('/chamado');
        }

        const resultado = await validate(ChamadoDto, dados);

        if (resultado.isError) {
            req.addFlash('error', resultado.getErrors);
            req.setOld(dados);

            return res.redirect(`/chamado/${id}/atualizacao`);
        } else {
            await this.chamadoService.update(id, dados);

            req.addFlash('success', 'Chamado atualizado com sucesso!');

            return res.redirect('/chamado');
        }
    }
}
