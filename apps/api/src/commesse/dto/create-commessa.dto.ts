import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested
} from 'class-validator';
import { AttivitaDto } from './create-attivita.dto';

/**
 * SOLID: DTO aggiornato con i campi geografici separati (citta, cap)
 * per permettere alla ValidationPipe di accettarli senza lanciare errore.
 */
export class CreateCommessaDto {
  @IsString()
  @IsOptional()
  codiceIdentificativo?: string;

  @IsString()
  @IsNotEmpty()
  tipoLavori!: string;

  @IsString()
  @IsNotEmpty()
  nomeCantiere!: string;

  @IsOptional()
  @IsString()
  nomeCliente?: string;

  @IsOptional()
  @IsString()
  indirizzo?: string;

  @IsOptional()
  @IsString()
  citta?: string;

  @IsOptional()
  @IsString()
  cap?: string;

  @IsOptional()
  @IsString()
  responsabile?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  budgetIniziale?: number;

  @IsDateString()
  @IsNotEmpty()
  dataInizio!: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AttivitaDto)
  attivita?: AttivitaDto[];
}
