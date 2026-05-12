import { JobImportazione } from '@bresciani/db';
import { JobsService } from './jobs.service';
export declare class JobsController {
    private readonly jobsService;
    constructor(jobsService: JobsService);
    findRecent(limit?: string): Promise<JobImportazione[]>;
    findOne(jobId: string): Promise<JobImportazione>;
}
