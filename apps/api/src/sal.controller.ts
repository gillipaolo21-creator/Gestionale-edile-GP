import { Sal } from '@bresciani/db';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CreateSalDto, UpdateSalDto } from './sal.dto';
import { SalService } from './sal.service';

@ApiTags('sal')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('commesse/:commessaId/sal')
export class SalController {
  constructor(private readonly salService: SalService) {}

  @Get()
  async getByCommessa(
    @Param('commessaId', new ParseUUIDPipe()) commessaId: string,
  ): Promise<Sal[]> {
    return this.salService.findByCommessa(commessaId);
  }

  @Get(':salId')
  async getOne(
    @Param('salId', new ParseUUIDPipe()) salId: string,
  ): Promise<Sal> {
    return this.salService.findOne(salId);
  }

  @Post()
  async create(
    @Param('commessaId', new ParseUUIDPipe()) commessaId: string,
    @Body() dto: CreateSalDto,
  ): Promise<Sal> {
    return this.salService.create(commessaId, dto);
  }

  @Patch(':salId')
  async update(
    @Param('salId', new ParseUUIDPipe()) salId: string,
    @Body() dto: UpdateSalDto,
  ): Promise<Sal> {
    return this.salService.update(salId, dto);
  }

  @Delete(':salId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('salId', new ParseUUIDPipe()) salId: string,
  ): Promise<void> {
    return this.salService.remove(salId);
  }
}
