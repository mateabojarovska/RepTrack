# 05 – Uporabniške zgodbe

Uporabniške zgodbe za funkcionalnosti F1–F14 iz `02-funkcionalnosti-in-obseg.md`. Zgodbe, označene z **MVP**, spadajo v prvo delujočo različico (funkcionalnosti F1, F4–F9): US-01, US-04, US-05, US-06, US-07, US-08, US-09 in US-10.

## US-01 – Prijava in dostop glede na vlogo `MVP`

- **Povezana funkcionalnost:** F1 – Prijava in dostop glede na vlogo
- **Uporabniška vloga:** Stranka, Trener, Administrator
- **MVP:** Da
- **Uporabniška zgodba:** Kot uporabnik fitnes centra želim prijavo z e-poštnim naslovom in geslom, da lahko uporabljam funkcije svoje vloge.
- **Acceptance criteria:**
  1. S pravilnim e-poštnim naslovom in geslom je uporabnik prijavljen in vidi samo poglede in dejanja svoje vloge.
  2. Pri napačnem e-poštnem naslovu ali geslu sistem prikaže sporočilo »Napačen e-poštni naslov ali geslo« in ne pove, kateri od podatkov je napačen.
  3. Deaktiviran uporabnik se ne more prijaviti, tudi s pravilnim geslom.
  4. Zahteva na zaščiteno končno točko API brez veljavnega žetona je zavrnjena s statusom 401, zahteva na končno točko druge vloge pa s statusom 403.

## US-02 – Upravljanje uporabnikov in dodeljevanje trenerjev

- **Povezana funkcionalnost:** F2 – Upravljanje uporabnikov in dodeljevanje trenerjev
- **Uporabniška vloga:** Administrator
- **MVP:** Ne
- **Uporabniška zgodba:** Kot administrator želim ustvarjati uporabniške račune in vsako stranko dodeliti trenerju, da ima vsaka stranka enega odgovornega trenerja.
- **Acceptance criteria:**
  1. Administrator lahko ustvari račun z imenom, priimkom, e-poštnim naslovom, geslom in vlogo (`Client`, `Trainer` ali `Admin`).
  2. Sistem zavrne račun z e-poštnim naslovom, ki že obstaja, in prikaže sporočilo »Ta e-poštni naslov je že v uporabi«.
  3. Stranka je lahko dodeljena natanko enemu trenerju; dodelitev drugemu trenerju nadomesti prejšnjo dodelitev.
  4. Na seznamu trenerjev so ponujeni samo uporabniki z vlogo `Trainer`.
  5. Stranke in trenerji, ki odprejo stran za upravljanje uporabnikov, dobijo status 403.

## US-03 – Katalog vaj

- **Povezana funkcionalnost:** F3 – Katalog vaj
- **Uporabniška vloga:** Trener
- **MVP:** Ne
- **Uporabniška zgodba:** Kot trener želim dodajati vaje v skupni katalog, da jih lahko jaz in drugi trenerji uporabljamo pri sestavljanju načrtov.
- **Acceptance criteria:**
  1. Vaja ima ime, mišično skupino (`Chest`, `Back`, `Legs`, `Shoulders`, `Arms` ali `Core`) in opis; ime in mišična skupina sta obvezna.
  2. Sistem zavrne vajo, katere ime v katalogu že obstaja.
  3. Nova vaja je takoj ponujena vsem trenerjem, ko dodajajo vaje v načrt.
  4. Vaja, ki jo je administrator deaktiviral, ni več ponujena za nove načrte, ostane pa vidna v obstoječih načrtih in treningih.

## US-04 – Ustvarjanje vadbenega načrta `MVP`

- **Povezana funkcionalnost:** F4 – Ustvarjanje vadbenega načrta
- **Uporabniška vloga:** Trener
- **MVP:** Da
- **Uporabniška zgodba:** Kot trener želim za svojo stranko sestaviti vadbeni načrt z vadbenimi dnevi in vajami, da stranka natančno ve, kaj mora narediti na posamezen vadbeni dan.
- **Acceptance criteria:**
  1. Trener lahko ustvari načrt samo za stranko, ki mu je dodeljena.
  2. Načrt mora imeti naslov in vsaj en vadbeni dan, vsak vadbeni dan pa mora imeti ime in vsaj eno vajo.
  3. Za vsako vajo trener vnese ciljno število serij in ciljno število ponovitev (celi števili, večji od 0), neobvezno pa lahko vnese ciljno težo v kg in opombo.
  4. Nov načrt se shrani s stanjem `Draft` in stranki ni viden.
  5. Trener lahko ureja načrt samo, dokler ima stanje `Draft`.

## US-05 – Objava načrta `MVP`

