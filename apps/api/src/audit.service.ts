// Deprecated - replaced by new module structure
export { }; /*

export interface AuditLogEntry {
  userId?: string;
  userEmail?: string;
  azione: string;
  entita: string;
  entitaId: string;
  dataPrecedente?: Record<string, unknown>;
  dataNuova?: Record<string, unknown>;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private prisma: PrismaService) {}

  async log(entry: AuditLogEntry): Promise<void> {
    try {
      await (this.prisma as any).auditLog.create({
        data: {
          userId: entry.userId ?? null,
          userEmail: entry.userEmail ?? null,
          azione: entry.azione,
          entita: entry.entita,
          entitaId: entry.entitaId,
          dataPrecedente: entry.dataPrecedente ?? undefined,
          dataNuova: entry.dataNuova ?? undefined,
        },
      });
    } catch (err) {
      this.logger.error('Impossibile scrivere audit log', err);
    }
  }

  async findAll(
    filters?: { commessaId?: string; userId?: string },
    page = 1,
    limit = 50,
  ) {
    const where: Record<string, unknown> = {};
    if (filters?.commessaId) where.entitaId = filters.commessaId;
    if (filters?.userId) where.userId = filters.userId;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      (this.prisma as any).auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      (this.prisma as any).auditLog.count({ where }),
    ]);
    return { data, total, page, totalPages: Math.ceil(total / limit) };
  }
}
*/

