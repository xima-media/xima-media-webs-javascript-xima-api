XIMA Javascript API
===================

Nutzungshinweise
----------------
Nach dem Herunterladen sollte `npm install && bower install` ausgeführt werden.
Entwickler nutzen danach `grunt` und für ein "fertiges" Resultat `grunt prod`.

Entwicklerhinweise
------------------

### Module ###
Bestandteile und Features der API sollten als Module im Namespace "XIMA.api" registriert werden.
Dazu im Verzeichnis `/Source/js/modules` eine JS-Datei pro Modul anlegen und das Modul-Objekt anhängen: `XIMA.api.moduleName`. 
Zur Entwicklung eines Modules bietet sich das [Revealing Module Pattern](http://molily.de/js/organisation-module.html#revealing-module) an.

### Build ###
Für den Build-Prozess wird Grunt verwendet.
Alle wichtigen Dateien für ein Projekt landen im Verzeichnis /dist.
Vor jedem Build-Prozess wird dieses Verzeichnis geleert.
Folgende Befehle stehen zur Verfügung:

- `grunt` - Geeignet zur Entwicklungszeit (kein Minifizieren, kein Zusammenfassen, Beobachtungsmodus)
- `grunt dev` - Einfaches Kopieren der Dateien in das /dist -Verzeichnis.
- `grunt prod` - Zusammenfügen und Minifizieren der Dateien. Geeignet für Produktiv-Umgebungen.
