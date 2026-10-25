# RepTrack

#Test

Spletna aplikacija za osebne trenerje in njihove stranke za upravljanje vadbenih načrtov in spremljanje treningov.

## O projektu

Osebni trenerji strankam vadbene načrte pogosto predajajo na papirju ali v preglednici, zato ne vedo, ali stranka treninge res opravlja, napredek pa ni nikjer zabeležen. RepTrack hrani vadbeni načrt, evidenco opravljenih treningov in trenerjeve povratne informacije na enem mestu.

- **Trener** pripravi vadbeni načrt in ga objavi stranki.
- **Stranka** v fitnesu na telefonu zabeleži vsak trening glede na načrt.
- **Sistem** samodejno zazna osebne rekorde in izračuna tedensko upoštevanje načrta.
- **Trener** pregleda zabeležene treninge in napiše povratno informacijo.
- **Administrator** ustvarja račune in stranke dodeljuje trenerjem.

Rešitev je namenjena enemu manjšemu ali srednje velikemu fitnes centru.

## Tehnologije

| Področje | Tehnologija |
|---|---|
| Čelni del | Vue 3 (Vite), Vue Router, Pinia, Axios |
| Zaledje | Node.js, Express, Prisma |
| Podatkovna baza | PostgreSQL |
| Avtentikacija | JWT, bcrypt |
| Razvoj | Docker Compose, Git |

## Struktura repozitorija

    ├── frontend/   # čelni del (Vue 3)
    ├── backend/    # zaledje (Node.js, Express)
    └── docs/       # projektna dokumentacija in arhitekturne odločitve

## Dokumentacija

- [Zasnova rešitve](docs/01-zasnova-resitve.md)
- [Funkcionalnosti in obseg](docs/02-funkcionalnosti-in-obseg.md)
- [Podatkovni model](docs/03-podatkovni-model.md)
- [Arhitektura in tehnološki sklad](docs/04-arhitektura-in-tehnoloski-sklad.md)
- [Uporabniške zgodbe](docs/05-uporabniske-zgodbe.md)
- [Wireframes](docs/06-wireframes.md)
- [Arhitekturne odločitve (ADR)](docs/adr/)

## Razvojni proces

Projekt uporablja **GitHub Flow**: veja `main` je zaščitena, vsaka sprememba nastane na ločeni veji in se v `main` združi prek pull requesta.