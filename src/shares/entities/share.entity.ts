import { BaseEntity } from './../../core/entity/base.entity';
import { Entity, Column } from 'typeorm';

@Entity()
export class Share extends BaseEntity {
  @Column({ unique: true, nullable: false })
  symbol: string;
  @Column({ nullable: false })
  rate: number;
}
