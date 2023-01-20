import { BaseEntity } from './../../core/entity/base.entity';
import { Entity, Column } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true, nullable: false })
  username: string;
  @Column({ unique: true, nullable: false })
  email: string;
}
