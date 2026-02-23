# Dashboard estático - Demo rápido

Este proyecto es una versión estática y funcional del dashboard mostrado en la imagen: sidebar, topbar, tarjetas KPI, gráfico principal y ranking.

Contenido:
- index.html
- styles.css
- script.js

Requisitos:
- Navegador moderno (Chrome/Firefox/Edge/Safari).
- No requiere servidor, pero puedes servirlo con un servidor estático si prefieres:
  - Node: `npx http-server . -p 8080`
  - Python 3: `python -m http.server 8080`

Qué hace:
- Muestra KPIs calculados a partir de datos mock.
- Gráfica principal con Chart.js (pestañas Sales/Visits).
- Selector de rango de fechas (filtra por años presentes en los mocks).
- Lista de ranking con números de ejemplo.

Cómo personalizar:
- Reemplaza la sección `mock` en `script.js` con tus datos o llama a una API y actualiza `updateKPIs`, `buildMainChart` y `renderRanking`.
- Para datos reales, añade fetch() en la inicialización y reconstruye las estructuras de datos.
- Si quieres, puedo convertir esto a un proyecto React/Vue o añadir un backend.
