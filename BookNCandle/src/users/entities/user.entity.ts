import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPPORT = 'SUPPORT', // operador de atendimento / suporte
}

@Entity('users') // nome da tabela no banco
export class User {
  @PrimaryGeneratedColumn()
  id: number; // id numérico automático

  @Column({ length: 150 })
  fullName: string; // nome completo do usuário

  @Column({ length: 150, unique: true })
  email: string; // e-mail único

  @Column()
  passwordHash: string; // senha já criptografada (nunca em texto puro)

  @Column({ length: 20, nullable: true })
  phone?: string; // telefone opcional

  @Column({ type: 'text', nullable: true })
  address?: string; // endereço opcional

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole; // nível de acesso
}
