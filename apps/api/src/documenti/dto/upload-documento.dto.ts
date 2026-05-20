import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoEntitaDocumento } from '@prisma/client';
import { IsEnum, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
  @ApiProperty({ enum: TipoEntitaDocumento, example: TipoEntitaDocumento.COMMESSA })
  @IsEnum(TipoEntitaDocumento)
  @IsNotEmpty()
  entitaTipo!: TipoEntitaDocumento;

  @ApiProperty({ example: 'clxyz123', description: 'ID entità collegata' })
  @IsString()
  @IsNotEmpty()
  entitaId!: string;

  @ApiPropertyOptional({ example: 'Contratti Cliente', enum: COMMESSA_CATEGORIE })
  @IsOptional()
  @IsIn(COMMESSA_CATEGORIE)
  categoria?: string;

  @ApiPropertyOptional({ example: 'Comune di Milano' })
  @IsOptional()
  @IsString()
  sottocategoria?: string;

  @ApiPropertyOptional({ example: '{"nomeCliente":"Comune di Milano","importoContratto":250000}', description: 'JSON blob con metadati documento' })
  @IsOptional()
  @IsString()
  datiEstrattiJson?: string;
}
