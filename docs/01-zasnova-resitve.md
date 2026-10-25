# 01 – Zasnova rešitve

## Ime rešitve

**RepTrack** – spletna aplikacija za osebne trenerje in njihove stranke za upravljanje vadbenih načrtov in spremljanje treningov.

## Namen rešitve in problem, ki ga rešuje

Osebni trenerji v fitnes centrih strankam vadbene načrte običajno predajo na papirju, v preglednici ali prek aplikacije za klepet. To povzroča več težav:

- Trener ne ve, ali je stranka med dvema srečanjema treninge res opravila in s kakšnimi težami.
- Stranka načrt izgubi ali pozabi ali pa še naprej uporablja staro različico, potem ko ga je trener spremenil.
- Napredek ni nikjer zabeležen, zato nobena stran ne vidi, ali stranka postaja močnejša.
- Trener z 20 ali več strankami ne more pravočasno opaziti, katere so prenehale trenirati.

RepTrack hrani vadbeni načrt, evidenco opravljenih treningov in trenerjeve povratne informacije na enem mestu. Trener načrt napiše enkrat, stranka vsak trening zabeleži glede na načrt, sistem pa samodejno izračuna napredek in upoštevanje načrta.

## Ciljni uporabniki

| Uporabnik | Situacija, v kateri uporablja rešitev |
|---|---|
| **Stranka** – član fitnes centra, ki trenira z osebnim trenerjem | V fitnesu, v brskalniku na telefonu: odpre današnji vadbeni dan, vidi, katere vaje mora narediti, ter vnese dejansko opravljene ponovitve in teže. |
| **Trener** – osebni trener, ki je zaposlen v fitnes centru ali tam dela | Za računalnikom pred srečanji ali po njih: pripravlja načrte za stranke, pregleduje njihove zabeležene treninge, piše povratne informacije in prilagaja načrte. |
| **Administrator** – vodja fitnes centra ali receptor | Občasno: ustvarja uporabniške račune, dodeljuje stranke trenerjem in vzdržuje katalog vaj. |

Rešitev je namenjena enemu manjšemu ali srednje velikemu fitnes centru z nekaj trenerji in do nekaj sto strankami.

## Kako rešitev deluje

1. Administrator ustvari račune in vsako stranko dodeli enemu trenerju.
2. Trener za stranko ustvari **vadbeni načrt**. Načrt sestavljajo vadbeni dnevi (na primer »Dan A – zgornji del telesa«), vsak dan pa vsebuje vaje iz skupnega kataloga s ciljnim številom serij, ponovitev in težo.
3. Trener načrt **objavi**. Ta postane strankin aktivni načrt, njen prejšnji načrt pa se samodejno arhivira, tako da ima stranka vedno natanko en veljaven načrt.
4. Stranka v fitnesu odpre aktivni načrt in **zabeleži trening**: za vsako vajo vnese število ponovitev in težo vsake serije.
5. Ob shranjevanju treninga sistem vsako serijo primerja z zgodovino stranke in označi **osebne rekorde**.
6. Sistem izračuna **upoštevanje načrta** – koliko načrtovanih treningov je stranka opravila v posameznem tednu.
7. Trener na svoji nadzorni plošči vidi nove treninge, jih **pregleda** in napiše povratno informacijo, ki jo stranka vidi ob treningu.
8. Na podlagi zapisov trener pripravi novo različico načrta in jo objavi, cikel pa se ponovi.

### Primer

Ana je trenerka s 25 strankami. V ponedeljek objavi tridnevni načrt za svojo stranko Marka. Marko trenira v torek in četrtek ter zabeleži oba treninga; v četrtek sistem njegov potisk s prsi z 80 kg označi kot osebni rekord. V petek Ana odpre nadzorno ploščo, vidi, da je Marko opravil 2 od 3 načrtovanih treningov (67-odstotno upoštevanje načrta), pregleda oba zapisa in napiše, da lahko naslednji teden poveča težo pri počepu. Vidi tudi, da neka druga stranka že 10 dni ni zabeležila ničesar, in jo pokliče.
