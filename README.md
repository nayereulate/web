# Nayer | Eulate — web

Sitio estático (HTML/CSS/JS, sin build) publicado en Vercel:
https://nayer.dev/

## Páginas

| Archivo | Qué es |
|---|---|
| `index.html` | Hub de links (redes + accesos a Nayer Studio) |
| `landing.html` | Sobre mí, creaciones, releases y donaciones |
| `servicios.html` | Nayer Studio: divisiones, proceso y FAQ |
| `software.html` | Software Lab: servicios, niveles, casos y stack |
| `contenido.html` | Content Lab: servicios para creadores y colabs con marcas |
| `contacto.html` | Brief que arma el mensaje y lo abre en WhatsApp |
| `404.html` | Página "Game Over" para enlaces rotos |

## Estilos y scripts

- `css/base.css`: tokens de color, fondo synthwave, botones, avatar e íconos (todas las páginas)
- `css/ui.css`: paleta de comandos, toasts, interruptor de efectos (todas las páginas)
- `css/home.css`: solo `index.html` (skyline, ventanas flotantes, marquee)
- `css/layout.css`: barra superior, secciones, tarjetas, filtros y datos en vivo (páginas internas)
- `css/studio.css`: componentes de agencia (divisiones, niveles, estimador, FAQ, formulario)
- `css/about.css`: solo `landing.html` (proyectos, releases, widget de donación)
- `js/icons.js`: sprite de íconos SVG (`<svg class="i"><use href="#i-code"/></svg>`); va primero en `<body>`
- `js/ui.js`: paleta Ctrl+K, toasts, modo ligero, código Konami
- `js/github.js`: datos en vivo de la API de GitHub con caché de 1 h
- `js/background.js`, `js/effects.js`: fondo animado y micro-interacciones
- `js/home.js`: tagline, skyline, rayos del suelo, terminal y parallax del index
- `js/site.js`: menú móvil, progreso, volver arriba, filtros y donaciones
- `js/estimator.js`: estimador de proyecto (`software.html#estimador`)
- `js/contact.js`: brief con borrador automático y envío por WhatsApp
- `js/releases.js`: releases sincronizados con GitHub (los datos del archivo son el respaldo)

## Funciones

- **Ctrl+K o `/`** abre el buscador para navegar, abrir redes o ejecutar acciones.
- **Modo ligero**: el botón "EFECTOS" del footer apaga animaciones pesadas y se recuerda.
- **Datos en vivo**: versiones, archivos de descarga, lenguajes y último push salen de GitHub.
- **Estimador** → **brief**: la estimación se pasa al formulario de contacto ya escrita.
- ↑↑↓↓←→←→BA

## Tareas comunes

- **Nuevo proyecto:** copia un `<article class="project-card">` en `landing.html#creaciones`
  y, si aplica, un `case-card` en `software.html#casos`.
- **Nuevo release:** publícalo en GitHub y la web lo muestra sola. Para una app nueva,
  agrega un objeto (con `repo`) al inicio de `window.RELEASES` en `js/releases.js`.
- **Ícono nuevo:** agrega un trazo SVG 24x24 al objeto `line` de `js/icons.js`.
- **Nueva página:** copia `servicios.html`, cambia `<title>`, metas y `aria-current`,
  y agrégala al menú de todas las páginas y a `sitemap.xml`.
