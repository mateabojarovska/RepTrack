# Avtentikacija brez stanja z žetoni JWT

- Status: sprejeto
- Datum: 2026-10-23

## Kontekst in opis problema

Uporabniki se prijavijo z e-poštnim naslovom in geslom, nato pa mora zaledje pri vsaki zahtevi vedeti, kdo je uporabnik in kakšno vlogo ima. Odločiti se moramo, kako zaledje prepozna prijavljenega uporabnika, pri čemer mora rešitev delovati tudi za prihodnjo mobilno aplikacijo.

## Obravnavane možnosti

- Podpisan žeton JWT z id-jem in vlogo uporabnika, ki ga odjemalec pošilja v glavi `Authorization`
- Seje na strežniku s piškotkom
- Zunanji ponudnik identitete (na primer Auth0 ali Keycloak)

## Odločitev

Izbrana možnost: »Žeton JWT«, ker strežnik ne hrani sej, zaledje ostane preprosto in deluje enako za brskalnik in mobilnega odjemalca, ki piškotkov ne uporablja naravno. Zunanji ponudnik identitete bi bil za en fitnes center brez javne registracije nepotrebno zapleten. Žeton poteče po nekaj urah, gesla pa se hranijo samo kot zgoščene vrednosti (bcrypt).

### Posledice

- Dobro, ker zaledje ne potrebuje shrambe sej in vsako zahtevo preveri samo s ključem za podpisovanje.
- Dobro, ker isti način prijave deluje za splet in za mobilno aplikacijo.
- Dobro, ker žeton že vsebuje vlogo, zato middleware takoj preveri, ali sme uporabnik klicati končno točko.
- Slabo, ker žetona ni mogoče preklicati pred potekom; deaktiviran uporabnik lahko žeton uporablja do konca njegove veljavnosti. To je ob kratkem času veljavnosti sprejemljivo.
- Slabo, ker mora čelni del žeton varno hraniti in ga dodajati vsaki zahtevi.
