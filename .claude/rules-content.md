# Content Collections — Reglas específicas

> Complementa `CLAUDE.md` (raíz del proyecto). El schema autoritativo está en `src/content.config.ts`.

## Schema de cada colección

### posts (`src/content/posts/`)

```yaml
---
title: string            # requerido
description: string      # requerido, 120–160 chars para SEO
pubDate: YYYY-MM-DD      # requerido — YAML lo parsea como Date automáticamente
updatedDate: YYYY-MM-DD  # opcional
tags: [string, ...]      # requerido, al menos uno
draft: false             # false = publicado, true = no aparece en producción
---
```

### projects (`src/content/projects/`)

```yaml
---
title: string            # requerido
description: string      # requerido, 120–160 chars
pubDate: YYYY-MM-DD      # requerido (fecha de creación/publicación del proyecto)
tags: [string, ...]      # requerido — categorías temáticas
stack: [string, ...]     # requerido — tecnologías concretas usadas
repo: URL                # opcional
demo: URL                # opcional
cover: ruta/imagen.png   # opcional — relativa a public/
featured: true           # false por defecto; true = aparece en home
draft: false             # false por defecto
---
```

## Reglas de contenido

- **Idioma**: español. Títulos, cuerpo, descripciones: todo en español.
- **Nombres de archivo**: `kebab-case.md` o `kebab-case.mdx`. Sin espacios, sin mayúsculas.
- El `id` de un entry en Astro 6 es el nombre del archivo sin extensión. Ese `id` se usa como slug en la URL (`/blog/nombre-del-archivo`, `/proyectos/nombre-del-archivo`).
- Usar `.mdx` solo si el post necesita embeber componentes Astro/React/etc. Si es solo texto y código, `.md` es suficiente.

## Workflow de drafts

```
draft: true   → visible en pnpm dev, invisible en pnpm build (producción)
draft: false  → visible en ambos
```

El filtro está en cada `getCollection()`:
```ts
getCollection('posts', ({ data }) =>
  import.meta.env.PROD ? !data.draft : true
)
```

No cambiar este patrón; es consistente en todas las páginas.

## Agregar contenido nuevo

1. Creá el archivo con el frontmatter completo.
2. Verificá que `pnpm build` no arroje errores de schema (Zod valida en build time).
3. Si es un post/proyecto que no está listo, poné `draft: true`.
4. El dev server detecta cambios de archivo y recarga automáticamente.

## Imágenes en contenido

Cuando el frontmatter use `cover:`, la ruta es relativa a `public/`. En el componente que renderiza la cover, usar `<Image>` de `astro:assets` con la ruta desde `src/assets/` para obtener optimización automática.

Por ahora `ProjectCard.astro` y `ProjectLayout.astro` ignoran `cover`. Cuando se implemente, agregar `<Image>` con `alt` obligatorio.
