import { FornituraMateriale } from '@bresciani/db';
import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { CreateFornituraMaterialeDto } from './dto/create-fornitura-materiale.dto';
import { FornitureMaterialiService } from './forniture-materiali.service';

@Controller('commesse/:commessaId/forniture-materiali')
export class FornitureMaterialiController {
  constructor(private readonly fornitureMaterialiService: FornitureMaterialiService) { }

  @Get()
  async list(
    @Param('commessaId', new ParseUUIDPipe()) commessaId: string,
  ): Promise<FornituraMateriale[]> {
    return this.fornitureMaterialiService.listByCommessa(commessaId);
  }

  @Post()
  async create(
    @Param('commessaId', new ParseUUIDPipe()) commessaId: string,
    @Body() payload: CreateFornituraMaterialeDto,
  ): Promise<FornituraMateriale> {
    return this.fornitureMaterialiService.create(commessaId, payload);
  }
}
