MONGOLSKÁ SLOVÍČKA – balíček pro instalaci (PWA)

Obsah:
  index.html            aplikace
  manifest.webmanifest  název, ikony a nastavení instalace
  sw.js                 offline režim a aktualizace
  icon-*.png, apple-touch-icon.png   ikony
  screenshot-*.png      obrázky pro okno instalace

Jak to nasadit:
  1. Nahraj CELOU složku (všechny soubory)
     na hosting s HTTPS, např. GitHub Pages nebo Netlify.
  2. Otevři adresu na telefonu v Chromu a zvol "Nainstalovat aplikaci".
  3. Nebo adresu zadej na pwabuilder.com a stáhni APK.

Jak aktualizovat:
  Nahraj nové soubory přes staré. V souboru sw.js je na prvním řádku VERSION;
  při každé změně se číslo zvyšuje (v1, v2, v3...). Telefon si novou verzi
  stáhne při příštím otevření s internetem.

Poznámka: písma se při prvním otevření s internetem uloží do telefonu.
Bez nich aplikace funguje také, jen s písmem systému.
