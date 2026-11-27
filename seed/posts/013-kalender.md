---
nr: 13
title: Ein Kalender, der nur gute Tage zählt
section: projekt
date: 2026-11-04
summary: Eine kleine Web-App, die jeden Abend eine einzige Frage stellt.
placeholder: true
---

Die Idee war einfach: jeden Abend eine einzige Frage beantworten. War heute ein guter Tag? Ja oder nein. Nach ein paar Monaten sollte daraus ein Bild entstehen.

## Wie es funktioniert

- Eine Seite, ein Knopf, eine Antwort pro Tag.
- Die Daten bleiben im Browser, nichts geht an einen Server.
- Am Monatsende zeigt ein Raster, wie viele gute Tage es waren.

Der Kern ist eine Handvoll Zeilen:

```js
const key = new Date().toISOString().slice(0, 10);
localStorage.setItem(`tag:${key}`, answer ? '1' : '0');
```

## Was ich gelernt habe

Die schwierigste Frage war nicht technisch: Was ist ein guter Tag? Ich habe mich entschieden, es nicht zu definieren.
