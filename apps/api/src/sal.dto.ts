import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { TipoSAL, StatoSAL } from '@strade-servizi/db';

/** Usato dalla route piatta POST /sal — commessaId obbligatorio nel body */
export class CreateSalDto {
  @IsString() commessaId!: string;
  @IsOptional() @IsString() contrattoSubappaltoId?: string;
  @IsOptional() @IsEnum(TipoSAL) tipo?: TipoSAL;
  @IsOptional() @IsNumber() progressivo?: number;
  @IsOptional() @IsDateString() dataCertificazione?: string;
  @IsOptional() @IsNumber() percentualeCompletamento?: number;
  @IsNumber() importoMaturato!: number;
  @IsOptional() @IsNumber() importoRitenuta?: number;
  @IsOptional() @IsEnum(StatoSAL) stato?: StatoSAL;
  @IsOptional() @IsString() note?: string;
}

/** Usato dalla route nidificata POST /commesse/:id/sal — commessaId viene dall'URL */
export class CreateSalNestedDto {
  @IsOptional() @IsString() contrattoSubappaltoId?: string;
  @IsOptional() @IsEnum(TipoSAL) tipo?: TipoSAL;
  @IsOptional() @IsNumber() progressivo?: number;
  @IsOptional() @IsDateString() dataCertificazione?: string;
  @IsOptional() @IsNumber() percentualeCompletamento?: number;
  @IsNumber() importoMaturato!: number;
  @IsOptional() @IsNumber() importoRitenuta?: number;
  @IsOptional() @IsEnum(StatoSAL) stato?: StatoSAL;
  @IsOptional() @IsString() note?: string;
}

export class UpdateSalDto {
  @IsOptional() @IsDateString() dataCertificazione?: string;
  @IsOptional() @IsNumber() percentualeCompletamento?: number;
  @IsOptional() @IsNumber() importoMaturato?: number;
  @IsOptional() @IsNumber() importoRitenuta?: number;
  @IsOptional() @IsEnum(StatoSAL) stato?: StatoSAL;
  @IsOptional() @IsString() note?: string;
}

