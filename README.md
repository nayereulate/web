# Nayer | Eulate — web

Sitio estático (HTML/CSS/JS, sin build). Se despliega automáticamente con cada push a
`main` en Vercel (dominio principal: https://nayer.dev) y en GitHub Pages
(https://nayereulate.github.io/web/). Las URL canónicas apuntan a nayer.dev.

## Dos experiencias

El `index.html` es un portal con dos puertas:

| Experiencia | Para quién | Estilo | Páginas |
|---|---|---|---|
| **Comunidad** | Seguidores | Retro synthwave / pixel art | `landing.html` |
| **Nayer Studio** | Clientes | Profesional, con acentos pixel | `studio/*.html` |

### Comunidad (`landing.html`)
Redes, biografía, lo que construyo (con filtro por tecnología), releases sincronizados con
GitHub, sección para apoyar con QR y acceso a Discord.

### Nayer Studio (`studio/`)
| Archivo | Qué es |
|---|---|
| `studio/index.html` | Inicio: servicios, por qué el estudio, proceso, casos, fundador, FAQ |
| `studio/software.html` | Servicios de desarrollo, planes Esencial / Profesional / A medida, casos, stack |
| `studio/contenido.html` | Servicios para creadores, formatos para marcas, plataformas |
| `studio/cotizar.html` | Cotizador en 5 pasos con estimación en vivo, envío por WhatsApp o Telegram |
| `studio/contacto.html` | Canales directos y mensaje rápido |

`servicios.html`, `software.html`, `contenido.html` y `contacto.html` en la raíz son
redirecciones a `/studio` para no romper enlaces antiguos. `404.html` ofrece las dos puertas.

## Configuración de contacto

Todo el contacto del Studio sale de **`js/studio/config.js`**: número de WhatsApp, enlace de
Telegram (por defecto abre el chat por número; cámbialo por `https://t.me/TU_USUARIO` si
tienes usuario), perfil de Workana, formas de pago y rangos de presupuesto del cotizador.

`vercel.json` define el atajo **nayer.dev/workana** hacia el perfil de Workana (solo en Vercel).

## Estilos y scripts

**Compartidos**
- `js/icons.js`: sprite de íconos SVG (`<svg class="i"><use href="#i-code"/></svg>`); va primero en `<body>`
- `js/ui.js` + `css/ui.css`: buscador Ctrl+K (comandos distintos en cada experiencia), toasts,
  modo ligero y código Konami
- `js/github.js`: datos en vivo de la API de GitHub con caché de 1 h

**Comunidad (retro)**
- `css/base.css`: tokens, fondo synthwave, botones, avatar e íconos
- `css/home.css` + `js/home.js`: portal (skyline, ventanas flotantes, puertas)
- `css/layout.css` + `js/site.js`: barra superior, secciones, filtros, donaciones
- `css/about.css`: redes, proyectos, releases, apoyo
- `js/background.js`, `js/effects.js`, `js/releases.js`

**Nayer Studio (profesional)**
- `css/pro.css`: sistema de diseño del Studio (Space Grotesk + JetBrains Mono, acentos pixel)
- `js/studio/config.js`: datos de contacto y helpers de envío
- `js/studio/pro.js`: menú, header, apariciones, enlaces de contacto
- `js/studio/quote.js`: cotizador (validación, borrador, referencia, estimación, envío)
- `js/studio/contact.js`: mensaje rápido

## Funciones

- **Cotizador**: 5 pasos, estimación de plan y plazo en vivo, referencia `NS-AAMMDD-XXXX`,
  borrador automático, envío por WhatsApp (texto precargado) o Telegram (se copia y abre el
  chat), copiar o descargar el resumen. Acepta `?servicio=`, `?nivel=` y `?formato=`.
- **Ctrl+K o `/`**: buscador para navegar, abrir redes o contactar.
- **Datos en vivo**: versiones, archivos de descarga, lenguajes y último push salen de GitHub.
- **Modo ligero**: el botón "EFECTOS" del footer de la comunidad apaga animaciones pesadas.
- ↑↑↓↓←→←→BA

## Tareas comunes

- **Nuevo proyecto:** copia un `<article class="project-card">` en `landing.html#creaciones`
  y agrega el caso en `studio/software.html#casos` y `studio/index.html#casos`.
- **Nuevo release:** publícalo en GitHub y la web lo muestra sola. Para una app nueva,
  agrega un objeto (con `repo`) al inicio de `window.RELEASES` en `js/releases.js`.
- **Ícono nuevo:** agrega un trazo SVG 24x24 al objeto `line` de `js/icons.js`.
- **Calibrar la estimación del cotizador:** pesos, planes y días por punto al inicio de `js/studio/quote.js`.
