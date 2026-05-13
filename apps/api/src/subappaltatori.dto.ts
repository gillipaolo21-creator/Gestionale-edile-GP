import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSubappaltatoreDto {
  @IsString() ragioneSociale!: string;
  @IsOptional() @IsString() piva?: string;
  @IsOptional() @IsString() codiceFiscale?: string;
  @IsOptional() @IsString() referente?: string;
  @IsOptional() @IsString() telefono?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() indirizzo?: string;
  @IsOptional() @IsString() citta?: string;
  @IsOptional() @IsString() specializzazione?: string;
  @IsOptional() @IsBoolean() attivo?: boolean;
  @IsOptional() @IsString() note?: string;
}

export class UpdateSubappaltatoreDto {
  @IsOptional() @IsString() ragioneSociale?: string;
  @IsOptional() @IsString() piva?: string;
  @IsOptional() @IsString() codiceFiscale?: string;
  @IsOptional() @IsString() referente?: string;
  @IsOptional() @IsString() telefono?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() indirizzo?: string;
  @IsOptional() @IsString() citta?: string;
  @IsOptional() @IsString() specializzazione?: string;
  @IsOptional() @IsBoolean() attivo?: boolean;
  @IsOptional() @IsString() note?: string;
}

export class CreateContrattoSubappaltoDto {
  @IsString() commessaId!: string;
  @IsString() descrizioneOpera!: string;
  @IsNumber() importoAffidato!: number;
  @IsOptional() @IsDateString() dataInizio?: string;
  @IsOptional() @IsDateString() dataFinePrevista?: string;
  @IsOptional() @IsString() note?: string;
}

export class UpdateContrattoSubappaltoDto {
  @IsOptional() @IsString() descrizioneOpera?: string;
  @IsOptional() @IsNumber() importoAffidato?: number;
  @IsOptional() @IsDateString() dataInizio?: string;
  @IsOptional() @IsDateString() dataFinePrevista?: string;
  @IsOptional() @IsString() note?: string;
}
