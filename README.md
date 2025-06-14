# kogum

### Env Setup

#### First Time Setup

1. Create a packages/backend/.env file `cp packages/backend/env.example packages/backend/env`
2. Create the database objects `npm run db:create`
3. Seed tables with cards, puzzles, and solutions `npm run seed:all`
4. Seed daily table with daily puzzles (21 days at a time) `npm run seed:daily`

#### Backend Startup

`cd packages/backend && npm run dev`

#### Frontend Startup

`cd packages/frontend && npm run dev`
