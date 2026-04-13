import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class AppaltoVoceDto {
  @IsOptional()
  @IsUUID()
  parentId?: string | null;

  @IsString()
  @IsNotEmpty()
  descrizione!: string;

  @IsString()
  @IsNotEmpty()
  unitaMisura!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  quantita!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  prezzoUnitario!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  avanzamentoPercent!: number;
}
