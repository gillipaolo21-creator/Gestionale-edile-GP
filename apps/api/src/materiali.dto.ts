import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMaterialeDto {
  @IsString() commessaId!: string;
  @IsString() societaId!: string;
  @IsString() fornitoreNome!: string;
  @IsString() descrizione!: string;
  @IsString() unitaMisura!: string;
  @IsNumber() quantita!: number;
  @IsNumber() prezzoUnitario!: number;
  @IsOptional() @IsDateString() dataConsegna?: string;
  @IsOptional() @IsString() ddt?: string;
  @IsOptional() @IsString() note?: string;
}

export class UpdateMaterialeDto {
  @IsOptional() @IsString() societaId?: string;
  @IsOptional() @IsString() fornitoreNome?: string;
  @IsOptional() @IsString() descrizione?: string;
  @IsOptional() @IsString() unitaMisura?: string;
  @IsOptional() @IsNumber() quantita?: number;
  @IsOptional() @IsNumber() prezzoUnitario?: number;
  @IsOptional() @IsDateString() dataConsegna?: string;
  @IsOptional() @IsString() ddt?: string;
  @IsOptional() @IsString() note?: string;
}
