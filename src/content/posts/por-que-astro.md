---
title: 'Por qué elegí Astro para mi portafolio'
description: 'Content collections nativas, zero JavaScript en el cliente por defecto, y una DX excelente. El razonamiento detrás del stack de este sitio.'
pubDate: 2026-06-10
tags: ['Astro', 'TypeScript', 'arquitectura']
draft: false
---

Hace unos meses decidí reescribir mi portafolio desde cero. El stack anterior era Angular 14 estático, sin CMS ni blog. Funcionaba, pero tenía dos problemas concretos: agregar contenido requería commits directos al HTML, y el bundle de Angular para una página mayormente estática pesaba más de lo necesario.

## Las alternativas que consideré

Evalué tres opciones principales:

**Next.js 15**: excelente para aplicaciones con datos dinámicos y muchos componentes interactivos. Para un portafolio, llevar React al cliente para renderizar texto estático es overhead innecesario.

**SvelteKit**: DX excelente, bundle pequeño, compilación a HTML estático. Lo descárté porque quería algo agnóstico de framework de UI: si en el futuro necesito un componente complejo, quiero poder elegir la herramienta correcta para ese caso.

**Astro**: zero JS en el cliente por defecto, content collections nativas con Zod, agnóstico de framework para islas de interactividad. Ganó.

## Lo que más me convenció

### Content collections tipadas

Las content collections de Astro 6 permiten definir un schema Zod para cada tipo de contenido. El compilador infiere los tipos automáticamente:

```typescript
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    draft: z.boolean().default(false),
  }),
});
```

Si el frontmatter de un `.md` no cumple el schema, el build falla. Nada llega a producción con datos rotos o sin tipo.

### Zero JavaScript por defecto

En Astro, un componente `.astro` no envía JavaScript al cliente a menos que lo solicites explícitamente con `client:load` o `client:visible`. Para este portafolio, eso se traduce en páginas que cargan instantáneamente sin hidratación en el cliente.

### Islas de interactividad

Cuando necesito interactividad real (la terminal animada que viene en Fase 3), puedo montar un componente Preact, Svelte o Vue sin hidratar toda la página. Solo el componente que lo necesita carga JavaScript.

## El tradeoff que acepté

Astro es ideal para sitios orientados a contenido. Si en el futuro necesitara una aplicación con estado global complejo (auth de usuario, datos personalizados por sesión), evaluaría mover esas rutas a SSR con un adaptador de Cloudflare Workers.

Por ahora, contenido estático. El resultado es un sitio con Lighthouse 95+ en las cuatro categorías sin mucho esfuerzo.
