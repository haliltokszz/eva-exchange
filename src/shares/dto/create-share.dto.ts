import {
  IsString,
  IsNotEmpty,
  Length,
  IsUppercase,
  IsNumber,
  Max,
  Min,
} from 'class-validator';

export class CreateShareDto {
  @IsString()
  @IsNotEmpty()
  @IsUppercase()
  @Length(3)
  symbol: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(10)
  @Max(100)
  rate: number;
}
