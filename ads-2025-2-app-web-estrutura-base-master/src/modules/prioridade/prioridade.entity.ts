import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('prioridades')
export class Prioridade extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;
}
