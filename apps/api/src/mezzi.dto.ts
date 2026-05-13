import { StatoMezzo, TipoMezzo } from '@strade-servizi/db';
import { IsBoolean, IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMezzoDto {
  @IsString() codice!: string;
  @IsString() descrizione!: string;
  @IsEnum(TipoMezzo) tipo!: TipoMezzo;
  @IsOptional() @IsString() targa?: string;
  @IsOptional() @IsNumber() annoImmatricol?: number;
  @IsOptional() @IsNumber() costoOrario?: number;
  @IsOptional() @IsString() proprietario?: string;
  @IsOptional() @IsEnum(StatoMezzo) stato?: StatoMezzo;
  @IsOptional() @IsString() note?: string;
}

export class UpdateMezzoDto {
  @IsOptional() @IsString() codice?: string;
  @IsOptional() @IsString() descrizione?: string;
  @IsOptional() @IsEnum(TipoMezzo) tipo?: TipoMezzo;
  @IsOptional() @IsString() targa?: string;
  @IsOptional() @IsNumber() annoImmatricol?: number;
  @IsOptional() @IsNumber() costoOrario?: number;
  @IsOptional() @IsString() proprietario?: string;
  @IsOptional() @IsEnum(StatoMezzo) stato?: StatoMezzo;
  @IsOptional() @IsString() note?: string;
}

export class CreateAssegnazioneMezzoDto {
  @IsString() commessaId!: string;
  @IsDateString() dataInizio!: string;
  @IsOptional() @IsDateString() dataFine?: string;
  @IsOptional() @IsNumber() oreImpiegate?: number;
  @IsOptional() @IsString() note?: string;
}

export class CreateScadenzaMezzoDto {
  @IsString() tipoScadenza!: string;
  @IsDateString() scadenza!: string;
  @IsOptional() @IsBoolean() completata?: boolean;
  @IsOptional() @IsString() note?: string;
}
