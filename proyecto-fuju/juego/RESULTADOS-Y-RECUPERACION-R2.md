# FUJU — Resultado de la prueba AUTOFABRICADOR R2 (2026-11-08)

**ESTADO: PROTOTIPO JUGABLE R2 VERIFICADO — NO ES JUEGO FINAL NI FABRICACIÓN AUTÓNOMA UNIVERSAL.**

## Cómo jugar

1. Descargar [FUJU_JUEGO_JUGABLE_R2.zip](./FUJU_JUEGO_JUGABLE_R2.zip).
2. Extraer todo el ZIP sin modificar la estructura.
3. Abrir `FUJU-JUEGO-JUGABLE-R2/index.html` con Chrome o Edge.
4. Pulsar «Empezar la aventura». Los progresos se guardan únicamente en el navegador.

No necesita conexión a Internet, instalación ni servicios en segundo plano. El ZIP contiene imágenes provisionales y fuentes propias. La carpeta `r2-src/` muestra el contenido principal sin tener que extraer el paquete.

## Evidencias verificadas

| Fase | Resultado |
| --- | --- |
| Paquete narrativo de referencia | `proyecto-fuju/FUJU_ENTREGA_COMPLETA.zip`, SHA-256 `4e0074c0943893ce08744730c2ca2dee152df3a6c72c12ccc9d4ec4d44fd4c90` |
| Prototipo anterior R1 | 24 escenarios, 19 puzles; 135/135 comprobaciones en laboratorio; 23/23 adicionales en Windows |
| AUTOFABRICADOR, primer intento | `FC-005b88fedb044dc4`; `RJ-9ac71087da8a4a48`; FAILED_REPO / STAGNATED_IDENTICAL_SOURCE; 28/40 pruebas |
| AUTOFABRICADOR, corrección | `FC-3d98a854d33b4128`; `RJ-12d52c7a90e047d1`; 3 intentos, `PASS_SCOPED_WASI_BROWSER_OFFLINE`; 40/40 casos independientes en WASI y Chromium |
| Componente integrado | `r2-src/factory-gate.js`, derivado por transformación **solo sintáctica** del código generado por la IA y aceptado por los tests originales |
| Prototipo R2 | 24 escenarios, ocho capítulos, 19 puzles; 188/188 verificaciones independientes en Chrome Windows; cero errores JS y cero peticiones de red |
| Lectura posterior del ZIP publicado | SHA-256 coincide, CRC correcto y 15/15 archivos de contenido comprobados contra MANIFEST-SHA256.json |

### Huellas e identificadores

- ZIP R1 SHA-256: `058e8fb592c7fe92d8a18cce56277f277803656c430da4515b144054074e17ea`.
- ZIP R2 SHA-256: **`ff5ad6eda983dd8465048647eac60328079637e99a8a743bee0ffe42cc92a20c`**.
- Git blob R2: `40f6c3f39b0db65566f62fa5dee542e2f85adb79`.
- Source JSON original aceptado por la IA, SHA-256: `67e604bf6e726b2265e34e94998c28c1601c3520312958fc7ab81d899cc1f5ab`.
- Recibo original de AUTOFABRICADOR, SHA-256: `99f490ed8b754f5382c4a87d4ef69c122db4f6b0fce1fbc8dc5f2e271133468e`.
- Archivo de salida de la fábrica: `C:\AUTOFABRICADOR\repoexports\AF-REPO-RJ-12d52c7a90e047d1.zip`, SHA-256 `ae8ff6237516a991a8070451b0cb964677a240ad11afe731f60a804b865bb514`.

El código de AUTOFABRICADOR se limita a **la compuerta de progresión entre capítulos**; la novela, las escenas, los acertijos y el motor de interfaz de R1 fueron integrados separadamente. Por tanto, **no** existe demostración de que AUTOFABRICADOR pueda producir de forma autónoma una aventura gráfica completa a partir de un handoff extenso.

## Archivos para reproducir y auditar

- `r2-src/`: fuentes individuales del prototipo.
- `r2-src/factory-provenance.json`: procedencia y hashes de la transformación.
- `r2-evidence/build_r2.py`: construcción determinista de la revisión R2.
- `r2-evidence/browser_qa_r2.js`: prueba E2E del juego y del módulo de IA con Playwright + Chrome real.
- `r2-evidence/R2-HOST-CHROME-READBACK.json`: 188 casos ejecutados y su resultado original.
- `r2-evidence/R2-BUILD-RECEIPT.json`: paquete, fuentes y hashes de origen.
- `FUJU_JUEGO_JUGABLE_R2.zip`: paquete portátil verificado.

### Aceptación por hitos

| Hito | Estado | Alcance real |
| --- | --- | --- |
| M1 Construcción | PASS | Prototipo web 2D R2 construido; **no** la versión artística/narrativa final |
| M2 Integración | PASS | Módulo CUDA7B aceptado integrado y fuentes publicadas, sin alterar producto original |
| M3 Pruebas | PASS | Chrome Windows E2E 188/188, además de 40/40 WASI y Chrome originales de la fábrica |
| M4 Autorización de instalación protegida | NOT_APPLICABLE | No hay instalación protegida |
| M5 Paquete portable | PASS | ZIP listo para extracción; ninguna instalación en Host |
| M6 Verificación de aceptación final | BLOCKED | Sin prueba en otro ordenador físico ni validación del arte/ritmo/guion como juego final |

**No modificar** MMC5.5/MMC7 ni instalar como servicio, no usar F:, no limpiar historiales ni relanzar jobs SUCCEEDED/UNKNOWN.

**NEXT_ACTION:** probar R2 manualmente como jugador; registrar feedback de dificultad, arte y ritmo; completar activos finales; someter al AUTOFABRICADOR a la creación de un juego nuevo de alcance completo con oráculos independientes y probarlo en otro equipo físico. El resultado actual R2 no se debe marcar como ACTIVE ni como factory universal.
