# Couples Timer Webapp

Ein webbasiertes Hilfstool für das strukturierte Zwiegespräch nach Möller. Das Projekt liegt im Ordner `couples-timer-web` und basiert auf React, TypeScript und Vite. Mehrsprachigkeit (Deutsch/Englisch) und eine konfigurierbare Sitzungslogik sind vorbereitet.

## Zweck
- Geführte Gesprächssessions für Paare mit vordefinierten oder eigenen Gesprächsphasen
- Visuelle Timer- und Sprecher-Anzeigen für die aktuelle Phase
- Optional einblendbare Leitfäden (Guidance-Tipps) je nach Gesprächsabschnitt

## Technologien
- **React 19 + TypeScript** (Vite als Build-Tool)
- **Tailwind CSS 4** (PostCSS mit `@tailwindcss/postcss`)
- **i18next** für Lokalisierung (DE/EN)
- **React Router** für spätere Navigation zwischen Modusauswahl, Session- und Builder-Seite

## Installation & Entwicklung
1. Voraussetzungen: Node.js 20+ und npm.
2. Abhängigkeiten installieren (im Projektordner `couples-timer-web`):
   ```bash
   npm install
   ```
3. Entwicklungserver starten:
   ```bash
   npm run dev
   ```
   Der Server läuft standardmäßig auf `http://localhost:5173`.
4. Produktionsbuild ausführen:
   ```bash
   npm run build
   ```

## Aktueller Entwicklungsstand
- **Implementiert:**
  - Domain-Layer mit Session-Engine, Phasen- und Modus-Modellen
  - Preset-Modi, Custom-Mode-Builder (UI, Validierung) und i18n-Struktur
  - Basis-Komponenten (Timer, Phasen-Indikator, Sprecher-Badges, Guidance-Tipps)
- **Bekannte Lücken:**
  - Die Haupt-App (`App.tsx`) bindet Router/Pages noch nicht ein; Navigation zur Session- oder Builder-Seite erfolgt daher nicht.
  - UI-Flows sind als Gerüst vorhanden, eine finale Gestaltung/UX-Optimierung steht aus.

## Vorschläge für die Weiterentwicklung
- Router in `App.tsx` integrieren (ModeSelectionPage → SessionPage → SequenceBuilderPage).
- Tests (z. B. Vitest/React Testing Library) für SessionEngine, TimerService und kritische UI-Flows ergänzen.
- Audio-Dateien einbinden und Guidance-/Timer-Events im UI visualisieren.
- Persistenz von Custom-Modes im Browser (localStorage) mit Benachrichtigung/Fehlerbehandlung in der UI verknüpfen.
- Verbesserte Barrierefreiheit (Keyboard-Navigation, ARIA-Labels) und Responsive-Design-Checks.
