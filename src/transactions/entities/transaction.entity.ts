import { BaseEntity } from 'src/core/entity/base.entity';
import { Share } from 'src/shares/entities/share.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class Transaction extends BaseEntity {
  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToOne(() => Share)
  @JoinColumn()
  share: Share;

  @Column({ nullable: false })
  type: TransactionType;

  @Column({ nullable: false })
  isActive: boolean;
}

export enum TransactionType {
  BUY = 'BUY',
  SELL = 'SELL',
}
