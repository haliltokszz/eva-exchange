import { BuyShareDto } from '../shares/dto/buy-share.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { Portfolio } from './entities/portfolio.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { SharesService } from 'src/shares/shares.service';
import { SellShareDto } from 'src/shares/dto/sell-share.dto';
import { TransactionType } from 'src/transactions/entities/transaction.entity';
import { TransactionsService } from 'src/transactions/transactions.service';

@Injectable()
export class PortfoliosService {
  constructor(
    @InjectRepository(Portfolio)
    private portfoliosRepository: Repository<Portfolio>,
    private readonly usersService: UsersService,
    private readonly sharesService: SharesService,
    private readonly transactionsService: TransactionsService,
  ) {}

  async create(createPortfolioDto: CreatePortfolioDto): Promise<Portfolio> {
    const user = await this.usersService.findOne(createPortfolioDto.userId);
    const portfolio = Object.assign(createPortfolioDto);
    portfolio.user = user;
    return this.portfoliosRepository.save(portfolio);
  }

  findAll(): Promise<Portfolio[]> {
    return this.portfoliosRepository.find({ relations: ['user', 'shares'] });
  }

  findOne(id: string): Promise<Portfolio> {
    return this.portfoliosRepository.findOneBy({
      id,
    });
  }

  async update(id: string, updatePortfolioDto: UpdatePortfolioDto) {
    const user = await this.usersService.findOne(updatePortfolioDto.userId);
    const portfolio = await this.portfoliosRepository
      .find({
        where: { id: id },
        relations: ['user', 'shares'],
      })
      .then((portfolio: Portfolio[]) => portfolio[0]);
    Object.assign(portfolio, updatePortfolioDto);
    if (updatePortfolioDto.userId !== portfolio.user.id) {
      Object.assign(portfolio, user);
    }
    return this.portfoliosRepository.save(portfolio);
  }

  async remove(id: string): Promise<void> {
    await this.portfoliosRepository.delete(id);
  }

  async buyShare(id: string, buyShareDto: BuyShareDto) {
    const portfolio = await this.portfoliosRepository
      .find({
        where: { id: id },
        relations: ['user', 'shares'],
      })
      .then((portfolio: Portfolio[]) => portfolio[0]);
    const share = await this.sharesService.findOne(buyShareDto.shareId);
    if (portfolio.cash < share.rate * buyShareDto.amount) {
      throw new Error('Not enough cash');
    }
    for (let i = 0; i < buyShareDto.amount; i++) {
      portfolio.shares.push(share);
    }
    portfolio.cash -= share.rate * buyShareDto.amount;

    if (
      !this.transactionsService.canTransact(
        share.id,
        buyShareDto.amount,
        TransactionType.SELL, //satın alma isleminde satılan hisseleri kontrol eder
      )
    ) {
      throw new Error('Not enough shares sold');
    }

    this.transactionsService.create({
      shareId: share.id,
      userId: portfolio.user.id,
      type: TransactionType.BUY,
      isActive: false, //islem yapabiliyosa aktif degildir
    });

    //satılan hisselerin transactionları kapatilabilir
    // this.transactionsService.closeTransactions(
    //   share.id,
    //   buyShareDto.amount,
    // );

    return this.portfoliosRepository.save(portfolio);
  }

  async sellShare(id: string, sellShareDto: SellShareDto) {
    const portfolio = await this.portfoliosRepository
      .find({
        where: { id: id },
        relations: ['user', 'shares'],
      })
      .then((portfolio: Portfolio[]) => portfolio[0]);
    const shares = (await this.sharesService.findAll()).filter(
      (share) => share.id === sellShareDto.shareId,
    );

    if (sellShareDto.amount > shares.length) {
      throw new Error('Not enough shares');
    }

    for (let i = 0; i < sellShareDto.amount; i++) {
      portfolio.shares = portfolio.shares.filter(
        (share) => share.id !== sellShareDto.shareId,
      );
    }
    portfolio.cash -= shares[0].rate * sellShareDto.amount;

    this.transactionsService.create({
      shareId: sellShareDto.shareId,
      userId: portfolio.user.id,
      type: TransactionType.SELL,
      isActive: true,
    });

    return this.portfoliosRepository.save(portfolio);
  }
}
