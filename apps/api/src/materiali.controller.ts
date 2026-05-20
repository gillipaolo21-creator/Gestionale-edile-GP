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
import { Materiale } from '@prisma/client';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CreateMaterialeDto, UpdateMaterialeDto } from './materiali.dto';
import { MaterialiService } from './materiali.service';

@ApiTags('materiali')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('materiali')
export class MaterialiController {
  constructor(private readonly materialiService: MaterialiService) {}

  @Get('totale/:commessaId')
  async getTotale(
    @Param('commessaId') commessaId: string,
  ): Promise<{ commessaId: string; totaleCosto: number }> {
    return this.materialiService.getTotalePerCommessa(commessaId);
  }

  @Get()
  async findAll(@Query('commessaId') commessaId: string): Promise<Materiale[]> {
    return this.materialiService.findAll(commessaId);
  }

  @Post()
  async create(@Body() dto: CreateMaterialeDto): Promise<Materiale> {
    return this.materialiService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateMaterialeDto): Promise<Materiale> {
    return this.materialiService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.materialiService.remove(id);
  }
}
