# Vsa poslovna pravila se uveljavljajo samo v zaledju

- Status: sprejeto
- Datum: 2026-10-23

## Kontekst in opis problema

Sistem ima več pravil, od katerih je odvisna pravilnost podatkov: stranka ima največ en aktiven načrt, urejati je mogoče samo osnutek načrta, trening je mogoče zabeležiti samo za dan aktivnega načrta, pregledanega treninga stranka ne more več urejati, trener vidi samo svoje stranke. Odločiti se moramo, kje se ta pravila preverjajo.

## Obravnavane možnosti

- Pravila samo v zaledju, čelni del samo prikazuje in preverja obliko vnosa
- Pravila v čelnem delu in v zaledju
- Pravila v podatkovni bazi (omejitve, sprožilci, shranjene procedure)

## Odločitev

Izbrana možnost: »Pravila samo v zaledju«, ker se tako uveljavljajo na enem mestu in jih uporabnik ne more zaobiti s spreminjanjem čelnega dela ali z neposrednim klicem API. Čelni del sme skriti dejanja, ki jih vloga ne more izvesti, vendar je odločilno preverjanje v zaledju. Podatkovna baza varuje samo osnovno skladnost (tuji ključi, enoličnost).

### Posledice

- Dobro, ker so pravila zapisana enkrat in veljajo enako za spletnega in prihodnjega mobilnega odjemalca.
- Dobro, ker je čelni del preprostejši in ne vsebuje logike, ki bi jo bilo treba podvajati.
- Dobro, ker je pravila mogoče testirati kot navadno kodo JavaScript, brez uporabniškega vmesnika.
- Slabo, ker uporabnik nekatere napake (na primer urejanje pregledanega treninga) izve šele iz odgovora strežnika, če jih čelni del ne prepreči vnaprej.
- Slabo, ker pravila na ravni podatkovne baze ne bi bila zaščitena, če bi nekdo do baze dostopal mimo zaledja.
