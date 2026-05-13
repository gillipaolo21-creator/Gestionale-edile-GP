import { StatoCommessa, TipoOpera } from '@strade-servizi/db';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCommessaDto {
  @IsString() codiceIdentificativo!: string;
  @IsOptional() @IsString() nomeCantiere?: string;
  @IsOptional() @IsString() committente?: string;
  /** Alias compatibilità frontend: nomeCliente → committente */
  @IsOptional() @IsString() nomeCliente?: string;
  @IsOptional() @IsEnum(TipoOpera) tipoOpera?: TipoOpera;
  /** Alias compatibilità frontend: tipoLavori viene ignorato (tipoOpera usa default ALTRO) */
  @IsOptional() @IsString() tipoLavori?: string;
  @IsOptional() @IsString() indirizzo?: string;
  @IsOptional() @IsString() citta?: string;
  @IsOptional() @IsString() cap?: string;
  @IsOptional() @IsString() provincia?: string;
  @IsOptional() @IsNumber() gpsLat?: number;
  @IsOptional() @IsNumber() gpsLng?: number;
  @IsOptional() @IsString() responsabile?: string;
  @IsOptional() @IsNumber() importoContratto?: number;
  @IsOptional() @IsNumber() importoLavoriPropri?: number;
  @IsOptional() @IsEnum(StatoCommessa) stato?: StatoCommessa;
  @IsOptional() @IsDateString() dataInizio?: string;
  @IsOptional() @IsDateString() dataFinePrevista?: string;
  @IsOptional() @IsDateString() dataFineEffettiva?: string;
  @IsOptional() @IsString() note?: string;
}

export class UpdateCommessaDto {
  @IsOptional() @IsString() nomeCantiere?: string;
  @IsOptional() @IsString() committente?: string;
  @IsOptional() @IsEnum(TipoOpera) tipoOpera?: TipoOpera;
  @IsOptional() @IsString() indirizzo?: string;
  @IsOptional() @IsString() citta?: string;
  @IsOptional() @IsString() cap?: string;
  @IsOptional() @IsString() provincia?: string;
  @IsOptional() @IsNumber() gpsLat?: number;
  @IsOptional() @IsNumber() gpsLng?: number;
  @IsOptional() @IsString() responsabile?: string;
  @IsOptional() @IsNumber() importoContratto?: number;
  @IsOptional() @IsNumber() importoLavoriPropri?: number;
  @IsOptional() @IsEnum(StatoCommessa) stato?: StatoCommessa;
  @IsOptional() @IsDateString() dataInizio?: string;
  @IsOptional() @IsDateString() dataFinePrevista?: string;
  @IsOptional() @IsDateString() dataFineEffettiva?: string;
  @IsOptional() @IsString() note?: string;
}

