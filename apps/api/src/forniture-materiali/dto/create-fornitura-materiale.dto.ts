import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateFornituraMaterialeDto {
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
