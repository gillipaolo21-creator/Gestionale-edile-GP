import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ContrattoSubappalto, Subappaltatore } from '@strade-servizi/db';
import * as request from 'supertest';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';
import { SubappaltatoriController } from '../src/subappaltatori.controller';
import { SubappaltatoriService } from '../src/subappaltatori.service';

describe('SubappaltatoriController (e2e)', () => {
  let app: INestApplication;

  const findAll = jest.fn();
  const create = jest.fn();
  const update = jest.fn();
  const getContratti = jest.fn();
  const createContratto = jest.fn();
  const updateContratto = jest.fn();

  beforeEach(async () => {
    const moduleBuilder = Test.createTestingModule({
      controllers: [SubappaltatoriController],
      providers: [
        {
          provide: SubappaltatoriService,
          useValue: {
            findAll,
            create,
            update,
            getContratti,
            createContratto,
            updateContratto,
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

  it('GET /subappaltatori filtra per attivo e specializzazione', async () => {
    findAll.mockResolvedValue([{ id: 'sub-1', ragioneSociale: 'Impianti Rossi SRL' }]);

    await request(app.getHttpServer())
      .get('/subappaltatori?attivo=true&specializzazione=elettrico')
      .expect(200)
      .expect([{ id: 'sub-1', ragioneSociale: 'Impianti Rossi SRL' }]);

    expect(findAll).toHaveBeenCalledWith({ attivo: true, specializzazione: 'elettrico' });
  });

  it('POST /subappaltatori crea anagrafica subappaltatore', async () => {
    const now = new Date('2026-05-27T08:00:00.000Z');
    const sub: Subappaltatore = {
      id: 'sub-2',
      ragioneSociale: 'Scavi Bianchi SRL',
      piva: 'IT12345678901',
      codiceFiscale: null,
      referente: 'Mario Bianchi',
      telefono: '3400000000',
      email: 'info@scavibianchi.it',
      indirizzo: null,
      citta: 'Milano',
      specializzazione: 'Scavi',
      attivo: true,
      note: null,
      createdAt: now,
      updatedAt: now,
    };
    create.mockResolvedValue(sub);

    const payload = {
      ragioneSociale: 'Scavi Bianchi SRL',
      piva: 'IT12345678901',
      referente: 'Mario Bianchi',
      telefono: '3400000000',
      email: 'info@scavibianchi.it',
      citta: 'Milano',
      specializzazione: 'Scavi',
      attivo: true,
    };

    const response = await request(app.getHttpServer())
      .post('/subappaltatori')
      .send(payload)
      .expect(201);

    expect(create).toHaveBeenCalledWith(payload);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: 'sub-2',
        ragioneSociale: payload.ragioneSociale,
      }),
    );
  });

  it('GET /subappaltatori/:id/contratti restituisce i contratti', async () => {
    const subappaltatoreId = 'sub-2';
    getContratti.mockResolvedValue([{ id: 'ctr-1', descrizioneOpera: 'Impianti elettrici' }]);

    await request(app.getHttpServer())
      .get(`/subappaltatori/${subappaltatoreId}/contratti`)
      .expect(200)
      .expect([{ id: 'ctr-1', descrizioneOpera: 'Impianti elettrici' }]);

    expect(getContratti).toHaveBeenCalledWith(subappaltatoreId);
  });

  it('POST /subappaltatori/:id/contratti crea contratto', async () => {
    const subappaltatoreId = 'sub-2';
    const now = new Date('2026-05-27T08:00:00.000Z');
    const contratto: ContrattoSubappalto = {
      id: 'ctr-2',
      subappaltatoreId,
      commessaId: '11111111-1111-4111-8111-111111111111',
      descrizioneOpera: 'Posa cavidotti',
      importoAffidato: 18000,
      dataInizio: new Date('2026-06-01T00:00:00.000Z'),
      dataFinePrevista: new Date('2026-07-15T00:00:00.000Z'),
      note: 'Lavorazioni serali',
      createdAt: now,
      updatedAt: now,
    };
    createContratto.mockResolvedValue(contratto);

    const payload = {
      commessaId: '11111111-1111-4111-8111-111111111111',
      descrizioneOpera: 'Posa cavidotti',
      importoAffidato: 18000,
      dataInizio: '2026-06-01',
      dataFinePrevista: '2026-07-15',
      note: 'Lavorazioni serali',
    };

    const response = await request(app.getHttpServer())
      .post(`/subappaltatori/${subappaltatoreId}/contratti`)
      .send(payload)
      .expect(201);

    expect(createContratto).toHaveBeenCalledWith(subappaltatoreId, payload);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: 'ctr-2',
        subappaltatoreId,
        descrizioneOpera: payload.descrizioneOpera,
      }),
    );
  });

  it('PATCH /subappaltatori/contratti/:id aggiorna contratto', async () => {
    const contrattoId = 'ctr-2';
    updateContratto.mockResolvedValue({ id: contrattoId, importoAffidato: 19500 });

    const response = await request(app.getHttpServer())
      .patch(`/subappaltatori/contratti/${contrattoId}`)
      .send({ importoAffidato: 19500 })
      .expect(200);

    expect(response.body).toEqual(expect.objectContaining({ id: contrattoId, importoAffidato: 19500 }));

    expect(updateContratto).toHaveBeenCalledWith(contrattoId, { importoAffidato: 19500 });
  });
});
