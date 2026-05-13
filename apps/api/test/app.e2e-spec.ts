import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Documento, TipoEntitaDocumento } from '@strade-servizi/db';
import { Readable } from 'stream';
import * as request from 'supertest';
import { DocumentiController } from '../src/documenti/documenti.controller';
import { DocumentiService } from '../src/documenti/documenti.service';

describe('DocumentiController (e2e)', () => {
  let app: INestApplication;

  const uploadAndSave = jest.fn();
  const findByEntita = jest.fn();
  const getFileStream = jest.fn();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [DocumentiController],
      providers: [
        {
          provide: DocumentiService,
          useValue: {
            uploadAndSave,
            findByEntita,
            getFileStream,
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  it('POST /documenti/upload rifiuta richieste senza file', async () => {
    const commessaId = '11111111-1111-4111-8111-111111111111';

    await request(app.getHttpServer())
      .post('/documenti/upload')
      .field('entitaTipo', 'COMMESSA')
      .field('entitaId', commessaId)
      .field('categoria', 'Contratti Cliente')
      .expect(400);

    expect(uploadAndSave).not.toHaveBeenCalled();
  });

  it('POST /documenti/upload accetta payload valido e inoltra categoria', async () => {
    const commessaId = '11111111-1111-4111-8111-111111111111';
    const now = new Date('2026-04-09T12:00:00.000Z');
    const documento: Documento = {
      id: '22222222-2222-4222-8222-222222222222',
      entitaTipo: TipoEntitaDocumento.COMMESSA,
      entitaId: commessaId,
      nomeFile: 'contratto.pdf',
      storageUrl: 'file:///C:/Storage/Commesse/contratto.pdf',
      hashFile: 'abc123',
      categoria: 'Contratti Cliente',
      statoOcr: 'NON_RICHIESTO',
      datiEstrattiJson: null,
      createdAt: now,
    };

    uploadAndSave.mockResolvedValue(documento);

    const response = await request(app.getHttpServer())
      .post('/documenti/upload')
      .field('entitaTipo', 'COMMESSA')
      .field('entitaId', commessaId)
      .field('categoria', 'Contratti Cliente')
      .attach('file', Buffer.from('pdf-content'), 'contratto.pdf')
      .expect(201);

    expect(uploadAndSave).toHaveBeenCalledTimes(1);
    expect(uploadAndSave).toHaveBeenCalledWith(
      expect.objectContaining({ originalname: 'contratto.pdf' }),
      TipoEntitaDocumento.COMMESSA,
      commessaId,
      'Contratti Cliente',
      undefined,
    );
    expect(response.body).toEqual(
      expect.objectContaining({
        id: documento.id,
        entitaTipo: 'COMMESSA',
        categoria: 'Contratti Cliente',
      }),
    );
  });

  it('POST /documenti/upload rifiuta offerte servizi senza fornitore', async () => {
    const commessaId = '11111111-1111-4111-8111-111111111111';
    uploadAndSave.mockRejectedValue(new BadRequestException('Nome fornitore obbligatorio per le offerte materiali o servizi.'));

    await request(app.getHttpServer())
      .post('/documenti/upload')
      .field('entitaTipo', 'COMMESSA')
      .field('entitaId', commessaId)
      .field('categoria', 'Offerte forniture di servizi')
      .attach('file', Buffer.from('pdf-content'), 'servizio.pdf')
      .expect(400);
  });

  it('POST /documenti/upload accetta offerte servizi con fornitore', async () => {
    const commessaId = '11111111-1111-4111-8111-111111111111';
    const now = new Date('2026-04-09T12:00:00.000Z');
    const documento: Documento = {
      id: '44444444-4444-4444-8444-444444444444',
      entitaTipo: TipoEntitaDocumento.COMMESSA,
      entitaId: commessaId,
      nomeFile: 'servizio.pdf',
      storageUrl: 'file:///C:/Storage/Commesse/servizio.pdf',
      hashFile: 'def456',
      categoria: 'Offerte forniture di servizi',
      statoOcr: 'NON_RICHIESTO',
      datiEstrattiJson: null,
      createdAt: now,
    };

    uploadAndSave.mockResolvedValue(documento);

    await request(app.getHttpServer())
      .post('/documenti/upload')
      .field('entitaTipo', 'COMMESSA')
      .field('entitaId', commessaId)
      .field('categoria', 'Offerte forniture di servizi')
      .field('sottocategoria', 'Impianti Rossi SRL')
      .attach('file', Buffer.from('pdf-content'), 'servizio.pdf')
      .expect(201);

    expect(uploadAndSave).toHaveBeenCalledWith(
      expect.objectContaining({ originalname: 'servizio.pdf' }),
      TipoEntitaDocumento.COMMESSA,
      commessaId,
      'Offerte forniture di servizi',
      'Impianti Rossi SRL',
    );
  });

  it('GET /documenti/:entitaTipo/:entitaId restituisce lista documenti', async () => {
    const commessaId = '11111111-1111-4111-8111-111111111111';
    findByEntita.mockResolvedValue([{ id: 'doc-1', categoria: 'Contratti Cliente' }]);

    await request(app.getHttpServer())
      .get(`/documenti/COMMESSA/${commessaId}`)
      .expect(200)
      .expect([{ id: 'doc-1', categoria: 'Contratti Cliente' }]);

    expect(findByEntita).toHaveBeenCalledWith(TipoEntitaDocumento.COMMESSA, commessaId);
  });

  it('GET /documenti/:documentoId/download restituisce stream file', async () => {
    const documentoId = '33333333-3333-4333-8333-333333333333';
    getFileStream.mockResolvedValue({
      stream: Readable.from(['binary-payload']),
      filename: 'contratto.pdf',
      mimeType: 'application/pdf',
    });

    const response = await request(app.getHttpServer())
      .get(`/documenti/${documentoId}/download`)
      .expect(200);

    expect(getFileStream).toHaveBeenCalledWith(documentoId);
    expect(response.headers['content-type']).toContain('application/pdf');
  });
});
