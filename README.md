# BrescianiCRM — Gestionale Edile

Sistema di gestione cantieri per **Bresciani Group**.  
Frontend Next.js · Backend NestJS · Database PostgreSQL · Code job Redis.

---

## Prerequisiti

| Strumento | Versione minima |
|-----------|----------------|
| Node.js   | 20.x           |
| pnpm      | 9.x            |
| Docker Desktop | qualsiasi |

---

## Avvio rapido (Windows)

1. Avviare **Docker Desktop**.
2. Fare doppio clic su **`start-crm.vbs`** nella cartella del progetto.

Lo script esegue automaticamente:
- Docker Compose (PostgreSQL + Redis)
- API NestJS su `http://localhost:3001`
- Frontend Next.js su `http://localhost:3000`

Dopo circa 10 secondi il browser si apre sulla dashboard.

---

## Configurazione manuale

### 1. Installare le dipendenze

```bash
pnpm install
```

### 2. Configurare le variabili d'ambiente

**Database** — copiare il file di esempio e adattarlo:

```bash
cp packages/db/.env.example packages/db/.env
# oppure modificare direttamente packages/db/.env
```

**API** — creare `apps/api/.env` a partire dall'esempio:

```bash
cp apps/api/.env.example apps/api/.env
# Modificare STORAGE_BASE_PATH con il percorso reale dei documenti
```

### 3. Avviare i servizi Docker

```bash
docker compose up -d
```

### 4. Applicare lo schema al database

```bash
pnpm --filter @bresciani/db push
# oppure, se si usano le migration:
# pnpm --filter @bresciani/db exec prisma migrate deploy
```

### 5. Avviare API e frontend

In due terminali separati:

```bash
# Terminale 1 — API (porta 3001)
pnpm --filter api start:dev

# Terminale 2 — Frontend (porta 3000)
pnpm --filter web dev
```

Aprire `http://localhost:3000` nel browser.

---

## Struttura del progetto

```
Gestionale-edile-GP/
├── apps/
│   ├── api/          # Backend NestJS (porta 3001)
│   └── web/          # Frontend Next.js (porta 3000)
├── packages/
│   └── db/           # Client Prisma + schema database
├── docker-compose.yml
├── start-crm.bat     # Script avvio Windows (console)
└── start-crm.vbs     # Script avvio Windows (silenzioso)
```

---

## Funzionalità principali

| Sezione | Descrizione |
|---------|-------------|
| **Dashboard** | Panoramica di tutte le commesse con stato, importo e avanzamento |
| **Sintesi commessa** | Dati generali, computo metrico (WBS) e data inizio lavori |
| **Archivio documentale** | Caricamento e anteprima di contratti, varianti e documentazione progettuale |
| **Gestione fornitori** | Elenco fornitori con contratti e documenti operativi |

---

## Variabili d'ambiente

### `packages/db/.env`

| Variabile | Descrizione |
|-----------|-------------|
| `DATABASE_URL` | URL di connessione PostgreSQL |

### `apps/api/.env`

| Variabile | Default | Descrizione |
|-----------|---------|-------------|
| `DATABASE_URL` | — | URL di connessione PostgreSQL (stesso del db package) |
| `REDIS_HOST` | `localhost` | Host del server Redis |
| `REDIS_PORT` | `6379` | Porta del server Redis |
| `STORAGE_BASE_PATH` | `C:\Users\Utente\...` | Cartella radice per i file delle commesse |

---

## Comandi utili

```bash
# Eseguire i test dell'API
pnpm --filter api test

# Build di produzione
pnpm --filter api build
pnpm --filter web build

# Aprire Prisma Studio (interfaccia DB)
pnpm --filter @bresciani/db studio
```
