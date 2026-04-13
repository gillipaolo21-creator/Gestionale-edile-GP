import { TipoEntitaDocumento } from '@bresciani/db';
import { IsEnum, IsIn, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

const COMMESSA_CATEGORIE = [
  'Contratti Cliente',
  'Contratti Fornitori',
  'Documentazione Progettuale',
  'Offerte forniture di materiali',
  'Offerte forniture di servizi',
  'Documenti Fornitore Materiali',
  'Documenti Fornitore Servizi',
] as const;

export class UploadDocumentoDto {
  @IsEnum(TipoEntitaDocumento)
  @IsNotEmpty()
  entitaTipo!: TipoEntitaDocumento;

  @IsUUID()
  @IsNotEmpty()
  entitaId!: string;

  @IsOptional()
  @IsIn(COMMESSA_CATEGORIE)
  categoria?: string;

  @IsOptional()
  @IsString()
  sottocategoria?: string;

  @IsOptional()
  @IsString()
  datiEstrattiJson?: string;
}
