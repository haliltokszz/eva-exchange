/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionDto } from './create-transaction.dto';

export class ValidateTransactionDto extends PartialType(CreateTransactionDto) {}
