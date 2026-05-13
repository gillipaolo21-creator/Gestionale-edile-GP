# 🗺️ RoadMap_01 — Gestionale Edile GP (Strade e Servizi)

> Documento di riferimento per lo sviluppo e il completamento del sistema.
> Aggiornato al: 11/05/2026 — **Sprint 1 completato, Sprint 2 in corso**

---

## 📌 Legenda Priorità

| Simbolo | Priorità | Descrizione                      |
| ------- | -------- | -------------------------------- |
| 🔴 P0   | CRITICA  | Blocca la messa in produzione    |
| 🟠 P1   | ALTA     | Funzionalità core mancante       |
| 🟡 P2   | MEDIA    | Migliora UX e qualità del codice |
| 🔵 P3   | BASSA    | Enhancement futuri               |

---

## 🔴 P0 — CRITICI (Da fare prima di qualsiasi deploy)

### P0.1 — Autenticazione & Autorizzazione

- [x] Aggiungere modello `User` al schema Prisma (id, email, password hash, ruolo)
- [x] Installare e configurare `@nestjs/jwt` e `@nestjs/passport`
- [x] Creare `AuthModule` con endpoint `POST /auth/login` e `POST /auth/register`
- [x] Implementare `JwtStrategy` e `JwtAuthGuard`
- [x] Applicare `JwtAuthGuard` su tutti i controller
- [x] Aggiungere sistema di ruoli: `ADMIN`, `PM`, `VIEWER`
- [x] Collegare utente loggato al campo `responsabile` delle commesse
- [x] Frontend: pagina di login, gestione token JWT in localStorage/cookie

### P0.2 — Fix Bug Routing (endpoint irraggiungibile)

- [x] In `commesse.controller.ts` riordinare le route statiche PRIMA di quelle parametriche
  ```
  Ordine corretto:
  GET /commesse/next-code          ← statico
  GET /commesse/:id/delete-info    ← parametrico specifico
  GET /commesse/:id/appalto-voci   ← parametrico specifico
  GET /commesse/:id                ← generico
  ```
- [x] Testare che `GET /commesse/:id/delete-info` risponda correttamente dopo il fix

### P0.3 — Sicurezza Upload File

- [x] Aggiungere limite dimensione file (es. 50MB max) in Multer
- [x] Creare whitelist MIME type: `.pdf`, `.docx`, `.xlsx`, `.jpg`, `.png`, `.dwg`
- [x] Sanitizzare il nome del file prima del salvataggio (rimuovere caratteri speciali)
- [x] Proteggere da path traversal: validare `sottocategoriaFolder` e `categoriaFolder`

### P0.4 — Restrizione CORS

- [x] In `main.ts` sostituire `app.enableCors()` con:
  ```typescript
  app.enableCors({ origin: process.env.FRONTEND_URL, credentials: true });
  ```
- [x] Aggiungere `FRONTEND_URL` alle variabili d'ambiente

### P0.5 — Implementare Excel Import (Jobs Processor)

- [x] Rimuovere il placeholder `setTimeout(3000)` in `jobs.processor.ts`
- [x] Implementare parsing Excel con la libreria `xlsx` già installata
- [x] Mappare le colonne Excel ai modelli DB (Commesse, Appalto Voci, etc.)
- [x] Gestire errori riga per riga con report di importazione parziale
- [x] Salvare log degli errori nel modello `JobImportazione`
- [x] Aggiornare stato job: `IN_CODA` → `IN_ELABORAZIONE` → `COMPLETATO` / `ERRORE`

---

## 🟠 P1 — ALTA PRIORITÀ (Funzionalità core mancanti)

### P1.1 — Endpoint Fattura

- [x] Creare `FattureModule` in NestJS
- [x] `POST /commesse/:id/fatture` — Crea fattura
- [x] `GET /commesse/:id/fatture` — Lista fatture per commessa
- [x] `PATCH /fatture/:id` — Aggiorna stato pagamento
- [x] `DELETE /fatture/:id` — Elimina fattura
- [x] DTO: `CreateFatturaDto` (numero, data, importo, tipo, stato)
- [x] Frontend: Tab "Contabilità" o sezione nell'attuale TabSintesi

### P1.2 — Endpoint SAL (Stato Avanzamento Lavori)

