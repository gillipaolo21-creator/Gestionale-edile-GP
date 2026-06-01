# Docker Dev Setup

Questo file descrive come avviare il progetto in modalita' sviluppo con Docker.

## Prerequisiti

- Docker Desktop installato e in esecuzione.

## Avvio

Da root del progetto:

```bash
# build + start
Docker compose -f docker-compose.dev.yml up --build
```

## URL

- Web: http://localhost:3000
- API: http://localhost:3001

## Note

- Su Windows il polling e' abilitato per l'hot-reload.
- I volumi mantengono i dati di Postgres tra i riavvii.

## Stop

```bash
Docker compose -f docker-compose.dev.yml down
```

## Reset completo dei dati

```bash
Docker compose -f docker-compose.dev.yml down -v
```
