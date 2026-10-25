# Načrti se ob spremembi arhivirajo, ne prepišejo

- Status: sprejeto
- Datum: 2026-10-23

## Kontekst in opis problema

Trener načrt stranke redno spreminja (večje teže, nove vaje). Zabeleženi treningi so vezani na vadbeni dan načrta, po katerem so bili izvedeni. Odločiti se moramo, kaj se zgodi s starim načrtom, ko trener objavi novega.

## Obravnavane možnosti

- Objava novega načrta starega premakne v stanje `Archived`; načrt prehaja med stanji `Draft` → `Active` → `Archived`
- Trener aktivni načrt ureja neposredno in ga prepiše
- Hranjenje različic načrta (zgodovina vseh sprememb enega načrta)

## Odločitev

Izbrana možnost: »Arhiviranje ob objavi«, ker stari treningi tako ostanejo povezani z načrtom, po katerem so bili izvedeni, in zgodovina ostane pravilna tudi po spremembi. Ker se ureja samo osnutek, stranka nikoli ne vidi napol spremenjenega načrta. Polno hranjenje različic bi bilo zahtevnejše in za uporabnike ne bi prineslo več od arhiviranja celih načrtov.

### Posledice

- Dobro, ker ima stranka vedno natanko en veljaven načrt.
- Dobro, ker se pri pregledu starega treninga vidijo načrtovane vrednosti, ki so takrat veljale.
- Dobro, ker stranka arhivirane načrte lahko še vedno pregleduje.
- Slabo, ker se podatki o načrtih s časom kopičijo, saj se nič ne briše.
- Slabo, ker mora trener tudi za majhen popravek ustvariti nov osnutek in ga objaviti (kar olajša kopiranje načrta, F12).