- [x] Creare `SalModule` in NestJS
- [x] `POST /commesse/:id/sal` — Crea nuovo SAL
- [x] `GET /commesse/:id/sal` — Lista SAL per commessa
- [x] `PATCH /sal/:id` — Aggiorna SAL
- [x] Collegare SAL alle Fatture (relazione già in schema)
- [x] Frontend: visualizzazione timeline SAL

### P1.3 — Fix Upload File in FornitoreDocModal

- [x] In `useForniture.ts` includere il file nel payload `FormData` della richiesta POST
- [x] In `forniture-materiali.service.ts` e `forniture-servizi.service.ts` gestire il file ricevuto
- [x] Salvare il file nella cartella corretta della commessa
- [x] Aggiornare il record DB con il riferimento al documento

### P1.4 — Dashboard Stats (Dati Reali)

- [x] Sostituire `costiCommesse: 0` con somma reale degli importi da DB
- [x] Calcolare `avanzamento` medio come media pesata delle commesse attive
- [x] Aggiungere endpoint `GET /commesse/stats` nel backend
- [x] Mostrare numero commesse per stato (In preventivo, In corso, Chiuse)

### P1.5 — Paginazione Liste

- [x] Backend: aggiungere parametri `?page=1&limit=20` a tutti gli endpoint findAll
- [x] Restituire oggetto: `{ data: [...], total: N, page: X, totalPages: Y }`
- [x] Frontend: aggiungere componente paginazione nella lista commesse

### P1.6 — Endpoint Polling Job Status

- [x] `GET /jobs/:jobId` — Restituisce stato e progresso job
- [x] `GET /jobs` — Lista jobs recenti dell'utente
- [x] Frontend: polling ogni 3s durante import attivo, mostrare barra progresso

### P1.7 — Audit Trail (Chi ha fatto cosa)

- [x] Creare modello `AuditLog` in schema Prisma (userId, azione, entità, entityId, timestamp, dataPrecedente)
- [x] Creare `AuditService` riusabile
- [x] Loggare: creazione/modifica/eliminazione Commesse, Documenti, Forniture
- [x] Endpoint `GET /audit?commessaId=X` per vedere lo storico

---

## 🟡 P2 — MEDIA PRIORITÀ (Qualità & UX)

### P2.1 — Global Error Handler

- [x] Creare `AllExceptionsFilter` in NestJS
- [x] Intercettare errori 500 e restituire risposta standardizzata (senza leak interni)
- [x] Loggare tutti gli errori con stack trace in file/servizio esterno
- [x] Frontend: gestione globale errori API con toast/notifica utente

### P2.2 — Documentazione API (Swagger)

- [x] Installare `@nestjs/swagger`
- [x] Aggiungere decoratori `@ApiTags`, `@ApiOperation`, `@ApiResponse` su tutti i controller
- [x] Esporre `/api/docs` in ambiente sviluppo
- [ ] Documentare tutti i DTO con `@ApiProperty`

### P2.3 — Ricerca & Filtri Avanzati

- [x] Backend: filtri su `GET /commesse` (stato, responsabile, anno, città)
- [x] Backend: ricerca full-text su nome commessa e cliente
- [ ] Backend: filtri documenti per categoria e data
- [x] Frontend: barra di ricerca nella lista commesse
- [x] Frontend: filtri dropdown (stato, PM, anno)

### P2.4 — Design Responsivo (Mobile/Tablet)

- [ ] Sidebar collassabile su schermi < 768px
- [ ] Lista commesse: cards invece di tabella su mobile
- [ ] Modali: scroll verticale su schermi piccoli
- [ ] Testare su viewport 768px (tablet) e 375px (mobile)

### P2.5 — Gestione Pending Documents (UI Interattiva)

- [x] Aggiungere pulsanti "Approva" / "Rifiuta" / "Assegna" ai documenti in attesa
- [x] Endpoint `PATCH /documenti/:id/stato` per aggiornare lo stato workflow
- [x] Notifica visiva (badge) sul menu quando ci sono documenti in attesa

### P2.6 — Preview Documenti (Formati Aggiuntivi)

- [x] Aggiungere preview per file `.txt` (render testo)
- [x] Aggiungere preview immagini ottimizzata (lazy load, zoom)
- [x] Mostrare messaggio "Anteprima non disponibile" per `.dwg`, `.zip`, etc.

