import { JobImportazione } from '@bresciani/db';
import { Controller, Get, NotFoundException, Param, ParseUUIDPipe, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JobsService } from './jobs.service';

@ApiTags('jobs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  async findRecent(@Query('limit') limit?: string): Promise<JobImportazione[]> {
    const take = limit ? Math.min(Number.parseInt(limit, 10), 100) : 20;
    return this.jobsService.findRecent(take);
  }

  @Get(':jobId')
  async findOne(@Param('jobId', new ParseUUIDPipe()) jobId: string): Promise<JobImportazione> {
    const job = await this.jobsService.findOne(jobId);
    if (!job) throw new NotFoundException(`Job ${jobId} non trovato`);
    return job;
  }
}
