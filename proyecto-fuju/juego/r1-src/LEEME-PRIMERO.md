# EL ANDÉN DE LOS NOMBRES QUE FALTAN — PRUEBA JUGABLE

**Qué es:** prototipo interactivo offline para ordenador basado en la historia original del proyecto FUJU. No es el arte final ni el videojuego completo de duración objetivo. La aventura empieza desde su portada y tiene un recorrido jugable por los ocho capítulos, 24 escenas, 19 acertijos, 123 puntos de interacción, 48 nodos de diálogo y dos posibles finales. Los acertijos se resuelven mediante acciones secuenciales; la mayoría todavía necesitan interacción ambiental más profunda para alcanzar la experiencia final de los noventa.

## Para jugar

1. Extrae el ZIP completo a una carpeta local.
2. Abre `index.html` con Chrome o Edge (doble clic). Si prefieres, usa `INICIAR_JUEGO.cmd`, que solo abre el navegador y no instala nada.
3. Pulsa «Empezar la aventura» y haz clic en el paisaje y en los botones de la interfaz. Los objetos se guardan en el abrigo.
4. En cada escena con misterio abre el acertijo, selecciona acciones en el orden correcto y, cuando se desbloquee, pulsa «Continuar».
5. El progreso se guarda **solo en el navegador** mediante `localStorage` cuando el navegador lo permite. No borres los datos de ese navegador si quieres conservarlo.

No necesita instalación, servicios, conexión, cuenta, permisos de administrador, modelos de IA ni acceso a AUTOFABRICADOR. No arranca con Windows. El sonido sintético original es opcional y comienza apagado.

## Procedencia y alcance real

- Los datos de historia, personajes, 24 escenas, 19 puzles, 123 hotspots y 48 diálogos provienen de `FUJU_ENTREGA_COMPLETA.zip` (SHA-256: `4e0074c0943893ce08744730c2ca2dee152df3a6c72c12ccc9d4ec4d44fd4c90`). Se copiaron sin reescribir el canon.
- Se han programado *separadamente* el renderizado vectorial temporal, los controles, los acertijos interactivos, inventario, diálogos, guardado y finales. No atribuir estos archivos a generación autónoma por AUTOFABRICADOR.
- Se utilizó AUTOFABRICADOR 0.9.17 en el PC original para intentar generar una función ESM de desbloqueo por capítulo. Su operación `FC-005b88fedb044dc4` quedó `FAILED_REPO` y el repo job `RJ-9ac71087da8a4a48` quedó `STAGNATED_IDENTICAL_SOURCE`. Pasó 28/40 casos en WASI y falló 12. **No se integró código fallido en este juego**. No se reejecutó el mismo job.
- La prueba principal en Chromium del motor del prototipo pasó 135/135 comprobaciones automáticas con los 19 puzles, ocho capítulos y ambos sistemas de progreso narrativo. La QA se ejecutó con scripts inyectados en un documento aislado debido a una política de administración del navegador de laboratorio; eso no equivale todavía a aceptación en otro PC ni demuestra la carga `file://` de los cuatro scripts como archivos independientes.
- **Pendiente para una edición final:** fondos y sprites ilustrados de calidad, animaciones por personaje, locuciones/música completa, conversaciones ramificadas profundas, puzles con más de una mecánica, pruebas de duración de 90-120 minutos, accesibilidad exhaustiva y aceptación en hardware independiente.

## Estructura

- `index.html`: entrada offline.
- `styles.css`: aspecto visual independiente.
- `game.js`: motor de escenas y estado.
- `data.js`: canon, interacciones y diálogos originales incrustados para funcionar sin servidor.
- `recipes.js`: definición separada de las acciones interactivas de 19 puzles; no sustituye el canon.
- `qa/browser_test.py`: prueba automática de flujo (opcional, requiere Playwright/Chromium fuera del paquete jugable).
- `qa/browser-results.json`: recibo de prueba del entorno de laboratorio.
- `MANIFEST-SHA256.json`: hashes del artefacto.

**Importante:** este juego contiene SPOILERS. No abras el código ni las recetas si quieres descubrir la historia durante el juego.
