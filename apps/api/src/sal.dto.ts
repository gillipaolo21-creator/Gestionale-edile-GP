import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StatoSAL, TipoSAL } from '@prisma/client';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

/** Usato dalla route piatta POST /sal — commessaId obbligatorio nel body */
export class CreateSalDto {
  @ApiProperty({ example: 'clxyz123', description: 'ID commessa' })
  @IsString() commessaId!: string;

  @ApiPropertyOptional() @IsOptional() @IsString() contrattoSubappaltoId?: string;
  @ApiPropertyOptional({ enum: TipoSAL, example: TipoSAL.ATTIVO }) @IsOptional() @IsEnum(TipoSAL) tipo?: TipoSAL;
  @ApiPropertyOptional({ example: 1 }) @IsOptional() @IsNumber() progressivo?: number;
  @ApiPropertyOptional({ example: '2026-06-01' }) @IsOptional() @IsDateString() dataCertificazione?: string;
  @ApiPropertyOptional({ example: 35.5 }) @IsOptional() @IsNumber() percentualeCompletamento?: number;

  @ApiProperty({ example: 85000 })
  @IsNumber() importoMaturato!: number;

  @ApiPropertyOptional({ example: 4250 }) @IsOptional() @IsNumber() importoRitenuta?: number;
  @ApiPropertyOptional({ enum: StatoSAL, example: StatoSAL.BOZZA }) @IsOptional() @IsEnum(StatoSAL) stato?: StatoSAL;
  @ApiPropertyOptional() @IsOptional() @IsString() note?: string;
}

/** Usato dalla route nidificata POST /commesse/:id/sal — commessaId viene dall'URL */
export class CreateSalNestedDto {
  @ApiPropertyOptional() @IsOptional() @IsString() contrattoSubappaltoId?: string;
  @ApiPropertyOptional({ enum: TipoSAL }) @IsOptional() @IsEnum(TipoSAL) tipo?: TipoSAL;
  @ApiPropertyOptional({ example: 1 }) @IsOptional() @IsNumber() progressivo?: number;
  @ApiPropertyOptional({ example: '2026-06-01' }) @IsOptional() @IsDateString() dataCertificazione?: string;
  @ApiPropertyOptional({ example: 35.5 }) @IsOptional() @IsNumber() percentualeCompletamento?: number;

  @ApiProperty({ example: 85000 })
  @IsNumber() importoMaturato!: number;

  @ApiPropertyOptional({ example: 4250 }) @IsOptional() @IsNumber() importoRitenuta?: number;
  @ApiPropertyOptional({ enum: StatoSAL }) @IsOptional() @IsEnum(StatoSAL) stato?: StatoSAL;
  @ApiPropertyOptional() @IsOptional() @IsString() note?: string;
}

export class UpdateSalDto {
  @ApiPropertyOptional({ example: '2026-06-30' }) @IsOptional() @IsDateString() dataCertificazione?: string;
  @ApiPropertyOptional({ example: 55 }) @IsOptional() @IsNumber() percentualeCompletamento?: number;
  @ApiPropertyOptional({ example: 130000 }) @IsOptional() @IsNumber() importoMaturato?: number;
  @ApiPropertyOptional({ example: 6500 }) @IsOptional() @IsNumber() importoRitenuta?: number;
  @ApiPropertyOptional({ enum: StatoSAL }) @IsOptional() @IsEnum(StatoSAL) stato?: StatoSAL;
  @ApiPropertyOptional() @IsOptional() @IsString() note?: string;
}

