# EL ANDÉN DE LOS NOMBRES QUE FALTAN

**Entrega creativa y de diseño para AUTOFABRICADOR · 8 de noviembre de 2026**

## Si vais a jugar sin saber qué pasa

Leed **solo la novela** si queréis descubrir toda la historia como lectores. Si preferís experimentar primero la aventura sin conocer los giros, no leáis todavía ni la novela ni el material técnico: ambos incluyen el final. Este README es el único archivo seguro para quien no quiera spoilers.

## Índice de entregables

- `exportaciones/EL_ANDEN_NOVELA.pdf`: **205 páginas reales**, edición de bolsillo A6 (105 × 148 mm), fuente de lectura amplia. Alrededor de **21.684 palabras**; por extensión textual es una **novela corta**, no equivale a una novela de 200 páginas en formato grande habitual. No se han insertado páginas en blanco para inflar el total.
- `exportaciones/EL_ANDEN_NOVELA.docx`: versión editable del mismo relato.
- `exportaciones/EL_ANDEN_NOVELA.epub`: edición digital fluida para lectores electrónicos (la paginación varía según dispositivo).
- `novela/NOVELA-COMPLETA.md`: texto fuente editable y sus 16 componentes de capítulos/expansiones.
- `tecnico/HANDOFF-AUTOFABRICA.md`: instrucciones de arquitectura, narrativa, pruebas y fabricación.
- `tecnico/DOSSIER-CANON-COMPLETO.md`: documento de producción **con todos los spoilers** y un desglose humano de cada escena, puzle y diálogo base.
- `canon/game-bible.json`: fuente de verdad estructurada, 8 capítulos, 24 escenas, 19 puzles con 3 pistas por cada uno, 15 personajes y 14 objetos.
- `tecnico/scenes-interactions.json`: 123 hotspots repartidos entre 24 escenas, con IDs y contratos para arte intercambiable; **no contiene hitboxes finales**, pendientes del arte.
- `tecnico/dialogues-v1.json`: 48 nodos y 152 líneas de referencia: **base, no guion completo de juego publicado**.
- `tecnico/assets-contract.json`: capas, paletas y tamaños de arte previstos.
- `qa/CONTENIDO-RESULTADOS.json`: verificación estática original del paquete con métricas; **no prueba el juego ejecutable**.
- `MANIFEST-SHA256.json`: hashes SHA256 de todos los archivos del paquete (excluido el propio manifiesto).

## Orden recomendado para que una fábrica construya el juego

1. Ingerir los cuatro contratos JSON y los documentos del directorio `tecnico/` preservando los IDs.
2. Ampliar los diálogos completos y bifurcaciones que faltan, crear arte y audio originales por archivo sustituible.
3. Implementar motor gráfico offline, inventario, condiciones y acciones, rutas entre escenas, pistas, accesibilidad y guardado de estado; NO usar el menú de la fábrica como motor de ejecución del juego.
4. Probar los 19 puzles, las 2 rutas finales, todos los estados de guardado y las vías de recuperación, además del empaquetado para Windows/web local.
5. Registrar recibos M1–M6; no declarar instalación ni funcionalidad E2E sin su evidencia.

## Límites verificados

La referencia pública R76 del repositorio AUTOFABRICADOR proporciona demos web y un Canvas 2D, **no un generador autónomo de aventuras completo**. En esta entrega están escritos la novela y el material de especificación; **el videojuego todavía no está implementado**. No se ha modificado el repositorio, ni instalaciones Host, ni MMC5.5 PROD. El paquete es una orden creativa y técnica de construcción, no un juego jugable. La duración prevista de 90–120 minutos debe medirse mediante pruebas reales una vez desarrollado.

## Originalidad

La obra mantiene ideas narrativas solicitadas por los autores, pero todos los personajes, lugares, guion y diálogos son propios. No incorpora personajes ni diseños protegidos de las franquicias usadas como inspiración.