- **Povezana funkcionalnost:** F5 – Objava načrta
- **Uporabniška vloga:** Trener
- **MVP:** Da
- **Uporabniška zgodba:** Kot trener želim objaviti dokončan načrt, da stranka začne slediti novemu načrtu in ne uporablja več starega.
- **Acceptance criteria:**
  1. Objaviti je mogoče samo načrt s stanjem `Draft`.
  2. Po objavi ima načrt stanje `Active`, čas objave se shrani, stranka pa načrt vidi kot svoj aktivni načrt.
  3. Če je imela stranka že aktiven načrt, ta v isti operaciji dobi stanje `Archived`, tako da stranka nikoli nima dveh aktivnih načrtov.
  4. Arhiviranega načrta ni mogoče urejati ali ponovno objaviti, stranka pa si ga lahko še vedno ogleda med arhiviranimi načrti.
  5. Trener, ki poskuša objaviti načrt stranke drugega trenerja, dobi status 403.

## US-06 – Beleženje treninga glede na načrt `MVP`

- **Povezana funkcionalnost:** F6 – Beleženje treninga glede na načrt
- **Uporabniška vloga:** Stranka
- **MVP:** Da
- **Uporabniška zgodba:** Kot stranka želim zabeležiti opravljene serije za vadbeni dan svojega načrta, da trener ve, kaj sem dejansko naredila.
- **Acceptance criteria:**
  1. Stranka lahko izbere samo vadbeni dan svojega aktivnega načrta; stranka brez aktivnega načrta vidi sporočilo »Aktivnega načrta še nimate«.
  2. Za vsako vajo izbranega dne obrazec prikaže načrtovano število serij, ponovitev in težo.
  3. Za vsako serijo stranka vnese število ponovitev in težo v kg (0 pri vajah z lastno težo); treninga brez nobene serije ni mogoče shraniti.
  4. Shranjen trening ima stanje `Logged` in datum izvedbe ter se prikaže v zgodovini stranke in na trenerjevem seznamu treningov za pregled.
  5. Stranka lahko trening popravi, dokler ima stanje `Logged`.

## US-07 – Samodejno zaznavanje osebnih rekordov `MVP`

- **Povezana funkcionalnost:** F7 – Samodejno zaznavanje osebnih rekordov
- **Uporabniška vloga:** Stranka
- **MVP:** Da
- **Uporabniška zgodba:** Kot stranka želim samodejno označevanje svojih osebnih rekordov, da vidim, kdaj dvignem več kot kdajkoli prej.
- **Acceptance criteria:**
  1. Ob shranjevanju treninga se serija, katere teža je višja od najvišje teže v vseh prejšnjih serijah stranke pri isti vaji, označi kot osebni rekord.
  2. Serija z enako težo, kot je bil prejšnji najboljši rezultat, ni označena kot osebni rekord.
  3. Osebni rekord je prikazan z oznako ob seriji takoj po shranjevanju in kasneje v zgodovini treningov.
  4. Kasnejša, težja serija ne odstrani oznake osebnega rekorda s prejšnje serije.

## US-08 – Izračun upoštevanja načrta `MVP`

- **Povezana funkcionalnost:** F8 – Izračun upoštevanja načrta
- **Uporabniška vloga:** Trener
- **MVP:** Da
- **Uporabniška zgodba:** Kot trener želim videti tedensko upoštevanje načrta za vsako stranko, da vidim, katere stranke ne sledijo svojemu načrtu.
- **Acceptance criteria:**
  1. Upoštevanje načrta za teden se izračuna kot število zabeleženih treningov stranke v tem tednu, deljeno s številom vadbenih dni v aktivnem načrtu, prikazano v odstotkih, zaokroženih na celo število (2 od 3 = 67 %).
  2. Upoštevanje načrta je največ 100 %, tudi če je stranka zabeležila več treningov, kot je načrtovanih.
  3. Trener vidi upoštevanje načrta za tekoči teden ob vsaki stranki na seznamu svojih strank, stranka pa vidi svoje upoštevanje načrta.
  4. Upoštevanje načrta se spremeni takoj, ko stranka shrani nov trening.

## US-09 – Pregled treninga s povratno informacijo `MVP`

- **Povezana funkcionalnost:** F9 – Pregled treninga s povratno informacijo
- **Uporabniška vloga:** Trener
- **MVP:** Da
- **Uporabniška zgodba:** Kot trener želim pregledati zabeležene treninge svojih strank in napisati povratno informacijo, da stranka ve, kaj mora izboljšati.
- **Acceptance criteria:**
  1. Trener vidi seznam treningov s stanjem `Logged`, samo od svojih strank.
  2. Trener napiše povratno informacijo in trening označi kot pregledan; trening dobi stanje `Reviewed`, čas pregleda pa se shrani.
  3. Po pregledu stranka treninga ne more več urejati.
  4. Trener ne more spremeniti števila ponovitev ali tež, ki jih je vnesla stranka.

