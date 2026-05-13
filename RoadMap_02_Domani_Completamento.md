# RoadMap_02 — Piano Operativo Domani + Completamento Gestionale

Aggiornato al: 13/05/2026

## Obiettivo

Portare il gestionale da stato "uso pilota" a stato "pronto per uso operativo quotidiano", con priorita su stabilita, test, configurazione e UX mobile.

## Stato di partenza (oggi)

- Frontend avviabile e raggiungibile su `http://localhost:3000`.
- API avviabile e Swagger disponibile su `http://localhost:3001/api/docs`.
- Build API e Web ok.
- Gap principali aperti: test backend, validazione env, responsivita, completamento documentazione DTO Swagger, alcuni task P2/P3.

## Contesto di mercato e focus business

La societa opera in un mercato dove il PM deve controllare contemporaneamente tempi, costo, sicurezza e documentazione. Dalla ricerca svolta emergono questi driver principali:

- Commesse infrastrutturali e stradali con forte esposizione a varianti, interferenze e ritardi di cantiere.
- Immobili logistici e industriali dove conta la tenuta del cronoprogramma e il coordinamento con subappaltatori e fornitori.
- Pressione sui margini per costo materiali, lavorazioni e noleggi.
- Necessita di tracciabilita documentale, audit e gestione SAL/fatture molto accurata.
- Maggiore valore competitivo per chi ha controllo digitale di avanzamento, costi e reportistica.

## Cosa deve gestire un PM di commessa nel vostro ambito

### 1) Pianificazione

- WBS della commessa per fasi: movimento terra, urbanizzazioni, opere civili, pavimentazioni, finiture.
- Cronoprogramma con milestone contrattuali e dipendenze tra attivita.
- Baseline di budget e tempi, con forecast continuo.

### 2) Economica e contabile

- Budget iniziale, costi a consuntivo e margine previsto a finire.
- SAL emessi/ricevuti, fatture attive/passive, residuo da fatturare.
- Varianti approvate e non approvate con impatto economico.

### 3) Produzione di cantiere

- Avanzamento fisico settimanale e blocchi operativi.
- Mezzi, squadre, subappalti e disponibilita materiali.
- Gestione imprevisti: meteo, interferenze, ritardi fornitori, rilavorazioni.

### 4) Qualita, sicurezza e compliance

- Documenti obbligatori, verbali, certificazioni e scadenze.
- Non conformita, azioni correttive e audit trail.
- Evidenze sicurezza e ambiente con responsabilita chiare.

### 5) Comunicazione e reporting

- Stato commessa sintetico per direzione e cliente.
- Registro decisioni, rischi aperti e azioni da chiudere.
- Dashboard KPI per avanzamento, margine e criticita.

## Matrice prodotto -> bisogno operativo

| Bisogno PM          | Funzione gestionale da avere                    | Priorita |
| ------------------- | ----------------------------------------------- | -------- |
| Controllo tempi     | Cronoprogramma, milestone, alert ritardi        | P0/P1    |
| Controllo costi     | Budget, consuntivo, forecast, margine           | P0/P1    |
| Controllo SAL       | SAL, fatture, residui, scadenze incasso         | P1       |
| Controllo fornitori | Ordini, consegne, allegati, extra-costi         | P1       |
| Controllo documenti | Workflow, scadenze, versioni, audit             | P0/P1    |
| Controllo cantiere  | Avanzamento fisico, note giornaliere, criticita | P1       |
| Controllo rischio   | Non conformita, varianti, blocchi, approvazioni | P1/P2    |
| Controllo direzione | Dashboard KPI e report commessa                 | P1/P2    |

## Piano Domani (time-boxed)

## 1) Blocco mattina — Stabilita e qualita (P0 operativo)

### 09:00 - 10:30 | Test backend rossi

- [ ] Correggere i test falliti in `apps/api/src/documenti.service.spec.ts`.
- [ ] Allineare mock path/exception ai comportamenti reali del servizio.
- [ ] Eseguire `pnpm --filter api test -- --runInBand` fino a verde.

Criterio di uscita:

- Tutti i test in `apps/api` passano.

### 10:30 - 11:30 | Hardening configurazione ambiente

- [ ] Introdurre validazione env all'avvio API (`@nestjs/config` + schema Joi o class-validator).
- [ ] Rendere obbligatorie variabili minime: `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`, `STORAGE_BASE_PATH`.
- [ ] Aggiungere messaggi di errore chiari in bootstrap se manca configurazione.

