import { StatoSAL } from '@bresciani/db';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class CreateSalDto {
  @IsDateString()
  dataCertificazione!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  @Type(() => Number)
  percentualeCompletamento!: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  importoMaturato!: number;

  @IsOptional()
  @IsEnum(StatoSAL)
  statoApprovazione?: StatoSAL;
}

export class UpdateSalDto {
  @IsOptional()
  @IsEnum(StatoSAL)
  statoApprovazione?: StatoSAL;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  @Type(() => Number)
  percentualeCompletamento?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  importoMaturato?: number;

  @IsOptional()
  @IsDateString()
  dataCertificazione?: string;
}
