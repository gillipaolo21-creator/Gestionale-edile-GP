import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

/** Stub controller per il polling dei job dal frontend.
 *  Il sistema BullMQ è stato rimosso — endpoint restituisce dati placeholder
 *  per evitare errori 404 sull'hook useJobPolling.
 */
@ApiTags('jobs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('jobs')
export class JobsController {
  @Get()
  findAll(@Query('limit') _limit?: string) {
    return [];
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return {
      id,
      stato: 'COMPLETATO',
      righeProcessate: 0,
      righeErrore: 0,
      righeSuccesso: 0,
      messaggioErrore: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}
