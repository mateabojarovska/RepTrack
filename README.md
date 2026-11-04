# RepTrack

A web application for personal trainers and their clients to manage training plans and track workouts.

## About the project

Personal trainers often give clients their training plans on paper or in a spreadsheet, so they don't know whether the client really does the workouts, and progress is not recorded anywhere. RepTrack keeps the training plan, the record of completed workouts and the trainer's feedback in one place.

- The **trainer** prepares a training plan and publishes it to the client.
- The **client** logs every workout against the plan on a phone in the gym.
- The **system** automatically detects personal records and calculates weekly plan adherence.
- The **trainer** reviews the logged workouts and writes feedback.
- The **administrator** creates accounts and assigns clients to trainers.

The solution is intended for a single small or medium-sized gym.

## Implemented (MVP)

| User story | What works |
|---|---|
| US-01 | Login with email and password, pages and API limited by role |
| US-04 | Trainer builds a draft training plan with training days and exercises |
| US-05 | Trainer publishes a plan; the client's previous active plan is archived |
| US-06 | Client logs a workout for a day of the active plan and can correct it until it is reviewed |
| US-07 | Personal records are detected automatically when a workout is saved |
| US-08 | Weekly plan adherence for the trainer's clients and for the client |
| US-09 | Trainer reviews logged workouts and writes feedback |
| US-10 | Client sees the trainer's feedback in the workout history |

## Technologies

| Area | Technology |
|---|---|
| Frontend | Vue 3 (Vite), Vue Router, Pinia, Axios |
| Backend | Node.js, Express, Prisma |
| Database | PostgreSQL 16 |
| Authentication | JWT, bcrypt |
| Development | Docker Compose, Git |

## Repository structure

    ├── docker-compose.yml   # PostgreSQL database for local development
    ├── frontend/            # frontend (Vue 3)
    ├── backend/             # backend (Node.js, Express, Prisma)
    │   └── prisma/          # database schema, migrations and seed data
    └── docs/                # project documentation and architectural decisions

## Running locally

### Requirements

- [Node.js](https://nodejs.org/) 20.6 or newer (22 LTS recommended)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/), running
- [Git](https://git-scm.com/)

### 1. Get the code

```bash
git clone https://github.com/mateabojarovska/RepTrack.git
cd RepTrack
```

### 2. Start the database

```bash
docker compose up -d db
```

PostgreSQL runs in Docker on port **5433**, so it does not conflict with a PostgreSQL installed directly on the computer.

### 3. Set up and start the backend

```bash
cd backend
npm install
```

Create the settings file `.env` from the example:

- macOS, Linux or Git Bash: `cp .env.example .env`
- Windows PowerShell: `Copy-Item .env.example .env`

Create the tables and load the test data:

```bash
npx prisma migrate dev
npx prisma db seed
```

Start the API:

```bash
npm run dev
```

The API runs at http://localhost:3000. Check it at http://localhost:3000/api/health, which returns `{"status":"ok"}`.

### 4. Start the frontend

In a **second terminal**, from the project folder:

```bash
cd frontend
npm install
npm run dev
```

Open the application at **http://localhost:5173**.

### 5. Log in with a test account

Every test account uses the password **`password123`**.

| Email | Role |
|---|---|
| admin@reptrack.test | Administrator |
| ana@reptrack.test | Trainer (clients Marko Novak and Eva Kos) |
| luka@reptrack.test | Trainer (client Nina Krajnc) |
| marko@reptrack.test | Client |
| eva@reptrack.test | Client |
| nina@reptrack.test | Client |

A short tour: log in as **ana@reptrack.test**, create a plan for Marko under **Plans** and publish it. Log in as **marko@reptrack.test** and log a workout under **Log workout**. Log in as Ana again and review it under **Workouts to review**. Marko then sees the feedback under **History**.

### Stopping and resetting

- Stop the backend and the frontend with **Ctrl+C** in their terminals.
- Stop the database with `docker compose down` (the data is kept).
- Delete all data and start again with an empty database:

  ```bash
  docker compose down -v
  docker compose up -d db
  cd backend
  npx prisma migrate dev
  npx prisma db seed
  ```

### Common problems

| Problem | Solution |
|---|---|
| `Can't reach database server at localhost:5433` | Docker Desktop is not running, or the database was not started. Start Docker Desktop and run `docker compose up -d db` in the project folder. |
| `Authentication failed against database server` | The database was created earlier with other settings. Run `docker compose down -v`, then repeat steps 2 and 3. |
| Login shows "Something went wrong. Please try again." | The backend is not running. Start it with `npm run dev` in the `backend` folder. |
| `npm run dev` in `backend` stops with `.env: not found` | The `.env` file is missing. Create it from `.env.example` as in step 3. |

## Documentation

- [Solution concept](docs/01-zasnova-resitve.md)
- [Functionalities and scope](docs/02-funkcionalnosti-in-obseg.md)
- [Data model](docs/03-podatkovni-model.md)
- [Architecture and technology stack](docs/04-arhitektura-in-tehnoloski-sklad.md)
- [User stories](docs/05-uporabniske-zgodbe.md)
- [Wireframes](docs/06-wireframes.md)
- [Architectural decisions (ADR)](docs/adr/)

## Development process

The project uses **GitHub Flow**: the `main` branch is protected, every change is made on a separate branch and merged into `main` through a pull request that closes its issue. Tasks are tracked on the GitHub Project board.
