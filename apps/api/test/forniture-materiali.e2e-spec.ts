import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FornituraMateriale, Prisma } from '@strade-servizi/db';
import * as request from 'supertest';
import { FornitureMaterialiController } from '../src/forniture-materiali/forniture-materiali.controller';
import { FornitureMaterialiService } from '../src/forniture-materiali/forniture-materiali.service';

describe('FornitureMaterialiController (e2e)', () => {
  let app: INestApplication;

  const listByCommessa = jest.fn();
  const create = jest.fn();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [FornitureMaterialiController],
      providers: [
        {
          provide: FornitureMaterialiService,
          useValue: {
            listByCommessa,
            create,
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

  it('GET /commesse/:commessaId/forniture-materiali restituisce lista', async () => {
    const commessaId = '11111111-1111-4111-8111-111111111111';
    listByCommessa.mockResolvedValue([
      { id: 'forn-1', fornitoreNome: 'Edilizia Cemento SpA', importoFornitura: '1200.00' },
    ]);

    await request(app.getHttpServer())
      .get(`/commesse/${commessaId}/forniture-materiali`)
      .expect(200)
      .expect([
        { id: 'forn-1', fornitoreNome: 'Edilizia Cemento SpA', importoFornitura: '1200.00' },
      ]);

    expect(listByCommessa).toHaveBeenCalledWith(commessaId);
  });

  it('POST /commesse/:commessaId/forniture-materiali crea fornitura', async () => {
    const commessaId = '11111111-1111-4111-8111-111111111111';
    const now = new Date('2026-04-09T12:00:00.000Z');
    const result: FornituraMateriale = {
      id: 'forn-2',
      commessaId,
      fornitoreNome: 'Forniture Legno SRL',
      importoFornitura: new Prisma.Decimal(2500),
      descrizione: 'Fornitura pannelli e travi',
      preventivoRiferimento: 'PREV-2026-01',
      dataPreventivo: new Date('2026-04-01T00:00:00.000Z'),
      createdAt: now,
      updatedAt: now,
    };

    create.mockResolvedValue(result);

    const response = await request(app.getHttpServer())
      .post(`/commesse/${commessaId}/forniture-materiali`)
      .send({
        fornitoreNome: 'Forniture Legno SRL',
        importoFornitura: 2500,
        descrizione: 'Fornitura pannelli e travi',
        preventivoRiferimento: 'PREV-2026-01',
        dataPreventivo: '2026-04-01',
      })
      .expect(201);

    expect(create).toHaveBeenCalledWith(commessaId, {
      fornitoreNome: 'Forniture Legno SRL',
      importoFornitura: 2500,
      descrizione: 'Fornitura pannelli e travi',
      preventivoRiferimento: 'PREV-2026-01',
      dataPreventivo: '2026-04-01',
    });
    expect(response.body).toEqual(
      expect.objectContaining({
        id: 'forn-2',
        commessaId,
        fornitoreNome: 'Forniture Legno SRL',
        preventivoRiferimento: 'PREV-2026-01',
      }),
    );
  });
});
