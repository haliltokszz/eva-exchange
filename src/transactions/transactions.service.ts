import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction, TransactionType } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}

  create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    return this.transactionsRepository.save(createTransactionDto);
  }

  findAll(): Promise<Transaction[]> {
    return this.transactionsRepository.find({ relations: ['user', 'share'] });
  }

  findOne(id: string): Promise<Transaction> {
    return this.transactionsRepository.findOneBy({ id });
  }

  update(id: string, updateTransactionDto: UpdateTransactionDto) {
    return this.transactionsRepository.update(id, updateTransactionDto);
  }

  async remove(id: string): Promise<void> {
    await this.transactionsRepository.delete(id);
  }

  async canTransact(
    shareId: string,
    amount: number,
    type: TransactionType,
  ): Promise<boolean> {
    const transactions = (
      await this.transactionsRepository.find({
        // where: {
        //   share: {
        //     id: shareId,
        //   },
        //   type,
        // },
        relations: ['user', 'shares'],
      })
    ).filter((transaction) => {
      return (
        transaction.share.id === shareId &&
        transaction.type === type &&
        transaction.isActive
      );
    });

    if (transactions.length < amount) return false;

    return true;
  }
}
