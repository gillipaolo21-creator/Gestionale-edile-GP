import { TipoEntitaDocumento } from '@bresciani/db';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { DocumentiService } from './documenti.service';

jest.mock('fs/promises', () => ({
  mkdir: jest.fn(),
  writeFile: jest.fn(),
  readdir: jest.fn(),
  stat: jest.fn(),
}));

describe('DocumentiService', () => {
  const mkdirMock = fs.mkdir as jest.Mock;
  const writeFileMock = fs.writeFile as jest.Mock;

  let prisma: any;
  let service: DocumentiService;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Date, 'now').mockReturnValue(1712664000000);

    process.env.STORAGE_BASE_PATH = 'C:\\Storage\\Commesse';

    prisma = {
      commessa: {
        findUnique: jest.fn(),
      },
      documento: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
    };

    service = new DocumentiService(prisma);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('rifiuta upload COMMESSA senza categoria', async () => {
    prisma.commessa.findUnique.mockResolvedValue({
      id: 'commessa-1',
      responsabile: 'Mario Rossi',
      codiceIdentificativo: '2026-COMM-001',
      nomeCantiere: '2026-COMM-001 - Milano Centro',
    });

    const file = {
      originalname: 'contratto.pdf',
      buffer: Buffer.from('content'),
    } as Express.Multer.File;

    await expect(
      service.uploadAndSave(file, TipoEntitaDocumento.COMMESSA, 'commessa-1'),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(writeFileMock).not.toHaveBeenCalled();
    expect(prisma.documento.create).not.toHaveBeenCalled();
  });

  it('rifiuta upload COMMESSA se la commessa non esiste', async () => {
    prisma.commessa.findUnique.mockResolvedValue(null);

    const file = {
      originalname: 'contratto.pdf',
      buffer: Buffer.from('content'),
    } as Express.Multer.File;

    await expect(
      service.uploadAndSave(file, TipoEntitaDocumento.COMMESSA, 'missing-id', 'Contratti Cliente'),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(writeFileMock).not.toHaveBeenCalled();
    expect(prisma.documento.create).not.toHaveBeenCalled();
  });

  it('crea cartella PM/Commessa/Categoria e salva metadati categoria', async () => {
    prisma.commessa.findUnique.mockResolvedValue({
      id: 'commessa-1',
      responsabile: 'Donato Carlucci',
      codiceIdentificativo: '2026-COMM-001',
      indirizzo: 'Via Roma 1',
      citta: 'Milano',
    });

    prisma.documento.create.mockImplementation(async ({ data }: any) => ({
      id: 'doc-1',
      ...data,
      createdAt: new Date('2026-04-09T10:00:00.000Z'),
    }));

    const file = {
      originalname: 'contratto_cliente.pdf',
      buffer: Buffer.from('content'),
    } as Express.Multer.File;

    const result = await service.uploadAndSave(
      file,
      TipoEntitaDocumento.COMMESSA,
      'commessa-1',
      'Contratti Cliente',
    );

    const expectedFolder = path.join(
      'C:\\Storage\\Commesse',
      'DONATO CARLUCCI',
      '2026_001_Via Roma 1_Milano',
      'Contratti Cliente',
    );

    expect(mkdirMock).toHaveBeenCalledWith(expectedFolder, { recursive: true });
    expect(writeFileMock).toHaveBeenCalledTimes(1);
    expect(prisma.documento.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        entitaTipo: TipoEntitaDocumento.COMMESSA,
        entitaId: 'commessa-1',
        nomeFile: 'contratto_cliente.pdf',
        categoria: 'Contratti Cliente',
      }),
    });
    expect(result.storageUrl).toContain('Contratti Cliente');
  });

  it('su entita non COMMESSA salva in radice e categoria null', async () => {
    prisma.documento.create.mockImplementation(async ({ data }: any) => ({
      id: 'doc-2',
      ...data,
      createdAt: new Date('2026-04-09T10:00:00.000Z'),
    }));

    const file = {
      originalname: 'sal.pdf',
      buffer: Buffer.from('content'),
    } as Express.Multer.File;

    const result = await service.uploadAndSave(
      file,
      TipoEntitaDocumento.SAL,
      'sal-1',
      'Contratti Cliente',
    );

    expect(mkdirMock).not.toHaveBeenCalled();
    expect(writeFileMock).toHaveBeenCalledTimes(1);
    expect(prisma.documento.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        entitaTipo: TipoEntitaDocumento.SAL,
        entitaId: 'sal-1',
        categoria: null,
      }),
    });
    expect(result.storageUrl).toContain('C:/Storage/Commesse');
  });

  it('findByEntita restituisce i documenti ordinati per data decrescente', async () => {
    prisma.documento.findMany.mockResolvedValue([{ id: 'doc-1' }]);

    const result = await service.findByEntita(TipoEntitaDocumento.COMMESSA, 'commessa-1');

    expect(prisma.documento.findMany).toHaveBeenCalledWith({
      where: {
        entitaTipo: TipoEntitaDocumento.COMMESSA,
        entitaId: 'commessa-1',
      },
      orderBy: { createdAt: 'desc' },
    });
    expect(result).toEqual([{ id: 'doc-1' }]);
  });
});
