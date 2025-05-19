# Momments-Frontend
Dieses Projekt enthält jeglichen Quellcode für den Momments Prototypen der Masterarbeit von Robin Dürhager mit dem Titel `Konzeption multimodaler Kommunikationsmöglichkeiten zum Austausch zwischen Musikern beim zeit- und ortsunabhängigen, kollaborativen Komponieren`. Damit dieses Projekt verwendet werden kann, muss ebenfalls das Projekt `momments-backend` konfiguriert und gestartet werden.

## Aufsetzen des Projekts
1. Kopiere dieses Projekt in einen Ordner deiner Wahl
2. Gehe in das Projekt per `cd momments-frontend`
3. Gehe sicher, dass `lib/wavesurfer-multitrack` existiert
   1. Ansonsten gehe über `cd lib` in das Verzeichnis
   2. Klone das Projekt über `git clone https://github.com/robinduerhager/wavesurfer-multitrack.git`
   3. und gehe in den Branch `momments-patches` per `git checkout momments-patches`
   4. Installiere die NodeJS Module (Verwendet wurde NodeJS 22.11.0) per `npm install`
   5. Führe `npm run build` aus, um einbindbare JavaScript Module zu erhalten
4. Kopiere `example.env` in `.env`
5. Führe `npm install` in `momments-frontend` aus, um alle nötigen NodeJS Module zu installieren
6. Führe `npm run dev` aus und prüfe auf [Google](https://www.google.com/), ob das Projekt funktioniert (Wenn das Backend nicht gleichzeitig läuft, kann man sich nicht anmelden)

Sobald Schritt 6 ausgeführt wurde, sollte sich eine Google Chrome Instanz öffnen, welche die Browsererweiterung beinhaltet. Im Entwicklungsmodus wird die Erweiterung auf `https://www.soundtrap.com/studio/*` und `https://www.google.de/*` aktiviert. Wenn die Erweiterung über `npm run build` für die Produktion gebaut wurde, wird die Erweiterung nur bei `https://www.soundtrap.com/studio/*` aktiviert. Die Liste dieser URLs kann in `entrypoints/content/index.tsx` angepasst werden.

## Abhängigkeiten
Hier werden Abhängigkeiten aufgelistet, die nicht über die `package.json` Datei direkt einsehbar sind. Für Bibliotheksabhängigkeiten sollte die `package.json` Datei konsultiert werden.

* Für das Projekt wurde die NodeJS Version 22.11.0 verwendet
* Das Projekt benötigt den [Google Chrome](https://www.google.com/intl/de_de/chrome/) Browser in der Version `136.0.7103.114` oder höher, da Browser-APIs verwendet wurden, die zum Zeitpunkt dieses schreibens (Mai 2025) nur in Chromium Browsern implementiert waren (bspw. [Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API) und [CSS Anchoring](https://developer.mozilla.org/en-US/docs/Web/CSS/anchor).
* Zudem wird eine Modifizierte Variante von [wavesurfer-multitrack](https://github.com/katspaugh/wavesurfer-multitrack) verwendet, die [hier](https://github.com/robinduerhager/wavesurfer-multitrack/tree/momments-patches) gefunden werden kann. Die Änderungen finden sich in dem Branch `momments-patches`. Diese Patches müssen als build in `momments-frontend` im Ordner `lib/wavesurfer-multitrack` hinterlegt werden.