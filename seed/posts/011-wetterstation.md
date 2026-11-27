---
nr: 11
title: Eine Wetterstation aus Restteilen
section: projekt
date: 2026-09-29
summary: Ein Sensor, ein alter Mikrocontroller und eine Woche Messwerte vom Balkon.
placeholder: true
drawing: wetterstation
drawingIdea: Die Brotdose mit Lüftungslöchern auf dem Balkon.
---

In einer Kiste lagen ein Temperatursensor, ein Mikrocontroller aus einem früheren Projekt und ein Netzteil, das zu nichts mehr gehörte. Daraus wurde eine Wetterstation für den Balkon.

![Temperatur auf dem Balkon über eine Woche, gemessen alle zehn Minuten (Beispieldaten)](/images/wetterstation-messwerte.svg)

## Aufbau

Der Sensor misst alle zehn Minuten und schickt den Wert über das WLAN an einen kleinen Server in der Wohnung. Das Gehäuse ist eine Brotdose mit Lüftungslöchern.

![Schaltung: Sensor, Mikrocontroller und Netzteil (Skizze)](/images/wetterstation-schaltung.svg)

## Was nicht funktioniert hat

Die Sonne. In der ersten Woche zeigte die Station mittags 41 Grad, weil die Brotdose in der Sonne stand. Jetzt hängt sie im Schatten.