Criterio di uscita:

- L'app non parte con env invalide e mostra errori espliciti.

### 11:30 - 12:30 | Prisma migration e allineamento DB

- [ ] Verificare index mancanti dichiarati in roadmap.
- [ ] Generare/applicare migration Prisma finale per index/config aperti.
- [ ] Eseguire `prisma migrate deploy` su ambiente locale pulito.

Criterio di uscita:

- Migrazioni applicabili senza errori su DB vuoto e su DB gia esistente.

## 2) Blocco pomeriggio — UX e completamento funzionale core (P1/P2)

### 14:00 - 15:30 | Responsive reale per uso in cantiere

- [ ] Sidebar collassabile sotto 768px.
- [ ] Lista commesse in card su mobile.
- [ ] Modali con scroll verticale e azioni accessibili.
- [ ] Verifica viewport 375px e 768px.

Criterio di uscita:

- Flussi principali usabili da smartphone senza overlap o blocchi UI.

### 15:30 - 16:30 | Filtri documenti e varianti file

- [ ] Completare filtri documenti per categoria/data (backend + UI).
- [ ] Implementare sostituzione file variante in `useDocumenti.ts`.
- [ ] Salvare backup del file precedente con suffisso timestamp.
- [ ] Aggiornare hash SHA256 dopo sostituzione.

Criterio di uscita:

- Modifica variante tracciata correttamente con file nuovo + backup.

### 16:30 - 17:30 | Swagger e rifinitura API

- [ ] Aggiungere `@ApiProperty` ai DTO mancanti.
- [ ] Verificare documentazione endpoint critici: auth, commesse, documenti, forniture, SAL, fatture.

Criterio di uscita:

- Swagger completo per test manuali e onboarding rapido.

## 3) Blocco fine giornata — Go/No-Go check

### 17:30 - 18:30 | Collaudo end-to-end guidato

- [ ] Login/registrazione utente.
- [ ] Creazione commessa.
- [ ] Upload e gestione documenti (inclusa approvazione/rifiuto).
- [ ] Inserimento fornitura con allegato.
- [ ] Creazione SAL e fattura collegata.
- [ ] Verifica audit log su operazioni principali.

Criterio di uscita:

- Flusso completo business eseguito senza errori bloccanti.

## Piano di completamento (dopo domani, 3 fasi)

## Fase A — Pronto produzione minima (1-2 giorni)

- [ ] Logging JSON in produzione + livelli log per ambiente.
- [ ] Script avvio produzione (`docker-compose up -d`) e smoke test.
- [ ] Script backup storage e dump DB.
- [ ] Check sicurezza finale (CORS, upload, auth guard, secret policy).

Deliverable:

- Rilascio candidate `v1.0.0-rc1`.

## Fase B — Qualita continua (2-4 giorni)

- [ ] Unit test aggiuntivi: CommesseService, DocumentiService, FornitureService.
- [ ] Integration test flusso "crea commessa -> upload documento".
- [ ] Test frontend hook critici (`useCommesse`, `useAppaltoVoci`).
- [ ] Portare coverage backend al 70%+.

Deliverable:

- Gate CI con test obbligatori e soglia coverage.

## Fase C — Feature avanzate pianificate (post go-live)

- [ ] Export PDF commessa e report finanziario.
- [ ] Notifiche real-time job/documenti.
- [ ] Admin panel utenti (ruoli/reset password).
- [ ] Email automatiche di workflow.

Deliverable:

- Backlog v1.1 con milestone e priorita business.

## Definizione "Gestionale Completato"

Il gestionale si considera completato quando tutte le condizioni seguenti sono vere:

- [ ] Build API/Web verdi.
- [ ] Test backend/frontend verdi con coverage target raggiunto.
- [ ] Flussi core (commesse, documenti, forniture, SAL, fatture, audit) collaudati E2E.
- [ ] Configurazione ambiente validata e documentata.
- [ ] Deploy Docker ripetibile e monitorabile.
- [ ] Nessun bug bloccante aperto in backlog P0/P1.

## Comandi rapidi domani

```bash
pnpm install --frozen-lockfile
pnpm --filter api test -- --runInBand
pnpm --filter api build
pnpm --filter web build
pnpm --filter api start:dev
pnpm --filter web dev
```

## Nota operativa

Aggiornare al termine di ogni blocco questa roadmap e la checklist in `RoadMap_01.md` per mantenere allineati stato reale e pianificazione.
