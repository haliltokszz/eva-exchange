import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateShareDto } from './dto/create-share.dto';
import { UpdateShareDto } from './dto/update-share.dto';
import { Share } from './entities/share.entity';

@Injectable()
export class SharesService {
  constructor(
    @InjectRepository(Share)
    private sharesRepository: Repository<Share>,
  ) {}

  create(createShareDto: CreateShareDto): Promise<Share> {
    return this.sharesRepository.save(createShareDto);
  }

  findAll(): Promise<Share[]> {
    return this.sharesRepository.find();
  }

  findOne(id: string): Promise<Share> {
    return this.sharesRepository.findOneBy({ id });
  }

  update(id: string, updateShareDto: UpdateShareDto) {
    return this.sharesRepository.update(id, updateShareDto);
  }

  async remove(id: string): Promise<void> {
    await this.sharesRepository.delete(id);
  }
}
