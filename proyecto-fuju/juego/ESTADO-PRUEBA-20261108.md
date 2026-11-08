# Experimento FUJU con AUTOFABRICADOR — 2026-11-08

## Resultado comprobado

**Prototipo R1 jugable en navegador, separado de la fabricación autónoma del motor.** La novela y documentación canónica preceden a este experimento; el motor web, el pegamento de escenas, las recetas de puzles y la interfaz del juego han sido elaborados durante esta conversación y probados, pero **NO fueron generados íntegramente por la IA interna de AUTOFABRICADOR**. Las referencias de código de `r1-src/` permiten reproducirlo. El ZIP `FUJU_JUEGO_JUGABLE_R1.zip` es la entrega portable completa.

- Contenido canónico: 8 capítulos, 24 escenas, 19 puzles, 123 hotspots, 48 nodos de diálogo y 2 finales.
- Laboratorio Chromium: **135/135 comprobaciones**; recorre las 24 escenas, resuelve 19 acertijos y alcanza ambos finales. Resultado original: `r1-src/qa/browser-results.json`.
- Host Windows con Chrome y Playwright 1.56.1: **23/23 comprobaciones**; URL `file://`, escenas, un acertijo real, inventario, almacenamiento local, recarga/reanudación y bloqueo de red; evidencia `r1-src/qa/host-chrome-readback.json`.
- ZIP R1 SHA256: `058e8fb592c7fe92d8a18cce56277f277803656c430da4515b144054074e17ea`.
- Restauración ZIP original en Windows: CRC, cobertura y hashes de manifiesto y readback PASS, evidencia `r1-src/qa/host-extract-readback.json`.
- Ruta local de esta prueba (no obligatoria para jugar en otra máquina): `D:\AUTOFABRICADOR-RESCATE\FUJU-GAME-TEST-20261108\UNPACKED-R1\FUJU-JUEGO-JUGABLE-R1\index.html`.

## Prueba **real** de AUTOFABRICADOR original

Producto: `C:\AUTOFABRICADOR`, CLI versión 0.9.17. Familia completa `game-2d`: `BLOCKED_NOT_ROUTABLE` (falta motor generador, scene graph, render/input/QA con aceptación original para juegos arbitrarios). Existe prueba anterior R83F de juego robótico acotado; no demuestra fábrica universal.

**Intento 1 — FAILED.** Encargo `FC-005b88fedb044dc4`, job de fuente `RJ-9ac71087da8a4a48`, 40 casos originales de aceptación congelados antes del código. CUDA7B generó dos módulos ESM erróneos con máscaras acumulativas para varios capítulos. Prueba WASI **28/40**; segundo intento devolvió código idéntico; resultado `STAGNATED_IDENTICAL_SOURCE`, **sin reejecutar el intento incierto**.

**Intento 2 — PASS acotado.** Nuevo encargo independiente de reparación `FC-3d98a854d33b4128`, job `RJ-12d52c7a90e047d1`, fuente base intencionadamente errónea y 40 criterios originales independientes. La IA CUDA7B corrigió `requiredMask(chapter)` y `chapterCleared(chapter,solvedMask)` en dos módulos ESM tras 3 intentos. Resultado original `PASS_SCOPED_WASI_BROWSER_OFFLINE`, **40/40 WASI y 40/40 Chrome offline**; `repo-verify` = `PASS`; `factory-status` con `resultReceiptSha=99f490ed8b754f5382c4a87d4ef69c122db4f6b0fce1fbc8dc5f2e271133468e`.

- SHA256 del archivo exportado directamente por AUTOFABRICADOR: `ae8ff6237516a991a8070451b0cb964677a240ad11afe731f60a804b865bb514`.
- Entrega original del componente: `autofabricador-ai/AF-REPO-RJ-12d52c7a90e047d1.zip`.
- Fuente real admitida por IA: `autofabricador-ai/accepted-source.json`.
- Contrato y casos: `autofabricador-ai/owner-source.json`.
- Resultado original exportado: `autofabricador-ai/verified-result.json`.

**La pieza fabricada por IA se ha conservado separada** del prototipo R1 y NO se afirma que el juego R1 esté ya usando ese módulo. Tampoco se ha instalado un servicio ni alterado AUTOFABRICADOR PROD/ACTIVE/BOOT, MMC ni terceros.

## Hitos

- M1 Construcción: PASS del prototipo independiente y PASS acotado de 2 módulos generados por fábrica; juego entero por fábrica, **BLOCKED**.
- M2 Integración y conservación: PASS GitHub del ZIP, fuentes, contratos y recibos legibles.
- M3 Pruebas: PASS acotado (135 navegador laboratorio, 23 Chrome Windows, 40 originales WASI y Chrome para módulo). No hay prueba de usuario de 2 horas.
- M4 Autorización protegida: NOT_APPLICABLE; no se realizó instalación con privilegios.
- M5 Entrega portable: PASS de ZIP, CRC, SHA y extracción en Windows.
- M6 Aceptación total: BLOCKED hasta ensayos de juego final y hardware independiente, gráficos/audio finales, y fabricación E2E integral por el propio AUTOFABRICADOR.

## Para jugar

Descargar y extraer `FUJU_JUEGO_JUGABLE_R1.zip`; abrir `index.html` del directorio extraído con Chrome o Edge. En `r1-src/` están los archivos web sueltos equivalentes. El juego usa ilustraciones vectoriales provisionales, no imágenes definitivas ni banda sonora final. Contiene spoilers al jugar, pero no se revela la trama en este informe.

## Próxima acción

Ampliar AUTOFABRICADOR con una ruta de producción de juegos narrativos 2D de múltiples archivos y pruebas E2E originales, capaz de construir **todos** los componentes del juego desde el canon, no solo lógica pura. Integrar gradualmente componentes realmente aceptados mediante nuevos paquetes CAS y pruebas de regresión de usuario. No promover candidatos a ACTIVE sin aceptación completa.
