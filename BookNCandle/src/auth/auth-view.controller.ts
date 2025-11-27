import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller()
export class AuthViewController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  getLogin(@Req() req: any, @Res() res: Response) {
    const [error] = req.flash ? req.flash('error') : [undefined];
    return res.render('auth/login', { error });
  }

  @Post('login')
  async postLogin(@Req() req: any, @Res() res: Response) {
    const { email, password } = req.body;

    try {
      const result = await this.authService.login({
        email,
        password,
      } as LoginDto);

      req.session.user = result.user;
      req.session.token = result.accessToken;

      return res.redirect('/users');
    } catch (e) {
      req.flash('error', 'E-mail ou senha inválidos');
      return res.redirect('/login');
    }
  }
}
