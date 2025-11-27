import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

type PublicUser = Omit<User, 'passwordHash'>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  // Remove o passwordHash de um usuário
  private toPublic(user: User): PublicUser {
    const { passwordHash, ...rest } = user;
    return rest;
  }

  // --------- CREATE ----------
  async create(createUserDto: CreateUserDto): Promise<PublicUser> {
    const existing = await this.usersRepo.findOne({
      where: { email: createUserDto.email },
    });

    if (existing) {
      throw new BadRequestException('E-mail já cadastrado');
    }

    const passwordHash = await bcrypt.hash(createUserDto.password, 10);

    const user = this.usersRepo.create({
      fullName: createUserDto.fullName,
      email: createUserDto.email,
      phone: createUserDto.phone,
      address: createUserDto.address,
      role: createUserDto.role,
      passwordHash,
    });

    const saved = await this.usersRepo.save(user);
    return this.toPublic(saved);
  }

  // --------- READ ALL ----------
  async findAll(): Promise<PublicUser[]> {
    const users = await this.usersRepo.find();
    return users.map((u) => this.toPublic(u));
  }

  // --------- READ ONE ----------
  async findOne(id: number): Promise<PublicUser> {
    const user = await this.usersRepo.findOne({ where: { id } });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    return this.toPublic(user);
  }

  // --------- UPDATE ----------
  async update(id: number, updateUserDto: UpdateUserDto): Promise<PublicUser> {
    const user = await this.usersRepo.findOne({ where: { id } });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    // Checar e-mail duplicado
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingEmail = await this.usersRepo.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingEmail) {
        throw new BadRequestException('E-mail já cadastrado por outro usuário');
      }
    }

    // Re-hash da senha se vier password
    if (updateUserDto.password) {
      const newHash = await bcrypt.hash(updateUserDto.password, 10);
      user.passwordHash = newHash;
      delete updateUserDto.password;
    }

    Object.assign(user, updateUserDto);

    const saved = await this.usersRepo.save(user);
    return this.toPublic(saved);
  }

  // --------- DELETE ----------
  async remove(id: number): Promise<void> {
    await this.usersRepo.delete(id);
  }
}
