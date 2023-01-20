/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class BuyShareDto {
  @IsNotEmpty()
  @IsString()
  shareId: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(100000)
  amount: number;
}
