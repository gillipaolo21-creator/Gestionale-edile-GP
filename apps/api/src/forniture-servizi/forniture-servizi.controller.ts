import { FornituraServizio } from '@bresciani/db';
import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { CreateFornituraServizioDto } from './dto/create-fornitura-servizio.dto';
import { FornitureServiziService } from './forniture-servizi.service';

@Controller('commesse/:commessaId/forniture-servizi')
export class FornitureServiziController {
  constructor(private readonly fornitureServiziService: FornitureServiziService) { }

  @Get()
  async list(
    @Param('commessaId', new ParseUUIDPipe()) commessaId: string,
  ): Promise<FornituraServizio[]> {
    return this.fornitureServiziService.listByCommessa(commessaId);
  }

  @Post()
  async create(
    @Param('commessaId', new ParseUUIDPipe()) commessaId: string,
    @Body() payload: CreateFornituraServizioDto,
  ): Promise<FornituraServizio> {
    return this.fornitureServiziService.create(commessaId, payload);
  }
}
