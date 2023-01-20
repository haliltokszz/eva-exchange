import { BaseEntity } from 'src/core/entity/base.entity';
import { Share } from 'src/shares/entities/share.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  OneToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';

@Entity()
export class Portfolio extends BaseEntity {
  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToMany(() => Share)
  @JoinTable({
    name: 'portfolio_shares',
    joinColumn: {
      name: 'portfolioId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'shareId',
      referencedColumnName: 'id',
    },
  })
  shares: Share[];

  @Column({ unique: true, nullable: false })
  cash: number;
}
