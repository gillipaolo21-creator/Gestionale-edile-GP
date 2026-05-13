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
import { Sal, TipoSAL } from '@strade-servizi/db';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CreateSalDto, UpdateSalDto } from './sal.dto';
import { SalService } from './sal.service';

@ApiTags('sal')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sal')
export class SalController {
  constructor(private readonly salService: SalService) {}

  @Get()
  async findAll(
    @Query('commessaId') commessaId?: string,
    @Query('tipo') tipo?: TipoSAL,
  ): Promise<Sal[]> {
    return this.salService.findAll({ commessaId, tipo });
  }

  @Post()
  async create(@Body() dto: CreateSalDto): Promise<Sal> {
    return this.salService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateSalDto): Promise<Sal> {
    return this.salService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.salService.remove(id);
  }
}
