import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreatePortfolioDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(10)
  @Max(1000000)
  cash: number;
}
