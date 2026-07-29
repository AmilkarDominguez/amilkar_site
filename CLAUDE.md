# CLAUDE.md

> Contexto persistente del proyecto. Este archivo está dirigido a asistentes de IA (Claude) que colaboren en el desarrollo. Léelo completo antes de proponer cambios o generar código.

---

## 1. Resumen del proyecto

Portafolio digital personal de Amilkar Dominguez. Reemplaza el sitio actual (`amilkardominguez.com`, Angular 14, estático). El nuevo sitio debe:

- Servir como portafolio de proyectos (cada proyecto con su propia página de detalle).
- Incluir un blog de posts cortos escritos en Markdown (`.md` / `.mdx`).
- Tener una estética **cyberpunk** con animaciones **glitch** y un efecto de **terminal cargando** en la entrada.
- Ser **frontend puro** por ahora. Posiblemente integrar **Supabase** más adelante (comentarios, formularios, analytics ligero).
- Ser **escalable y mantenible** a largo plazo, sin lock-in fuerte a librerías externas.

---

## 2. Stack técnico

| Capa | Elección | Razón |
|---|---|---|
| Framework | **Astro 5** | Content collections nativas, zero JS por defecto, islas para interactividad puntual, agnóstico de UI framework. |
| Lenguaje | **TypeScript** (strict) | Tipado en componentes, en frontmatter de markdown vía Zod, y en utilidades. |
| Estilos | **CSS Modules** + **Sass (SCSS)** + variables CSS nativas | Scoping automático por componente, sin runtime, control total del diseño. **Sin Tailwind**. |
| Animaciones | **GSAP** (gratuito desde 2024) para timelines complejos. **CSS animations** puras para efectos simples (glitch, scanlines). **Three.js**, acotado al fondo 3D global (ver `.claude/rules-threejs.md`). | GSAP para la terminal y secuencias coreografiadas; CSS para microinteracciones; Three.js solo donde CSS/GSAP no alcanzan (profundidad 3D real). |
| Markdown | **MDX** vía `@astrojs/mdx` | Permite embeber componentes Astro/JS dentro de los posts (demos, callouts). |
| Syntax highlighting | **Shiki** (integrado en Astro) | Calidad de VSCode, sin runtime JS en el cliente. |
| Gestor de paquetes | **pnpm** | Resolución estricta, evita dependencias fantasma, más rápido. |
| Hosting | **Cloudflare Pages** o **Netlify** (estático) | Build estático, CDN global, gratis. |
| Backend (futuro) | **Supabase** | Cuando se necesite persistencia/auth. No integrar antes de tener un caso de uso real. |

### Librerías UI prohibidas

No usar: Tailwind, shadcn, Material UI, Bootstrap, DaisyUI, Chakra, ni ningún kit de componentes pre-hecho. Todo componente se construye desde cero con HTML semántico + CSS Modules.

### Librerías de animación adicionales aceptables

- `motion` (antes Motion One): alternativa ligera a GSAP (~5kb) para casos simples.
- `xterm.js`: solo si la terminal animada necesita comportamiento real de terminal (input interactivo). Para una animación visual de "tipeo" basta JS vanilla.
- `lenis` o similar para scroll suave: aceptable, pero evaluar si CSS `scroll-behavior` alcanza.
- `three`: excepción deliberada a la disciplina de dependencias — se usa **solo** para el fondo animado global (`ThreeBackground.astro`). No agregar escenas/canvases nuevos sin seguir `.claude/rules-threejs.md` (carga diferida, dispose, presupuesto de performance).

---

## 3. Estructura del proyecto

