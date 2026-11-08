# JUEGO DEL MENÚ — aventura FUJU

Una aventura gráfica original de fantasía, investigación y puzles, creada como proyecto independiente para probar AUTOFABRICADOR. Contiene novela y un prototipo offline de navegador con 8 capítulos.

## Jugar ahora

**[Descargar prototipo R1](proyecto-fuju/juego/FUJU_JUEGO_JUGABLE_R1.zip)**. Extrae el ZIP y abre `index.html` en Chrome o Edge. No requiere servidor ni Internet. El progreso se guarda localmente en el navegador.

- [Código fuente del prototipo](proyecto-fuju/juego/r1-src/)
- [Prueba real y estado de AUTOFABRICADOR](proyecto-fuju/juego/ESTADO-PRUEBA-20261108.md)
- [Componente generado y aceptado por la IA local](proyecto-fuju/juego/autofabricador-ai/)
- [Novela completa](proyecto-fuju/novela/NOVELA-COMPLETA.md)
- [Handoff para la fábrica](proyecto-fuju/tecnico/HANDOFF-AUTOFABRICA.md)
- [Entrega original de 37 archivos](proyecto-fuju/FUJU_ENTREGA_COMPLETA.zip)
- [Instrucciones de recuperación](proyecto-fuju/LEEME-PRIMERO.md)

## Resultados y alcance

El prototipo R1 tiene 24 escenarios, 19 puzles, diálogos, inventario, guardado/reanudación y 2 desenlaces. La prueba de laboratorio contabiliza 135/135 comprobaciones superadas; un ensayo adicional en Chrome en el equipo Windows del proyecto superó 23/23. El arte es provisional y no hay banda sonora final.

**AUTOFABRICADOR NO generó el videojuego entero:** en una prueba con Qwen CUDA7B, el primer intento falló 12/40 casos; un segundo encargo de reparación acabó aceptado con 40/40 casos en WASI y Chromium para un **componente independiente de lógica de capítulos**. El resultado está archivado con fuentes, ZIP original y recibos. La fabricación autónoma de una aventura completa y la validación de hardware independiente siguen pendientes.

## Precaución

La documentación técnica incluye spoilers y soluciones a los acertijos. El repositorio no modifica automáticamente el menú original, MMC, servicios de Windows, BOOT ni instalaciones protegidas. Visibilidad pública no equivale a licencia de redistribución.
