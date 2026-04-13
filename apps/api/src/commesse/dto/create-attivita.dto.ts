import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { StatoAttivita } from '@bresciani/db';

/**
 * DTO per la singola attività (Foglio Figlio).
 * Gestisce la struttura gerarchica della WBS (Work Breakdown Structure).
 * Rispetta il principio SOLID di Single Responsibility.
 */
export class AttivitaDto {
  @IsString()
  @IsNotEmpty()
  titolo!: string;

  @IsOptional()
  @IsString()
  descrizione?: string;

  @IsNumber()
  @Min(0)
  importoPrevisto!: number;

  @IsOptional()
  @IsDateString()
  dataInizio?: string;

  @IsOptional()
  @IsDateString()
  dataFine?: string;

  @IsOptional()
  @IsString()
  responsabile?: string;

  @IsOptional()
  @IsEnum(StatoAttivita)
  stato?: StatoAttivita;

  /**
   * Supporto alla ricorsione per creare interi rami dell'albero in un'unica transazione.
   * Fondamentale per la gestione dei "Fogli Figli" all'interno della Commessa Padre.
   */
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AttivitaDto)
  sottocategorie?: AttivitaDto[];
}