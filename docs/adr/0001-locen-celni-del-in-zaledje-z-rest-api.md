# Ločen čelni del in zaledje, ki komunicirata prek REST API

- Status: sprejeto
- Datum: 2026-10-23

## Kontekst in opis problema

RepTrack uporabljajo tri vloge (stranka, trener, administrator) v brskalniku, v kasnejših nadgradnjah pa je predvidena tudi mobilna aplikacija React Native za stranke. Odločiti se moramo, ali bo uporabniški vmesnik del iste aplikacije kot strežniška logika ali ločen odjemalec, ki do podatkov dostopa prek vmesnika API.

## Obravnavane možnosti

- Ločen čelni del (enostranska aplikacija) in zaledje z REST API, ki si izmenjujeta podatke v obliki JSON
- Monolitna aplikacija, kjer strežnik izrisuje strani HTML (na primer s predlogami)
- Ločen čelni del in zaledje z vmesnikom GraphQL

## Odločitev

Izbrana možnost: »Ločen čelni del in zaledje z REST API«, ker zaledje tako ni odvisno od uporabniškega vmesnika in ga bo prihodnja mobilna aplikacija lahko uporabljala brez sprememb na strežniku. REST je za naš obseg (nekaj virov z jasnimi končnimi točkami, kot so načrti, treningi in stranke) preprostejši od GraphQL.

### Posledice

- Dobro, ker isti API služi spletnemu in prihodnjemu mobilnemu odjemalcu.
- Dobro, ker je mogoče čelni del in zaledje razvijati, testirati in zaganjati ločeno.
- Dobro, ker so končne točke jasno določene in jih je mogoče preizkušati neodvisno od vmesnika (na primer s Postmanom).
- Slabo, ker je treba vzdrževati dva projekta in dogovor o obliki podatkov med njima.
- Slabo, ker mora čelni del za nekatere poglede poslati več zahtev, kar bi pri GraphQL rešili z eno poizvedbo.
