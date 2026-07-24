# Páginas — Reglas específicas

> Complementa `CLAUDE.md` (raíz del proyecto). Documenta los patrones de Astro 6 usados en este proyecto.

## Estructura de una página estática

```astro
---
import BaseLayout from '~/layouts/BaseLayout.astro';
import Header from '~/components/layout/Header.astro';
import Footer from '~/components/layout/Footer.astro';
// ... otros imports
---

<BaseLayout title="Título" description="Descripción SEO">
  <Header />
  <main id="main-content">
    <!-- contenido -->
  </main>
  <Footer />
</BaseLayout>
```

El `id="main-content"` es **obligatorio** en `<main>` — es el target del skip-link de accesibilidad declarado en `BaseLayout.astro`.

## Patrones de Content Collections (Astro 6)

### Página de listado
```ts
import { getCollection } from 'astro:content';

// Muestra drafts en dev, los oculta en producción
const posts = await getCollection('posts', ({ data }) =>
  import.meta.env.PROD ? !data.draft : true
);

// Ordenar siempre por fecha descendente
posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
```

### Página de detalle dinámica (`[slug].astro`)
```ts
import { getCollection, render, type CollectionEntry } from 'astro:content';

export async function getStaticPaths() {
  const entries = await getCollection('posts', ({ data }) =>
    import.meta.env.PROD ? !data.draft : true
  );
  return entries.map((entry) => ({
    params: { slug: entry.id },  // entry.id = nombre de archivo sin extensión
    props: { entry },
  }));
}

interface Props { entry: CollectionEntry<'posts'>; }
const { entry } = Astro.props;
const { Content } = await render(entry);  // render() importado de 'astro:content'
```

### API de Astro 6 — diferencias clave respecto a v4/v5

| v4/v5 | v6 |
|---|---|
| `src/content/config.ts` | `src/content.config.ts` (raíz de src) |
| Schema directo `{ schema }` | `{ loader: glob(...), schema }` |
| `entry.render()` | `render(entry)` importado de `astro:content` |
| `entry.slug` | `entry.id` (= filename sin extensión) |

## Páginas del blog: SEO con artículo

Para que `SEO.astro` genere el JSON-LD de `BlogPosting` y las metaetiquetas `article:`, pasar el prop `article` a `BaseLayout`:

```astro
<BaseLayout
  title={data.title}
  description={data.description}
  article={{ pubDate: data.pubDate, updatedDate: data.updatedDate, tags: data.tags }}
>
```

Esto ya está implementado en `PostLayout.astro`. Los layouts de proyectos no necesitan el prop `article`.

## RSS Feed (`rss.xml.ts`)

El feed solo incluye posts publicados (`!data.draft`). Siempre ordenar por `pubDate` desc antes de pasarlos a `rss()`.

## Reglas de routing

- Páginas estáticas: no usar `export const prerender = false` salvo integración con Supabase.
- Las URLs en español usan `/proyectos/` (slugs son kebab-case del filename, sin tildes).
- La página 404 (`404.astro`) es automáticamente usada por Cloudflare Pages y Netlify para rutas no encontradas.

## Checklist para una página nueva

- [ ] `<main id="main-content">` presente
- [ ] `<BaseLayout title="..." description="...">` con ambos props
- [ ] `<Header />` y `<Footer />` incluidos
- [ ] `getCollection` usa el filtro de draft
- [ ] Si tiene contenido dinámico: `getStaticPaths` exportado correctamente