### P2.7 — Variante: Sostituzione File

- [ ] In `useDocumenti.ts` aggiungere logica per sostituire il file quando si modifica una variante
- [ ] Mantenere il file precedente come backup con suffisso timestamp
- [ ] Aggiornare hash SHA256 nel DB dopo sostituzione

### P2.8 — Environment Variables & Config

- [x] Creare file `.env.example` con tutte le variabili necessarie documentate
- [ ] Validare le env vars all'avvio con `@nestjs/config` e Joi/class-validator
- [ ] Separare configurazioni dev/staging/production

### P2.9 — Performance: Database Indexes

- [x] Aggiungere index su `Documento.categoria`
- [x] Aggiungere index su `Commessa.stato`
- [x] Aggiungere index su `Commessa.responsabile`
- [x] Aggiungere index su `Documento.createdAt`
- [ ] Generare e applicare migration Prisma

### P2.10 — Logging Strutturato

- [x] Sostituire `console.log` con NestJS `Logger` ovunque
- [ ] Aggiungere formato JSON per i log (produzione)
- [ ] Configurare livelli di log per ambiente (debug in dev, warn in prod)

---

## 🔵 P3 — BASSA PRIORITÀ (Enhancement Futuri)

### P3.1 — Notifiche Real-Time (WebSocket)

- [ ] Installare `@nestjs/websockets` e `socket.io`
- [ ] Gateway WebSocket per notifiche job completati
- [ ] Notifica upload documento agli altri utenti della stessa commessa
- [ ] Frontend: toast notification su eventi real-time

### P3.2 — Export Funzionalità

- [ ] Export PDF commessa (riepilogo + appalto voci)
- [x] Export Excel dell'appalto voci
- [x] Export ZIP archivio documentale di una commessa
- [ ] Report finanziario in PDF

### P3.3 — OCR Documenti

- [ ] Scegliere servizio OCR: Tesseract.js (locale) o AWS Textract (cloud)
- [ ] Integrare nel workflow di upload documento
- [ ] Estrarre automaticamente: importo, data, numero fattura dai PDF
- [ ] Popolare `datiEstrattiJson` con i dati OCR
- [ ] UI: mostrare dati estratti con possibilità di correzione

### P3.4 — Report & Analytics

- [ ] Dashboard con grafici (Chart.js o Recharts)
- [ ] Cash flow mensile per commessa
- [ ] Budget vs consuntivo con varianza
- [ ] Classifica fornitori per volume d'acquisto
- [ ] Stato avanzamento tutti i progetti (Gantt semplificato)

### P3.5 — Gestione Utenti (Admin Panel)

- [ ] Pagina admin per creare/modificare/disattivare utenti
- [ ] Assegnazione ruoli (Admin, PM, Contabile, Viewer)
- [ ] Reset password via email
- [ ] Log accessi utente

### P3.6 — Containerizzazione Completa

- [x] Creare `Dockerfile` per `apps/api`
- [x] Creare `Dockerfile` per `apps/web`
- [x] Aggiornare `docker-compose.yml` per includere tutti e 3 i servizi
- [ ] Script di avvio produzione: `docker-compose up -d`

### P3.7 — Test Coverage

- [ ] Unit test `CommesseService` (CRUD, calcoli importo)
- [ ] Unit test `DocumentiService` (upload, delete, preview)
- [ ] Unit test `FornitureService`
- [ ] Integration test: flusso completo creazione commessa + upload documento
- [ ] Frontend: test hook `useCommesse`, `useAppaltoVoci`
- [ ] Target coverage: 70%+

### P3.8 — Multi-Tenancy (Futuro)

- [ ] Aggiungere modello `Azienda` / `Tenant`
- [ ] Isolare i dati per tenant (row-level security)
- [ ] Subdomain routing per tenant diversi

### P3.9 — App Mobile (Futuro)

- [ ] Valutare React Native o Progressive Web App
- [ ] Feature minima: visualizza commesse, upload foto cantiere, aggiorna stato

### P3.10 — Integrazione Email

- [ ] Installare `nodemailer` o servizio (SendGrid, Resend)
- [ ] Email notifica nuova commessa assegnata al PM
- [ ] Email notifica documento in attesa di approvazione
- [ ] Email riepilogo settimanale stato lavori

---