```
/
├── public/                      # Assets estáticos servidos tal cual (favicons, og images)
├── src/
│   ├── assets/                  # Imágenes optimizadas por Astro
│   ├── components/
│   │   ├── effects/             # TerminalLoader, GlitchText, Scanlines, etc.
│   │   ├── layout/              # Header, Footer, Nav
│   │   ├── projects/            # ProjectCard, ProjectGrid, ProjectMeta
│   │   └── posts/               # PostCard, PostList, TagBadge
│   ├── content/
│   │   ├── config.ts            # Schemas Zod de cada colección
│   │   ├── projects/            # Un .md por proyecto
│   │   └── posts/               # Un .md o .mdx por post de blog
│   ├── layouts/
│   │   ├── BaseLayout.astro     # HTML root, meta tags, fuentes
│   │   ├── PostLayout.astro     # Layout para posts del blog
│   │   └── ProjectLayout.astro  # Layout para páginas de proyecto
│   ├── pages/
│   │   ├── index.astro          # Home con terminal loader
│   │   ├── proyectos/
│   │   │   ├── index.astro      # Listado de proyectos
│   │   │   └── [slug].astro     # Detalle dinámico
│   │   ├── blog/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── sobre-mi.astro
│   │   └── rss.xml.ts           # Feed RSS del blog
│   ├── styles/
│   │   ├── tokens.scss          # Variables CSS (colores, espaciados, tipografías)
│   │   ├── reset.scss           # Reset moderno (basado en Andy Bell)
│   │   ├── animations.scss      # @keyframes globales (glitch, flicker, scanlines)
│   │   └── global.scss          # Estilos base aplicados a todo el sitio
│   ├── lib/
│   │   ├── animations/          # Wrappers de GSAP por componente
│   │   ├── three/               # Escenas Three.js (ver .claude/rules-threejs.md)
│   │   └── utils/               # Helpers puros (formatDate, slugify, etc.)
│   └── env.d.ts
├── astro.config.mjs
├── tsconfig.json                # strict: true
├── package.json
└── pnpm-lock.yaml
```

---

## 4. Convenciones de código

### General

- **Idioma del contenido**: español. Idioma de variables/funciones/commits: inglés.
- **Nombres de archivo**: `PascalCase.astro` para componentes, `kebab-case.md` para contenido, `camelCase.ts` para utilidades.
- **Imports absolutos** desde `~/` (configurar alias en `tsconfig.json` y `astro.config.mjs`).
- **Un componente por archivo**. No exportar varios componentes desde el mismo `.astro`.
- Comentarios en código solo cuando expliquen el **porqué**, no el **qué**.

### TypeScript

- `strict: true`, `noUncheckedIndexedAccess: true`.
- Cero `any`. Si hace falta escape, usar `unknown` + narrowing.
- Tipar el frontmatter de cada colección con Zod en `src/content/config.ts`.

### CSS / Sass

- Cada componente `.astro` lleva sus estilos en un bloque `<style lang="scss">` scoped, **o** en un `.module.scss` adyacente si crece.
- Variables de diseño solo en `src/styles/tokens.scss` como **custom properties CSS** (`--color-neon-cyan`, `--space-md`, `--font-mono`). Nunca hardcodear colores en componentes.
- Mobile-first. Breakpoints definidos como variables en `tokens.scss`.
- Animaciones GPU-friendly: preferir `transform` y `opacity` sobre propiedades que disparan layout.

### Astro

- Páginas estáticas por defecto. Solo activar SSR si Supabase lo exige y no hay alternativa.
- Islas (`client:*`) solo cuando el componente **necesita** interactividad. Default es HTML estático.
- Preferir `client:visible` sobre `client:load` para diferir trabajo.

---

## 5. Dirección estética

**Paleta base (propuesta inicial, ajustable):**

- Fondo: `#0a0e14` (casi negro con tinte azulado)
- Texto principal: `#e6f1ff`
- Neón cian: `#00ffff` (acentos primarios)
- Neón magenta: `#ff00ff` (acentos secundarios, errores creativos)
- Neón verde: `#39ff14` (terminal, status OK)
- Ámbar/warning: `#ffb000`

**Tipografías:**

- Mono (UI, código, terminal): JetBrains Mono, Fira Code, o IBM Plex Mono. Cargar como variable font self-hosted.
- Display (títulos grandes): considerar una geométrica con carácter (Orbitron, Rajdhani) o pegarse al mono para coherencia total.

**Efectos visuales clave:**

1. **Terminal loader en home**: animación de tipeo que escribe comandos falsos (`> initializing portfolio...`, `> loading projects [████░░] 60%`) y al terminar revela el contenido real. Implementar con GSAP timeline + cursor parpadeante CSS.
2. **Glitch en hover/focus**: texto que se duplica con offset RGB (clip-path + dos pseudo-elementos con `text-shadow` cian/magenta).
3. **Scanlines**: overlay sutil con gradiente repetido fijo en viewport.
4. **CRT flicker**: animación de `opacity` muy sutil (0.97 → 1) en loops largos.
5. **Cursor custom**: opcional, en forma de bloque mono.
6. **Fondo 3D global** (`ThreeBackground.astro`): campo de partículas Three.js, fijo detrás de todo el contenido, en todas las páginas. Ver `.claude/rules-threejs.md` para las reglas de performance/a11y no negociables.

