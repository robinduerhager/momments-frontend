# Momments-Frontend
Dieses Projekt enthält jeglichen Quellcode für das Frontend des Momments-Prototypen der Masterarbeit von Robin Dürhager mit dem Titel `Konzeption multimodaler Kommunikationsmöglichkeiten zum Austausch zwischen Musikern beim zeit- und ortsunabhängigen, kollaborativen Komponieren`. Damit dieses Projekt verwendet werden kann, muss ebenfalls das Projekt `momments-backend` konfiguriert und gestartet werden.

> **Hinweis:** Zum Betrieb ist zusätzlich das Projekt `momments-backend` in dieser Abgabe erforderlich.

## Aufsetzen des Projekts
1. Kopiere dieses Projekt in einen Ordner deiner Wahl
2. Gehe in das Projekt per `cd momments-frontend`
3. Gehe sicher, dass eine Version der [modifizierten Wavesurfer-Multitrack Bibliothek](https://github.com/robinduerhager/wavesurfer-multitrack) in `lib/wavesurfer-multitrack` existiert
   1. Ansonsten gehe über `cd lib` in das Verzeichnis
   2. Klone das Projekt über `git clone https://github.com/robinduerhager/wavesurfer-multitrack.git`
   3. und gehe in den Branch `momments-patches` per `git checkout momments-patches`
   4. Installiere die NodeJS Module (Verwendet wurde NodeJS 22.11.0) per `npm install`
   5. Führe `npm run build` aus, um einbindbare JavaScript Module zu erhalten
4. Kopiere `example.env` in `.env` (Hier sollte die API URL und der Port mit dem von `momments-backend` überprüft werden)
5. Führe `npm install` in `momments-frontend` aus, um alle nötigen NodeJS Module zu installieren
6. Führe `npm run dev` aus und prüfe auf [Google](https://www.google.com/), ob das Projekt funktioniert (Wenn das Backend nicht gleichzeitig läuft, kann man sich nicht anmelden)

Sobald Schritt 6 ausgeführt wurde, sollte sich eine Google Chrome Instanz öffnen, welche die Browsererweiterung beinhaltet. Im Entwicklungsmodus wird die Erweiterung auf `https://www.soundtrap.com/studio/*` und `https://www.google.de/*` aktiviert. Wenn die Erweiterung über `npm run build` für die Produktion gebaut wurde, wird die Erweiterung nur bei `https://www.soundtrap.com/studio/*` aktiviert. Die Liste dieser URLs kann in `entrypoints/content/index.tsx` angepasst werden.

## Projektstruktur
Im Folgenden wird die Ordnerstruktur dargestellt und über Kommentare kurz und prägnant erläutert. Dabei wird nicht auf Ordner in der Projektstruktur eingegangen, die nicht für das Projekt aktiv verwendet wurden. Beispielsweise wurden `assets` und `public` nicht für die Entwicklung des Projekts benötigt aber vollständigkeitshalber nicht aus dem Projekt entfernt. Weitere Dateien, wie die `package*.json` Dateien und diese `README.md` Datei wurden aus Platzgründen ausgelassen. Die `package.json` definiert dieses NodeJS Projekt und stellt beispielsweise alle verwendeten Bibliotheken und ihre Versionen dar.

```bash
momments-frontend/
├── entrypoints         # Jeglicher Projektcode für die Extension
│   └── content         # Eingangspunkt für content-scripts
│       ├── index.tsx   # Injektion des restlichen Codes des Momments Projekts durch die Extension
│       ├── App.tsx     # Letztendlicher Eingangspunkt für die Geschäftslogik des Momments Projekts
│       ├── main.css    # Globale Styles
│       ├── store.ts    # SolidJS Store
│       ├── components  # Sammlung jeglicher UI Komponenten
│       ├── services    # Sammlung jeglicher Services für die Verwendung des Backends (und Logik für Referenzsongeinbettung)
│       └── utils       # Hilfsdateien, wie ein HTTP-Client und das Blockieren von Keyboard-Shortcuts
├── example.env         # Template für benötigte .env Datei
├── globals.d.ts        # Globale Typdefinition für verbesserte Einbindung von Bibliotheken ohne TypeScript Unterstützung
├── lib                 # Sammlung weiterer nicht-npm Module
│   └── wavesurfer-multitrack   # Modifiziertes wavesurfer-multitrack Projekt
├── tsconfig.json       # Konfiguration von TypeScript
└── wxt.config.ts       # Konfiguration von WXT (Framework für verbesserte Extension Entwicklung)
```

## Abhängigkeiten
Hier werden Abhängigkeiten aufgelistet, die nicht über die `package.json` Datei direkt einsehbar sind. Für Bibliotheksabhängigkeiten sollte die `package.json` Datei konsultiert werden.

* Für das Projekt wurde die NodeJS Version 22.11.0 verwendet
* Das Projekt benötigt den [Google Chrome](https://www.google.com/intl/de_de/chrome/) Browser in der Version `136.0.7103.114` oder höher, da Browser-APIs verwendet wurden, die zum Zeitpunkt dieses schreibens (Mai 2025) nur in Chromium Browsern implementiert waren (bspw. [Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API) und [CSS Anchoring](https://developer.mozilla.org/en-US/docs/Web/CSS/anchor).
* Zudem wird eine Modifizierte Variante von [wavesurfer-multitrack](https://github.com/katspaugh/wavesurfer-multitrack) verwendet, die [hier](https://github.com/robinduerhager/wavesurfer-multitrack/tree/momments-patches) gefunden werden kann. Die Änderungen finden sich in dem Branch `momments-patches`. Diese Patches müssen als build in `momments-frontend` im Ordner `lib/wavesurfer-multitrack` hinterlegt werden.