---
title: 'Este portafolio'
description: 'Portafolio personal construido con Astro 6, TypeScript strict, SCSS puro y estética cyberpunk. Zero JavaScript en el cliente por defecto, Lighthouse 95+ en las cuatro categorías.'
pubDate: 2026-06-01
tags: ['frontend', 'astro', 'portfolio']
stack: ['Astro', 'TypeScript', 'SCSS', 'MDX']
repo: 'https://github.com/amilkardominguez/portfolio'
demo: 'https://amilkardominguez.com'
featured: true
draft: false
---

## Por qué reescribir el portafolio

El sitio anterior era Angular 14 estático. Funcionaba, pero añadir contenido requería editar directamente el HTML, no había blog, y el bundle de Angular para contenido mayormente estático era innecesario.

Los requisitos del nuevo sitio:

- Blog de posts escritos en Markdown/MDX
- Portafolio de proyectos con página de detalle por proyecto
- Estética cyberpunk coherente, no un tema descargado
- Zero dependencias de UI pre-hechas
- Performance: Lighthouse 95+ en producción

## Stack elegido

### Astro 6

Astro genera HTML estático por defecto. El JavaScript llega al cliente solo cuando un componente lo pide explícitamente con `client:load` o `client:visible`. Para un portafolio, eso es lo correcto.

Las content collections de Astro 6 permiten definir schemas Zod para el frontmatter:

```typescript
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});
```

Si el frontmatter de un `.md` no cumple el schema, el build falla en CI. Nada llega a producción con datos rotos.

### TypeScript strict

`tsconfig.json` con `strict: true` y `noUncheckedIndexedAccess: true`. Cero `any`. Los tipos de las colecciones se infieren automáticamente del schema Zod.

### SCSS puro, sin frameworks

Todos los estilos se escriben desde cero con CSS Modules + SCSS. Los valores de diseño viven en `src/styles/tokens.scss` como custom properties CSS:

```scss
:root {
  --color-bg: #0a0e14;
  --color-neon-cyan: #00ffff;
  --color-neon-green: #39ff14;
  --font-mono: 'JetBrains Mono', monospace;
}
```

## Estructura

```
src/
├── components/
│   ├── effects/      # Terminal loader, Glitch (Fase 3)
│   ├── layout/       # Header, Footer
│   ├── projects/     # ProjectCard, ProjectGrid
│   └── posts/        # PostCard, PostList, TagBadge
├── content/
│   ├── projects/     # Un .md por proyecto
│   └── posts/        # Un .md/.mdx por post
└── pages/
    ├── proyectos/[slug].astro
    └── blog/[slug].astro
```

## Próximos pasos

- Fase 3: Terminal loader animado con GSAP, efecto glitch en hover
- Fase 4: SEO completo, sitemap, deploy a Cloudflare Pages
