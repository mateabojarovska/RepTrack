# Zaledje je razdeljeno na poti, storitve in dostop do podatkov

- Status: sprejeto
- Datum: 2026-10-23

## Kontekst in opis problema

Express ne predpisuje strukture projekta. Če bi poslovna pravila (objava načrta, zaznavanje rekordov, izračun upoštevanja načrta) pisali neposredno v obdelovalce poti, bi se ista logika ponavljala in bi bila težko testirljiva. Odločiti se moramo, kako organizirati kodo zaledja.

## Obravnavane možnosti

- Trije sloji: poti (branje zahteve in odgovor), storitve (poslovna pravila) in Prisma (dostop do podatkovne baze)
- Vsa logika neposredno v obdelovalcih poti Express
- Ogrodje z vnaprej določeno strukturo (na primer NestJS)

## Odločitev

Izbrana možnost: »Trije sloji: poti, storitve in Prisma«, ker so poslovna pravila tako ločena od protokola HTTP in jih je mogoče klicati ter testirati neodvisno od poti. NestJS bi strukturo prinesel sam, vendar bi zahteval TypeScript, dekoratorje in učenje novega ogrodja, kar je za ta obseg preveč.

### Posledice

- Dobro, ker vsaka plast opravlja eno nalogo: pot prebere zahtevo, storitev odloči, Prisma shrani.
- Dobro, ker je mogoče storitve testirati brez zagona strežnika.
- Dobro, ker lahko več poti uporablja isto storitev (na primer izračun upoštevanja načrta za trenerja in za stranko).
- Slabo, ker je pri preprostih končnih točkah več datotek in kode, kot bi bilo nujno potrebno.
- Slabo, ker strukture ne vsiljuje ogrodje, zato jo morajo razvijalci dosledno upoštevati sami.
