# Relacijska podatkovna baza PostgreSQL z ORM Prisma

- Status: sprejeto
- Datum: 2026-10-23

## Kontekst in opis problema

Podatki v RepTracku so močno povezani: načrt ima vadbene dneve, dnevi imajo vaje, trening ima serije, vse pa je vezano na stranko in trenerja. Glavni izračuni so poizvedbe po teh povezavah, na primer najvišja prejšnja teža pri vaji za zaznavanje osebnega rekorda. Odločiti se moramo, kakšno podatkovno bazo uporabiti in kako bo zaledje do nje dostopalo.

## Obravnavane možnosti

- Relacijska baza PostgreSQL z ORM Prisma
- Dokumentna baza MongoDB
- Relacijska baza z ročno pisanimi poizvedbami SQL brez ORM

## Odločitev

Izbrana možnost: »PostgreSQL z ORM Prisma«, ker relacijski model naravno opiše povezave med načrti, dnevi, vajami in treningi, tuji ključi pa varujejo skladnost podatkov. Dokumentna baza tu ne bi prinesla prednosti, saj bi povezave med dokumenti morali vzdrževati sami. Prisma shemo opiše v eni datoteki in jo spreminja z migracijami, zato vsak razvijalec iz kode dobi enako strukturo baze.

### Posledice

- Dobro, ker tuji ključi in enoličnost preprečujejo neskladne podatke (na primer trening za neobstoječ vadbeni dan).
- Dobro, ker se poizvedbe, kot je najvišja prejšnja teža pri vaji, izrazijo neposredno.
- Dobro, ker so migracije shranjene v repozitoriju in jih je mogoče ponoviti na vsakem računalniku.
- Dobro, ker se PostgreSQL lokalno preprosto zažene z Docker Compose.
- Slabo, ker je treba za vsako spremembo podatkovnega modela pripraviti migracijo.
- Slabo, ker Prisma pri zahtevnejših poizvedbah (agregacije čez več tabel) lahko zahteva neposreden SQL.