Evitar exceso: el efecto cyberpunk debe enmarcar, no entorpecer la lectura de los posts.

---

## 6. Content Collections

Definir en `src/content/config.ts`:

```ts
import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    tags: z.array(z.string()),
    stack: z.array(z.string()),
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
    cover: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, posts };
```

Filtrar `draft: true` en producción (`import.meta.env.PROD`).

---

## 7. Disciplina de dependencias

Esta es la garantía principal contra el "infierno de librerías".

1. **Versiones fijas** en `package.json` (sin `^` ni `~`). Actualizar manualmente y de forma consciente.
2. **Antes de instalar cualquier paquete**, evaluar:
   - ¿Última publicación en los últimos 6 meses?
   - ¿Issues abiertos vs cerrados razonable?
   - ¿Tamaño en bundlephobia.com aceptable?
   - ¿Puedo resolverlo con 20 líneas propias?
3. **pnpm** estricto. No usar `npm` ni `yarn` mezclados.
4. Auditar el árbol con `pnpm why <pkg>` periódicamente.
5. Revisar `pnpm outdated` una vez al mes; no actualizar todo de golpe.

---

## 8. Performance y accesibilidad (no negociables)

- Lighthouse 95+ en las cuatro categorías en producción.
- Imágenes vía `<Image>` de Astro (formatos modernos, lazy load por defecto).
- Fuentes self-hosted con `font-display: swap` y `preload` para la principal.
- Respetar `prefers-reduced-motion`: desactivar glitch, scanlines y terminal autoplay para usuarios que lo prefieran.
- Contraste mínimo AA en todo texto. Validar que los neones sobre fondo oscuro lo cumplan.
- Navegación 100% por teclado. Focus visible custom coherente con la estética.

---

## 9. Roadmap sugerido

**Fase 1 — Base (semana 1-2)**
- Scaffold Astro + TS + pnpm.
- `tokens.scss`, reset, layout base.
- Página home estática con estructura final, sin animaciones aún.

**Fase 2 — Contenido (semana 2-3)**
- Content collections de proyectos y posts configuradas.
- Páginas de listado y detalle para ambas colecciones.
- 2-3 posts y 2-3 proyectos de ejemplo.
- RSS feed.

**Fase 3 — Animaciones (semana 3-4)**
- Terminal loader en home.
- Componente `GlitchText` reutilizable.
- Scanlines globales toggleables.
- Respeto a `prefers-reduced-motion`.

**Fase 4 — Pulido**
- SEO (meta tags, OG, sitemap).
- 404 personalizada con estética coherente.
- Deploy a Cloudflare Pages con dominio.

**Fase 5 — Opcional con Supabase**
- Solo si hay caso real: comentarios en posts, contador de vistas, formulario de contacto.

---

## 10. Instrucciones para Claude

Cuando ayudes en este proyecto:

- **Respeta el stack**. No sugieras Tailwind, shadcn, ni librerías de UI pre-hechas, aunque "sea más rápido".
- **Pregunta antes de añadir una dependencia nueva**. Justifica por qué no se puede resolver con código propio.
- **Componentes desde cero**, con HTML semántico y CSS scoped.
- **Mantén la estética coherente**: cyberpunk con criterio, no neón a lo bestia en todo.
- **Prioriza accesibilidad y performance** incluso cuando entren en tensión con efectos visuales: ofrecé fallback con `prefers-reduced-motion`.
- **Código tipado**. Sin `any`. Sin atajos.
- Cuando propongas un componente, mostralo completo (`.astro` + estilos + tipos), no en fragmentos sueltos.
- Si una decisión tiene trade-offs reales, explicalos brevemente antes de elegir.

---

## 11. Reglas específicas por área

Los archivos en `.claude/` amplían este documento con convenciones concretas por capa. Claude los carga automáticamente como contexto adicional.

@.claude/rules-components.md
@.claude/rules-content.md
@.claude/rules-styles.md
@.claude/rules-pages.md
@.claude/rules-threejs.md

---

_Última actualización: julio 2026._
