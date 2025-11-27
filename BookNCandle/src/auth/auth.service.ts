import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';

type PublicUser = Omit<User, 'passwordHash'>;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  private toPublic(user: User): PublicUser {
    const { passwordHash, ...rest } = user;
    return rest;
  }

  // valida email + senha e devolve o User completo (internamente)
  private async validateUser(loginDto: LoginDto): Promise<User> {
    const { email, password } = loginDto;

    const user = await this.usersRepo.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const passwordOk = await bcrypt.compare(password, user.passwordHash);

    if (!passwordOk) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return user;
  }

  // método usado pelo controller: faz login e gera token
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);

    const payload = { sub: user.id, role: user.role };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      user: this.toPublic(user), // sem passwordHash
      accessToken,
    };
  }
}
