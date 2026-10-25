# Ena tabela User s poljem za vlogo

- Status: sprejeto
- Datum: 2026-10-23

## Kontekst in opis problema

Sistem ima tri vloge: stranko, trenerja in administratorja. Odločiti se moramo, ali jih hranimo v eni tabeli ali v ločenih tabelah za vsako vlogo.

## Obravnavane možnosti

- Ena tabela `User` s poljem `role` (`Client`, `Trainer`, `Admin`) in poljem `trainerId` za stranke
- Ločene tabele `Client`, `Trainer` in `Admin`
- Skupna tabela `User` in dodatne tabele s podatki, specifičnimi za vlogo

## Odločitev

Izbrana možnost: »Ena tabela User s poljem za vlogo«, ker imajo vse tri vloge enake osnovne podatke (ime, e-poštni naslov, geslo, aktivnost) in se prijavljajo na enak način. Ločene tabele bi zapletle prijavo in avtorizacijo brez prave koristi pri tem obsegu.

### Posledice

- Dobro, ker obstaja ena sama pot za prijavo in ena oblika žetona JWT za vse vloge.
- Dobro, ker vloga uporabnika potuje v žetonu in jo middleware preveri brez dodatnih poizvedb.
- Dobro, ker je spremembo vloge mogoče izvesti s spremembo enega polja.
- Slabo, ker polje `trainerId` velja samo za stranke in je pri trenerjih in administratorjih prazno; pravilo mora preverjati zaledje, ne baza.
- Slabo, ker bi bilo treba tabelo razdeliti, če bi vloge kasneje potrebovale veliko različnih podatkov.
