import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Materiale } from '@strade-servizi/db';
import * as request from 'supertest';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';
import { MaterialiController } from '../src/materiali.controller';
import { MaterialiService } from '../src/materiali.service';

describe('MaterialiController (e2e)', () => {
  let app: INestApplication;

  const findAll = jest.fn();
  const create = jest.fn();
  const update = jest.fn();
  const remove = jest.fn();
  const getTotalePerCommessa = jest.fn();

  beforeEach(async () => {
    const moduleBuilder = Test.createTestingModule({
      controllers: [MaterialiController],
      providers: [
        {
          provide: MaterialiService,
          useValue: {
            findAll,
            create,
            update,
            remove,
            getTotalePerCommessa,
          },
        },
      ],
    });

    moduleBuilder.overrideGuard(JwtAuthGuard).useValue({ canActivate: () => true });
    const moduleFixture: TestingModule = await moduleBuilder.compile();

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

  it('GET /materiali?commessaId=... restituisce lista materiali', async () => {
    const commessaId = '11111111-1111-4111-8111-111111111111';
    findAll.mockResolvedValue([
      { id: 'mat-1', fornitoreNome: 'Calcestruzzi Nord', descrizione: 'CLS C25/30' },
    ]);

    await request(app.getHttpServer())
      .get(`/materiali?commessaId=${commessaId}`)
      .expect(200)
      .expect([
        { id: 'mat-1', fornitoreNome: 'Calcestruzzi Nord', descrizione: 'CLS C25/30' },
      ]);

    expect(findAll).toHaveBeenCalledWith(commessaId);
  });

  it('POST /materiali crea un materiale', async () => {
    const now = new Date('2026-05-27T08:00:00.000Z');
    const materiale: Materiale = {
      id: 'mat-2',
      commessaId: '11111111-1111-4111-8111-111111111111',
      fornitoreNome: 'Edilmix SRL',
      descrizione: 'Sabbia vagliata',
      unitaMisura: 'mc',
      quantita: 10,
      prezzoUnitario: 42.5,
      dataConsegna: new Date('2026-05-20T00:00:00.000Z'),
      ddt: 'DDT-2026-100',
      note: 'Consegna in due tranche',
      createdAt: now,
      updatedAt: now,
    };
    create.mockResolvedValue(materiale);

    const payload = {
      commessaId: '11111111-1111-4111-8111-111111111111',
      fornitoreNome: 'Edilmix SRL',
      descrizione: 'Sabbia vagliata',
      unitaMisura: 'mc',
      quantita: 10,
      prezzoUnitario: 42.5,
      dataConsegna: '2026-05-20',
      ddt: 'DDT-2026-100',
      note: 'Consegna in due tranche',
    };

    const response = await request(app.getHttpServer())
      .post('/materiali')
      .send(payload)
      .expect(201);

    expect(create).toHaveBeenCalledWith(payload);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: 'mat-2',
        commessaId: payload.commessaId,
        fornitoreNome: payload.fornitoreNome,
      }),
    );
  });

  it('GET /materiali/totale/:commessaId restituisce totale costo', async () => {
    const commessaId = '11111111-1111-4111-8111-111111111111';
    getTotalePerCommessa.mockResolvedValue({ commessaId, totaleCosto: 425 });

    await request(app.getHttpServer())
      .get(`/materiali/totale/${commessaId}`)
      .expect(200)
      .expect({ commessaId, totaleCosto: 425 });

    expect(getTotalePerCommessa).toHaveBeenCalledWith(commessaId);
  });

  it('PATCH /materiali/:id aggiorna materiale', async () => {
    const id = 'mat-2';
    update.mockResolvedValue({ id, descrizione: 'Sabbia fine lavata' });

    const response = await request(app.getHttpServer())
      .patch(`/materiali/${id}`)
      .send({ descrizione: 'Sabbia fine lavata' })
      .expect(200);

    expect(response.body).toEqual(expect.objectContaining({ id, descrizione: 'Sabbia fine lavata' }));

    expect(update).toHaveBeenCalledWith(id, { descrizione: 'Sabbia fine lavata' });
  });

  it('DELETE /materiali/:id elimina materiale', async () => {
    const id = 'mat-2';
    remove.mockResolvedValue(undefined);

    await request(app.getHttpServer())
      .delete(`/materiali/${id}`)
      .expect(204);

    expect(remove).toHaveBeenCalledWith(id);
  });
});
