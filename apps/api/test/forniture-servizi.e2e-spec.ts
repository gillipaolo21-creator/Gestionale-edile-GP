import { FornituraServizio, Prisma } from '@bresciani/db';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { FornitureServiziController } from '../src/forniture-servizi/forniture-servizi.controller';
import { FornitureServiziService } from '../src/forniture-servizi/forniture-servizi.service';

describe('FornitureServiziController (e2e)', () => {
  let app: INestApplication;

  const listByCommessa = jest.fn();
  const create = jest.fn();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [FornitureServiziController],
      providers: [
        {
          provide: FornitureServiziService,
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

  it('GET /commesse/:commessaId/forniture-servizi restituisce lista', async () => {
    const commessaId = '11111111-1111-4111-8111-111111111111';
    listByCommessa.mockResolvedValue([
      { id: 'serv-1', fornitoreNome: 'Impianti Rossi SRL', importoFornitura: '3400.00' },
    ]);

    await request(app.getHttpServer())
      .get(`/commesse/${commessaId}/forniture-servizi`)
      .expect(200)
      .expect([
        { id: 'serv-1', fornitoreNome: 'Impianti Rossi SRL', importoFornitura: '3400.00' },
      ]);

    expect(listByCommessa).toHaveBeenCalledWith(commessaId);
  });

  it('POST /commesse/:commessaId/forniture-servizi crea fornitura', async () => {
    const commessaId = '11111111-1111-4111-8111-111111111111';
    const now = new Date('2026-04-09T12:00:00.000Z');
    const result: FornituraServizio = {
      id: 'serv-2',
      commessaId,
      fornitoreNome: 'Impianti Rossi SRL',
      importoFornitura: new Prisma.Decimal(3400),
      descrizione: 'Manodopera impianti elettrici',
      preventivoRiferimento: 'PREV-2026-SERV-01',
      dataPreventivo: new Date('2026-04-02T00:00:00.000Z'),
      createdAt: now,
      updatedAt: now,
    };

    create.mockResolvedValue(result);

    const response = await request(app.getHttpServer())
      .post(`/commesse/${commessaId}/forniture-servizi`)
      .send({
        fornitoreNome: 'Impianti Rossi SRL',
        importoFornitura: 3400,
        descrizione: 'Manodopera impianti elettrici',
        preventivoRiferimento: 'PREV-2026-SERV-01',
        dataPreventivo: '2026-04-02',
      })
      .expect(201);

    expect(create).toHaveBeenCalledWith(commessaId, {
      fornitoreNome: 'Impianti Rossi SRL',
      importoFornitura: 3400,
      descrizione: 'Manodopera impianti elettrici',
      preventivoRiferimento: 'PREV-2026-SERV-01',
      dataPreventivo: '2026-04-02',
    });
    expect(response.body).toEqual(
      expect.objectContaining({
        id: 'serv-2',
        commessaId,
        fornitoreNome: 'Impianti Rossi SRL',
        preventivoRiferimento: 'PREV-2026-SERV-01',
      }),
    );
  });
});
