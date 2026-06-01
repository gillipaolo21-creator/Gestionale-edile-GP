import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StatoPagamento, TipoDocumentoFiscale } from '@prisma/client';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

/** Usato dalla route piatta POST /fatture — commessaId obbligatorio nel body */
export class CreateFatturaDto {
  @ApiProperty({ enum: TipoDocumentoFiscale, example: TipoDocumentoFiscale.FATTURA_ATTIVA })
  @IsEnum(TipoDocumentoFiscale) tipoDocumento!: TipoDocumentoFiscale;

  @ApiProperty({ example: 'clxyz123' })
  @IsString() commessaId!: string;

  @ApiProperty({ example: 'soc_strade_servizi' })
  @IsString() societaId!: string;

  @ApiPropertyOptional() @IsOptional() @IsString() salId?: string;
  @ApiPropertyOptional({ example: '2026/001' }) @IsOptional() @IsString() numero?: string;
  @ApiPropertyOptional({ example: 'Comune di Milano' }) @IsOptional() @IsString() fornitoreCliente?: string;

  @ApiProperty({ example: 12500 })
  @IsNumber() importoImponibile!: number;

  @ApiPropertyOptional({ example: 22 }) @IsOptional() @IsNumber() iva?: number;
  @ApiPropertyOptional({ example: '2026-05-20' }) @IsOptional() @IsDateString() dataEmissione?: string;
  @ApiPropertyOptional({ example: '2026-06-20' }) @IsOptional() @IsDateString() dataScadenza?: string;
  @ApiPropertyOptional({ enum: StatoPagamento, example: StatoPagamento.DA_PAGARE }) @IsOptional() @IsEnum(StatoPagamento) statoPagamento?: StatoPagamento;
  @ApiPropertyOptional() @IsOptional() @IsString() note?: string;
}

/** Usato dalla route nidificata POST /commesse/:id/fatture — commessaId viene dall'URL */
export class CreateFatturaNestedDto {
  @ApiProperty({ enum: TipoDocumentoFiscale })
  @IsEnum(TipoDocumentoFiscale) tipoDocumento!: TipoDocumentoFiscale;

  @ApiProperty({ example: 'soc_strade_servizi' })
  @IsString() societaId!: string;

  @ApiPropertyOptional() @IsOptional() @IsString() salId?: string;
  @ApiPropertyOptional({ example: '2026/001' }) @IsOptional() @IsString() numero?: string;
  @ApiPropertyOptional({ example: 'Comune di Milano' }) @IsOptional() @IsString() fornitoreCliente?: string;

  @ApiProperty({ example: 12500 })
  @IsNumber() importoImponibile!: number;

  @ApiPropertyOptional({ example: 22 }) @IsOptional() @IsNumber() iva?: number;
  @ApiPropertyOptional({ example: '2026-05-20' }) @IsOptional() @IsDateString() dataEmissione?: string;
  @ApiPropertyOptional({ example: '2026-06-20' }) @IsOptional() @IsDateString() dataScadenza?: string;
  @ApiPropertyOptional({ enum: StatoPagamento }) @IsOptional() @IsEnum(StatoPagamento) statoPagamento?: StatoPagamento;
  @ApiPropertyOptional() @IsOptional() @IsString() note?: string;
}

export class UpdateFatturaDto {
  @ApiPropertyOptional({ example: 'soc_strade_servizi' })
  @IsOptional() @IsString() societaId?: string;
  @ApiPropertyOptional({ example: '2026/002' }) @IsOptional() @IsString() numero?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fornitoreCliente?: string;
  @ApiPropertyOptional({ example: 15000 }) @IsOptional() @IsNumber() importoImponibile?: number;
  @ApiPropertyOptional({ example: 22 }) @IsOptional() @IsNumber() iva?: number;
  @ApiPropertyOptional() @IsOptional() @IsDateString() dataEmissione?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() dataScadenza?: string;
  @ApiPropertyOptional({ enum: StatoPagamento }) @IsOptional() @IsEnum(StatoPagamento) statoPagamento?: StatoPagamento;
  @ApiPropertyOptional() @IsOptional() @IsString() note?: string;
}

