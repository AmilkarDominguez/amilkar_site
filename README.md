# Amilkar Dominguez — Portafolio

Portafolio digital personal construido con **Astro 6**, **TypeScript estricto** y **SCSS** puro. Reemplaza el sitio anterior en Angular 14 con un enfoque de performance-first, zero JS por defecto y estética cyberpunk.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Astro 6 (build estático, content collections) |
| Lenguaje | TypeScript strict (`noUncheckedIndexedAccess: true`) |
| Estilos | SCSS + CSS custom properties (sin Tailwind ni UI kits) |
| Animaciones | GSAP 3 (terminal loader) + CSS puro (glitch, scanlines) |
| Contenido | Content Collections con schemas Zod |
| Highlighting | Shiki (integrado en Astro, zero runtime) |
| Paquetes | pnpm con versiones fijas (sin `^` ni `~`) |
| Hosting | Cloudflare Pages (estático, CDN global) |

---

## Comandos

```bash
pnpm dev        # Servidor de desarrollo en localhost:4321
pnpm build      # Build de producción → dist/
pnpm preview    # Previsualización del build en localhost:4321
```

---

## Estructura

```
/
├── public/
│   ├── fonts/              # Fuentes WOFF2 self-hosted (ver sección Fuentes)
│   ├── og-default.svg      # OG image base (exportar a og-default.png para producción)
│   ├── favicon.svg
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── effects/        # TerminalLoader, GlitchText, Scanlines
│   │   ├── layout/         # Header, Footer
│   │   ├── posts/          # PostCard, PostList, TagBadge
│   │   └── projects/       # ProjectCard, ProjectGrid
│   ├── content/
│   │   ├── projects/       # Un .md por proyecto
│   │   └── posts/          # Un .md o .mdx por post
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── PostLayout.astro
│   │   └── ProjectLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── 404.astro
│   │   ├── proyectos/[slug].astro
│   │   ├── blog/[slug].astro
│   │   ├── sobre-mi.astro
│   │   └── rss.xml.ts
│   ├── styles/
│   │   ├── tokens.scss     # Variables CSS (colores, espaciados, tipografía)
│   │   ├── fonts.scss      # @font-face declarations
│   │   ├── reset.scss      # Reset moderno (Andy Bell)
│   │   ├── animations.scss # @keyframes globales
│   │   └── global.scss     # Estilos base del sitio
│   └── lib/
│       └── utils/          # Helpers puros (formatDate, etc.)
├── astro.config.mjs
├── tsconfig.json
├── CLAUDE.md               # Contexto completo para IA — leer antes de colaborar
└── pnpm-lock.yaml
```

---

## Fuentes (configuración necesaria)

Las fuentes están declaradas en `src/styles/fonts.scss` pero los archivos WOFF2 **no se incluyen en el repositorio** — deben descargarse y colocarse en `public/fonts/`:

| Fuente | URL de descarga | Nombre de archivo esperado |
|---|---|---|
| JetBrains Mono Variable | [Releases en GitHub](https://github.com/JetBrains/JetBrainsMono/releases) → `fonts/webfonts/` | `public/fonts/JetBrainsMono.woff2` |
| JetBrains Mono Italic Variable | Mismo release | `public/fonts/JetBrainsMono-Italic.woff2` |
| Orbitron Variable | [Google Fonts](https://fonts.google.com/specimen/Orbitron) → Download family | `public/fonts/Orbitron.woff2` |

Sin los archivos, el navegador usa los fallbacks del sistema (`ui-monospace, monospace`). El build no falla.

Para preloading óptimo, el archivo `JetBrainsMono.woff2` debe coincidir exactamente con el nombre referenciado en `src/layouts/BaseLayout.astro`.

---

## OG Image

El archivo `public/og-default.svg` es el diseño base de la imagen social. Las redes sociales no leen SVG como OG image — para producción hay que exportarlo como PNG en **1200×630 px**:

1. Abrí `public/og-default.svg` en Figma, Inkscape, o similar.
2. Exportalo como `public/og-default.png` (1200×630, PNG).
3. El `<meta property="og:image">` ya apunta a `/og-default.png`.

Para OG images específicas por post o proyecto, completá el campo `ogImage` en el frontmatter del archivo de contenido (ruta relativa a `public/`).

---

## Agregar contenido

### Nuevo proyecto

Creá `src/content/projects/nombre-kebab.md`:

```markdown
---
title: "Nombre del proyecto"
description: "Descripción breve"
pubDate: 2026-06-17
tags: ["tag1", "tag2"]
stack: ["TypeScript", "Astro"]
repo: "https://github.com/usuario/repo"
demo: "https://demo.ejemplo.com"
featured: true
draft: false
---

Contenido en Markdown...
```

### Nuevo post de blog

Creá `src/content/posts/nombre-kebab.md` (o `.mdx` para embeber componentes):

```markdown
---
title: "Título del post"
description: "Descripción breve"
pubDate: 2026-06-17
tags: ["typescript", "web"]
draft: false
---

Contenido en Markdown...
```

### Imágenes

Cuando agregues imágenes a proyectos o posts, usá el componente `<Image>` de Astro (`astro:assets`) para obtener optimización automática (WebP/AVIF, lazy load, dimensiones). Colocá las imágenes en `src/assets/` para que Astro las procese.

---

## Deploy en Cloudflare Pages

1. Creá un nuevo proyecto en [Cloudflare Pages](https://pages.cloudflare.com/) y conectalo al repositorio.
2. Configuración de build:
   - **Build command:** `pnpm build`
   - **Output directory:** `dist`
   - **Environment variable:** `NODE_VERSION` = `22`
3. En **Custom domains**, conectá `amilkardominguez.com`.

Cloudflare Pages sirve automáticamente `404.html` (generado desde `404.astro`) como página de error.

### Alternativa: Netlify

1. Conectá el repositorio en Netlify.
2. Configuración de build:
   - **Build command:** `pnpm build`
   - **Publish directory:** `dist`
3. Creá `netlify.toml` en la raíz para fijar la versión de Node:

```toml
[build]
  command = "pnpm build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22"
```

---

## Convenciones y decisiones

Toda la documentación de convenciones, estética, roadmap, disciplina de dependencias y reglas para colaboradores (incluyendo IA) está en **`CLAUDE.md`**. Leer ese archivo antes de proponer cambios.

---

## Licencia

Código fuente disponible para referencia. El contenido (posts, proyectos, textos) es de Amilkar Dominguez.
