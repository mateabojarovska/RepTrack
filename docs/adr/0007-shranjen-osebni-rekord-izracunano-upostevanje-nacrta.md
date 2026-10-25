# Oznaka osebnega rekorda se shrani, upoštevanje načrta se izračuna na zahtevo

- Status: sprejeto
- Datum: 2026-10-23

## Kontekst in opis problema

Sistem ob treningu zaznava osebne rekorde (F7) in prikazuje tedensko upoštevanje načrta (F8). Obe vrednosti je mogoče izpeljati iz zabeleženih treningov. Odločiti se moramo, ali ju shranimo v podatkovno bazo ali ju izračunamo ob vsakem prikazu.

## Obravnavane možnosti

- Oznako rekorda shraniti ob seriji, upoštevanje načrta izračunati na zahtevo
- Obe vrednosti izračunati na zahtevo
- Obe vrednosti shraniti in ju posodabljati ob vsaki spremembi

## Odločitev

Izbrana možnost: »Shranjen rekord, izračunano upoštevanje načrta«, ker je osebni rekord dejstvo v trenutku treninga: serija je bila rekord, ko je bila izvedena, in to se kasneje ne sme spremeniti. Upoštevanje načrta pa je odvisno od izbranega tedna in trenutnega načrta, zato bi shranjena vrednost hitro postala neusklajena z zapisi.

### Posledice

- Dobro, ker zgodovina rekordov ostane pravilna tudi, ko stranka kasneje dvigne več.
- Dobro, ker odgovor ob shranjevanju treninga takoj vsebuje zaznane rekorde.
- Dobro, ker upoštevanje načrta vedno ustreza dejanskim zapisom, brez shranjenih vrednosti za usklajevanje.
- Slabo, ker je treba oznako rekorda ponovno preveriti, če stranka popravi trening, dokler še ni pregledan.
- Slabo, ker izračun upoštevanja načrta pri vsakem prikazu nadzorne plošče sproži poizvedbo za vsako stranko; pri nekaj sto strankah je to sprejemljivo.
