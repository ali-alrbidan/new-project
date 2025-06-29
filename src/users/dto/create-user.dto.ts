import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  id: number;

  @IsString({ message: 'Name Sould be a string value' })
  @IsNotEmpty({ message: 'Name should be not empty' })
  @MinLength(3, { message: 'Name should be at least three characters' })
  name: string;

  @IsOptional()
  @IsString()
  @IsIn(['male', 'female'], {
    message: 'Gender must be either "male" or "female"',
  })
  gender?: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isMarried: boolean;
}
