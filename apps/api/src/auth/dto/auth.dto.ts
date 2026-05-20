import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@cantiere.it', description: 'Email utente' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password123', description: 'Password utente' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'mario.rossi@cantiere.it' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Password!23', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiPropertyOptional({ example: 'Mario' })
  @IsString()
  @IsOptional()
  nome?: string;

  @ApiPropertyOptional({ example: 'Rossi' })
  @IsString()
  @IsOptional()
  cognome?: string;
}