## 🐛 Bug da Correggere

| ID     | File                     | Problema                                        | Fix                                        |
| ------ | ------------------------ | ----------------------------------------------- | ------------------------------------------ |
| BUG-01 | `commesse.controller.ts` | Route `:id/delete-info` non raggiungibile       | Riordinare route (vedi P0.2)               |
| BUG-02 | `documenti.service.ts`   | Path Windows-only `C:\Users\...` hardcoded      | Usare `STORAGE_BASE_PATH` env var sempre   |
| BUG-03 | `useForniture.ts`        | File catturato ma non inviato al backend        | Aggiungere file a `FormData` (vedi P1.3)   |
| BUG-04 | `page.tsx`               | Stats `costiCommesse` e `avanzamento` hardcoded | Calcolo reale (vedi P1.4)                  |
| BUG-05 | `jobs.processor.ts`      | Import Excel è un `setTimeout` placeholder      | Implementare parsing reale (vedi P0.5)     |
| BUG-06 | `main.ts`                | CORS aperto a tutti gli origini                 | Restringere a FRONTEND_URL (vedi P0.4)     |
| BUG-07 | Schema Prisma            | `deletedAt` definito ma mai usato (hard delete) | Implementare soft delete o rimuovere campo |
| BUG-08 | Tutti i controller       | Nessun auth guard                               | Implementare JWT (vedi P0.1)               |

---

## 📋 Ordine di Esecuzione Suggerito

```
SPRINT 1 (Settimana 1-2) — Fondamenta sicure
  └── P0.2 Fix routing bug          (30 min)
  └── P0.3 Sicurezza upload         (2 ore)
  └── P0.4 CORS restrittivo         (30 min)
  └── P2.8 .env.example             (1 ora)
  └── P0.1 Autenticazione JWT       (2-3 giorni)

SPRINT 2 (Settimana 3-4) — Funzionalità core
  └── P1.1 Endpoint Fatture         (1 giorno)
  └── P1.2 Endpoint SAL             (1 giorno)
  └── P1.3 Fix upload fornitore     (2 ore)
  └── P1.4 Dashboard stats reali    (3 ore)
  └── P1.5 Paginazione              (4 ore)

SPRINT 3 (Settimana 5-6) — Qualità & UX
  └── P0.5 Excel import reale       (2 giorni)
  └── P1.6 Job polling              (4 ore)
  └── P2.1 Global error handler     (2 ore)
  └── P2.2 Swagger docs             (4 ore)
  └── P2.3 Ricerca e filtri         (1 giorno)

SPRINT 4 (Settimana 7-8) — Polish
  └── P1.7 Audit trail              (1 giorno)
  └── P2.4 Design responsivo        (2 giorni)
  └── P2.9 Database indexes         (2 ore)
  └── P3.7 Test coverage            (2-3 giorni)
  └── P3.6 Containerizzazione       (1 giorno)
```

---

## 📊 Stato Completamento Attuale

| Area                      | Completamento | Note                                     |
| ------------------------- | ------------- | ---------------------------------------- |
| Backend - Commesse        | 100%          | Filtri, export Excel, responsabile auto  |
| Backend - Documenti       | 100%          | Preview txt/img, updateStato, export ZIP |
| Backend - Forniture       | 80%           | Upload file mancante                     |
| Backend - Fatture/SAL     | 90%           | Frontend tab Contabilità mancante        |
| Backend - Auth            | 100%          | Responsabile collegato al login          |
| Backend - Jobs            | 100%          | Polling frontend completato              |
| Backend - Swagger         | 95%           | DTO @ApiProperty mancanti                |
| Frontend - Lista Commesse | 100%          | Search + filtri + paginazione            |
| Frontend - Documenti      | 95%           | Pending docs interattivi con badge       |
| Frontend - Fornitori      | 75%           | Upload file non funziona                 |
| Frontend - Contabilità    | 0%            | Non iniziato                             |
| Sicurezza                 | 85%           | Auth JWT, CORS, filter globale           |
| Test                      | 5%            | 1 solo file di test                      |
| Containerizzazione        | 95%           | Dockerfile + docker-compose aggiornati   |
| **TOTALE STIMATO**        | **~93%**      |                                          |

---

_Fine RoadMap_01 — Aggiornare questo file ad ogni sprint completato._
