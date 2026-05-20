import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StatoCommessa, TipoOpera } from '@prisma/client';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCommessaDto {
  @ApiProperty({ example: 'CME-2026-001', description: 'Codice univoco commessa' })
  @IsString() codiceIdentificativo!: string;

  @ApiPropertyOptional({ example: 'Cantiere Via Roma 12' })
  @IsOptional() @IsString() nomeCantiere?: string;

  @ApiPropertyOptional({ example: 'Comune di Milano' })
  @IsOptional() @IsString() committente?: string;

  /** Alias compatibilità frontend: nomeCliente → committente */
  @ApiPropertyOptional({ example: 'Comune di Milano' })
  @IsOptional() @IsString() nomeCliente?: string;

  @ApiPropertyOptional({ enum: TipoOpera, example: TipoOpera.OPERE_CIVILI })
  @IsOptional() @IsEnum(TipoOpera) tipoOpera?: TipoOpera;

  /** Alias compatibilità frontend: tipoLavori viene ignorato (tipoOpera usa default ALTRO) */
  @ApiPropertyOptional({ example: 'Ristrutturazione' })
  @IsOptional() @IsString() tipoLavori?: string;

  @ApiPropertyOptional({ example: 'Via Roma 12' })
  @IsOptional() @IsString() indirizzo?: string;

  @ApiPropertyOptional({ example: 'Milano' })
  @IsOptional() @IsString() citta?: string;

  @ApiPropertyOptional({ example: '20100' })
  @IsOptional() @IsString() cap?: string;

  @ApiPropertyOptional({ example: 'MI' })
  @IsOptional() @IsString() provincia?: string;

  @ApiPropertyOptional({ example: 45.4654 })
  @IsOptional() @IsNumber() gpsLat?: number;

  @ApiPropertyOptional({ example: 9.1859 })
  @IsOptional() @IsNumber() gpsLng?: number;

  @ApiPropertyOptional({ example: 'Ing. Bianchi' })
  @IsOptional() @IsString() responsabile?: string;

  @ApiPropertyOptional({ example: 250000 })
  @IsOptional() @IsNumber() importoContratto?: number;

  @ApiPropertyOptional({ example: 200000 })
  @IsOptional() @IsNumber() importoLavoriPropri?: number;

  @ApiPropertyOptional({ enum: StatoCommessa, example: StatoCommessa.IN_CORSO })
  @IsOptional() @IsEnum(StatoCommessa) stato?: StatoCommessa;

  @ApiPropertyOptional({ example: '2026-01-15' })
  @IsOptional() @IsDateString() dataInizio?: string;

  @ApiPropertyOptional({ example: '2026-12-31' })
  @IsOptional() @IsDateString() dataFinePrevista?: string;

  @ApiPropertyOptional({ example: '2027-03-01' })
  @IsOptional() @IsDateString() dataFineEffettiva?: string;

  @ApiPropertyOptional({ example: 'Lavori urgenti su segnalazione' })
  @IsOptional() @IsString() note?: string;
}

export class UpdateCommessaDto {
  @ApiPropertyOptional({ example: 'Cantiere Aggiornato' })
  @IsOptional() @IsString() nomeCantiere?: string;

  @ApiPropertyOptional({ example: 'Nuovo Committente Srl' })
  @IsOptional() @IsString() committente?: string;

  @ApiPropertyOptional({ enum: TipoOpera })
  @IsOptional() @IsEnum(TipoOpera) tipoOpera?: TipoOpera;

  @ApiPropertyOptional() @IsOptional() @IsString() indirizzo?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() citta?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cap?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() provincia?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() gpsLat?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() gpsLng?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() responsabile?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() importoContratto?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() importoLavoriPropri?: number;
  @ApiPropertyOptional({ enum: StatoCommessa }) @IsOptional() @IsEnum(StatoCommessa) stato?: StatoCommessa;
  @ApiPropertyOptional() @IsOptional() @IsDateString() dataInizio?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() dataFinePrevista?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() dataFineEffettiva?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() note?: string;
}

