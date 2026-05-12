import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateFornituraServizioDto {
  @IsString()
  @IsNotEmpty()
  fornitoreNome!: string;

  @IsNumber()
  @Min(0)
  importoFornitura!: number;

  @IsOptional()
  @IsString()
  descrizione?: string;

  @IsString()
  @IsNotEmpty()
  preventivoRiferimento!: string;

  @IsDateString()
  dataPreventivo!: string;
}
