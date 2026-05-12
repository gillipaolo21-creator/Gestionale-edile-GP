import { StatoPagamento, TipoDocumentoFiscale } from '@bresciani/db';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

export class CreateFatturaDto {
  @IsEnum(TipoDocumentoFiscale)
  tipoDocumento!: TipoDocumentoFiscale;

  @IsOptional()
  @IsUUID()
  salId?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  importoImponibile!: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  iva!: number;

  @IsDateString()
  dataScadenza!: string;

  @IsOptional()
  @IsEnum(StatoPagamento)
  statoPagamento?: StatoPagamento;
}

export class UpdateFatturaDto {
  @IsOptional()
  @IsEnum(StatoPagamento)
  statoPagamento?: StatoPagamento;

  @IsOptional()
  @IsDateString()
  dataScadenza?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  importoImponibile?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  iva?: number;
}
