import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { TipoDocumentoFiscale, StatoPagamento } from '@strade-servizi/db';

/** Usato dalla route piatta POST /fatture — commessaId obbligatorio nel body */
export class CreateFatturaDto {
  @IsEnum(TipoDocumentoFiscale) tipoDocumento!: TipoDocumentoFiscale;
  @IsString() commessaId!: string;
  @IsOptional() @IsString() salId?: string;
  @IsOptional() @IsString() numero?: string;
  @IsOptional() @IsString() fornitoreCliente?: string;
  @IsNumber() importoImponibile!: number;
  @IsOptional() @IsNumber() iva?: number;
  @IsOptional() @IsDateString() dataEmissione?: string;
  @IsOptional() @IsDateString() dataScadenza?: string;
  @IsOptional() @IsEnum(StatoPagamento) statoPagamento?: StatoPagamento;
  @IsOptional() @IsString() note?: string;
}

/** Usato dalla route nidificata POST /commesse/:id/fatture — commessaId viene dall'URL */
export class CreateFatturaNestedDto {
  @IsEnum(TipoDocumentoFiscale) tipoDocumento!: TipoDocumentoFiscale;
  @IsOptional() @IsString() salId?: string;
  @IsOptional() @IsString() numero?: string;
  @IsOptional() @IsString() fornitoreCliente?: string;
  @IsNumber() importoImponibile!: number;
  @IsOptional() @IsNumber() iva?: number;
  @IsOptional() @IsDateString() dataEmissione?: string;
  @IsOptional() @IsDateString() dataScadenza?: string;
  @IsOptional() @IsEnum(StatoPagamento) statoPagamento?: StatoPagamento;
  @IsOptional() @IsString() note?: string;
}

export class UpdateFatturaDto {
  @IsOptional() @IsString() numero?: string;
  @IsOptional() @IsString() fornitoreCliente?: string;
  @IsOptional() @IsNumber() importoImponibile?: number;
  @IsOptional() @IsNumber() iva?: number;
  @IsOptional() @IsDateString() dataEmissione?: string;
  @IsOptional() @IsDateString() dataScadenza?: string;
  @IsOptional() @IsEnum(StatoPagamento) statoPagamento?: StatoPagamento;
  @IsOptional() @IsString() note?: string;
}

