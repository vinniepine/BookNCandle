import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('home')
  home() {
    return { titulo: this.appService.getTitulo(), layout: false };
  }

  @Get('home2')
  @Render('home2')
  layout() {
    return { titulo: this.appService.getTitulo() };
  }

  @Get('sobre-mim')
  @Render('sobre')
  sobre() {
    return {};
  }
}