## US-10 – Branje trenerjeve povratne informacije `MVP`

- **Povezana funkcionalnost:** F9 – Pregled treninga s povratno informacijo
- **Uporabniška vloga:** Stranka
- **MVP:** Da
- **Uporabniška zgodba:** Kot stranka želim brati trenerjeve povratne informacije o svojih treningih, da vem, kaj moram izboljšati na naslednjem treningu.
- **Acceptance criteria:**
  1. V strankini zgodovini treningov trening s stanjem `Reviewed` prikazuje trenerjevo povratno informacijo in datum pregleda.
  2. Trening s stanjem `Logged` prikazuje oznako »Čaka na pregled« in nobene povratne informacije.
  3. Stranka vidi povratne informacije samo pri svojih treningih.
  4. Stranka trenerjeve povratne informacije ne more urejati ali brisati.

## US-11 – Opozorilo o neaktivni stranki

- **Povezana funkcionalnost:** F10 – Opozorilo o neaktivni stranki
- **Uporabniška vloga:** Trener
- **MVP:** Ne
- **Uporabniška zgodba:** Kot trener želim videti, katere stranke so prenehale beležiti treninge, da jih lahko pravočasno pokličem.
- **Acceptance criteria:**
  1. Stranka, ki več kot določeno število dni ni zabeležila treninga, je izpostavljena na trenerjevi nadzorni plošči.
  2. Ob izpostavljeni stranki je prikazano število dni od njenega zadnjega treninga.
  3. Izpostavitev izgine, takoj ko stranka zabeleži nov trening.
  4. Trener vidi opozorila samo za svoje stranke.

## US-12 – Zgodovina napredka po vaji

- **Povezana funkcionalnost:** F11 – Zgodovina napredka po vaji
- **Uporabniška vloga:** Stranka
- **MVP:** Ne
- **Uporabniška zgodba:** Kot stranka želim videti, kako sta se teža in število ponovitev pri vaji spreminjala skozi čas, da vidim svoj napredek.
- **Acceptance criteria:**
  1. Stranka izbere vajo in vidi vse svoje zabeležene serije te vaje z datumom, številom ponovitev in težo, razvrščene po datumu.
  2. Izbrati je mogoče samo vaje, ki jih je stranka že zabeležila.
  3. Serije, označene kot osebni rekordi, so v zgodovini označene.
  4. Trener lahko vidi enako zgodovino samo za svoje stranke.

## US-13 – Kopiranje načrta

- **Povezana funkcionalnost:** F12 – Kopiranje načrta
- **Uporabniška vloga:** Trener
- **MVP:** Ne
- **Uporabniška zgodba:** Kot trener želim kopirati obstoječi načrt kot nov osnutek, da mi podobnega načrta ni treba sestavljati iz praznega.
- **Acceptance criteria:**
  1. Trener lahko kopira katerikoli svoj načrt, ne glede na njegovo stanje.
  2. Kopija je nov načrt s stanjem `Draft`, ki ima enake vadbene dneve, vaje, ciljne vrednosti in opombe kot izvirnik.
  3. Trener stranko za kopijo izbere med svojimi strankami.
  4. Izvirni načrt se ne spremeni, kopija pa stranki ni vidna, dokler ni objavljena.

## US-14 – Zahteva za spremembo načrta

- **Povezana funkcionalnost:** F13 – Zahteva za spremembo načrta
- **Uporabniška vloga:** Stranka
- **MVP:** Ne
- **Uporabniška zgodba:** Kot stranka želim trenerja prositi za spremembo načrta in navesti razlog, da se načrt lahko prilagodi, ko sem poškodovana ali je vaja pretežka.
- **Acceptance criteria:**
  1. Stranka lahko pošlje zahtevo samo za svoj aktivni načrt, razlog pa je obvezen.
  2. Trener vidi zahtevo in jo lahko sprejme ali zavrne; stranka vidi odločitev.
  3. Sprejeta zahteva ustvari nov načrt s stanjem `Draft` na podlagi trenutnega aktivnega načrta.
  4. Trenutni načrt ostane aktiven, dokler trener ne objavi novega.

## US-15 – Pregled fitnes centra

- **Povezana funkcionalnost:** F14 – Pregled fitnes centra
- **Uporabniška vloga:** Administrator
- **MVP:** Ne
- **Uporabniška zgodba:** Kot administrator želim videti pregled trenerjev in strank, da vidim, kako je delo razporejeno med trenerje.
- **Acceptance criteria:**
  1. Pregled prikaže število dodeljenih strank za vsakega trenerja.
  2. Pregled prikaže število strank z aktivnim načrtom in število neaktivnih strank.
  3. Pregled ne prikazuje podrobnosti treningov ali povratnih informacij.
  4. Stranke in trenerji, ki odprejo pregled, dobijo status 403.
