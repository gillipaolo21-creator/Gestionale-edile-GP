import { Qualifica } from '@prisma/client';
import { IsBoolean, IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePersonaleDto {
  @IsString() matricola!: string;
  @IsString() nome!: string;
  @IsString() cognome!: string;
  @IsEnum(Qualifica) qualifica!: Qualifica;
  @IsOptional() @IsNumber() costoOrario?: number;
  @IsOptional() @IsString() telefono?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() codiceFiscale?: string;
  @IsOptional() @IsDateString() dataAssunzione?: string;
  @IsOptional() @IsBoolean() attivo?: boolean;
  @IsOptional() @IsString() note?: string;
}

export class UpdatePersonaleDto {
  @IsOptional() @IsString() matricola?: string;
  @IsOptional() @IsString() nome?: string;
  @IsOptional() @IsString() cognome?: string;
  @IsOptional() @IsEnum(Qualifica) qualifica?: Qualifica;
  @IsOptional() @IsNumber() costoOrario?: number;
  @IsOptional() @IsString() telefono?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() codiceFiscale?: string;
  @IsOptional() @IsDateString() dataAssunzione?: string;
  @IsOptional() @IsBoolean() attivo?: boolean;
  @IsOptional() @IsString() note?: string;
}

export class CreatePresenzaDto {
  @IsString() commessaId!: string;
  @IsDateString() data!: string;
  @IsNumber() oreOrdine!: number;
  @IsOptional() @IsNumber() oreExtra?: number;
  @IsOptional() @IsString() note?: string;
}

export class CreateCorsoSicurezzaDto {
  @IsString() tipoCorso!: string;
  @IsDateString() dataCorso!: string;
  @IsDateString() scadenza!: string;
  @IsOptional() @IsString() ente?: string;
  @IsOptional() @IsString() note?: string;
}

export class CreateDpiDto {
  @IsString() tipoDpi!: string;
  @IsDateString() dataConsegna!: string;
  @IsOptional() @IsDateString() scadenza?: string;
  @IsOptional() @IsString() note?: string;
}
