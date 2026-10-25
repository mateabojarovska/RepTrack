# JavaScript na obeh straneh: Vue 3 in Node.js z Express

- Status: sprejeto
- Datum: 2026-10-23

## Kontekst in opis problema

Izbrati moramo tehnologiji za čelni del in zaledje. Projekt razvija manjša ekipa v omejenem času, zato želimo čim manj časa porabiti za učenje orodij in čim več za domensko logiko (načrti, treningi, rekordi).

## Obravnavane možnosti

- Vue 3 (Vite) na čelnem delu in Node.js z Express na zaledju
- React na čelnem delu in Node.js z Express na zaledju
- Vue 3 na čelnem delu in zaledje v drugem jeziku (na primer Java s Spring Boot ali Python s FastAPI)

## Odločitev

Izbrana možnost: »Vue 3 in Node.js z Express«, ker oba dela uporabljata isti jezik, isti upravljalnik paketov (npm) in isto obliko podatkov (JSON), zato ni pretvarjanja podatkov med stranema in je treba obvladati en nabor orodij. Vue smo izbrali pred Reactom, ker ima z Vue Routerjem in Pinio vse potrebno za usmerjanje in stanje že v uradnem ekosistemu, predloge pa so bližje navadnemu HTML.

### Posledice

- Dobro, ker se razvijalec lahko premika med čelnim delom in zaledjem brez menjave jezika.
- Dobro, ker isti ukazi (npm install, npm run dev) zaženejo oba dela.
- Dobro, ker sta Express in Vue razširjena in dobro dokumentirana.
- Slabo, ker JavaScript brez TypeScripta napak v tipih podatkov ne zazna pred zagonom.
- Slabo, ker bo mobilna aplikacija React Native uporabljala drugo knjižnico kot spletni čelni del, zato komponent ne bo mogoče deliti.
