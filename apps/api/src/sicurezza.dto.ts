import { TipoDocumentoSicurezza } from '@strade-servizi/db';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateDocumentoSicurezzaDto {
  @IsString() commessaId!: string;
  @IsEnum(TipoDocumentoSicurezza) tipo!: TipoDocumentoSicurezza;
  @IsString() titolo!: string;
  @IsOptional() @IsDateString() dataEmissione?: string;
  @IsOptional() @IsDateString() scadenza?: string;
  @IsOptional() @IsString() fileUrl?: string;
  @IsOptional() @IsString() note?: string;
}

export class UpdateDocumentoSicurezzaDto {
  @IsOptional() @IsEnum(TipoDocumentoSicurezza) tipo?: TipoDocumentoSicurezza;
  @IsOptional() @IsString() titolo?: string;
  @IsOptional() @IsDateString() dataEmissione?: string;
  @IsOptional() @IsDateString() scadenza?: string;
  @IsOptional() @IsString() fileUrl?: string;
  @IsOptional() @IsString() note?: string;
}
