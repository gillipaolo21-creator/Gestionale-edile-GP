import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DocumentoSicurezza } from '@prisma/client';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CreateDocumentoSicurezzaDto, UpdateDocumentoSicurezzaDto } from './sicurezza.dto';
import { SicurezzaService } from './sicurezza.service';

@ApiTags('sicurezza')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sicurezza')
export class SicurezzaController {
  constructor(private readonly sicurezzaService: SicurezzaService) {}

  @Get('scadenze')
  async getScadenze(): Promise<DocumentoSicurezza[]> {
    return this.sicurezzaService.getScadenzeImminenti();
  }

  @Get()
  async findAll(@Query('commessaId') commessaId?: string): Promise<DocumentoSicurezza[]> {
    return this.sicurezzaService.findAll(commessaId);
  }

  @Post()
  async create(@Body() dto: CreateDocumentoSicurezzaDto): Promise<DocumentoSicurezza> {
    return this.sicurezzaService.create(dto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateDocumentoSicurezzaDto,
  ): Promise<DocumentoSicurezza> {
    return this.sicurezzaService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.sicurezzaService.remove(id);
  }
}
