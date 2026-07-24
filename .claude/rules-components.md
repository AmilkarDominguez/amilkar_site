# Componentes — Reglas específicas

> Complementa `CLAUDE.md` (raíz del proyecto). Las reglas globales de stack, estética y TypeScript siguen siendo válidas.

## Estructura obligatoria de un componente .astro

```astro
---
// 1. Imports primero
import Otro from '~/components/...';

// 2. Interface Props tipada (sin any, sin unknown genérico)
interface Props {
  prop: string;
  optProp?: number;
}

// 3. Desestructuración con defaults
const { prop, optProp = 0 } = Astro.props;
---

<!-- 4. HTML semántico -->
<elemento class="bloque">
  <slot />
</elemento>

<style lang="scss">
/* 5. Estilos scoped al final */
</style>
```

## Convenciones de naming dentro de componentes

- Clases CSS: **BEM** — `.bloque`, `.bloque__elemento`, `.bloque--modificador`
- Props: camelCase (`pubDate`, `ogImage`)
- Variables locales: camelCase
- Un componente por archivo; un archivo por componente

## Estilos: reglas no negociables

- Usar **siempre** `var(--token)` de `tokens.scss`. Nunca valores hardcodeados.
- Breakpoints: copiar los valores numéricos de `tokens.scss` (`640px`, `768px`, `1024px`) directamente en `@media` — no importar SCSS variables en bloques `<style>` de componentes.
- Animaciones: solo `transform` y `opacity` en `transition`/`animation`. Nada que dispare layout.
- Para estilos que crecen más de ~80 líneas, moverlos a un `.module.scss` adyacente.

## Efectos visuales (src/components/effects/)

Cada componente de efectos **debe**:

1. Tener `@media (prefers-reduced-motion: reduce)` que elimine o deshabilite el efecto completamente (`display: none` o sin `animation`).
2. Si usa JS (GSAP u otro), el script debe verificar `window.matchMedia('(prefers-reduced-motion: reduce)').matches` al inicio y saltar la animación si es true.
3. Ser completamente `pointer-events: none` si es un overlay decorativo.
4. Incluir `aria-hidden="true"` en el elemento raíz si es puramente decorativo.

## Accesibilidad por tipo de componente

| Tipo | Requisito clave |
|---|---|
| Card con link | `a::after { position: absolute; inset: 0 }` para expand-link; también `position: relative` en la card |
| Listas de items | `role="list"` en `<ul>`, `aria-label` descriptivo |
| Navegación | `aria-current="page"` en el link activo |
| Imágenes (cuando se agreguen) | `<Image>` de `astro:assets`; `alt` siempre requerido |
| Botones/links | Focus visible via `:focus-visible` global (ya declarado en `global.scss`) |

## Checklist antes de crear un componente nuevo

- [ ] ¿Realmente necesita ser un componente? ¿No son simplemente 5 líneas de HTML?
- [ ] ¿El HTML es semántico? (`<article>`, `<section>`, `<nav>`, `<time>`, etc.)
- [ ] ¿Los estilos usan solo custom properties del sistema de tokens?
- [ ] ¿Las animaciones respetan `prefers-reduced-motion`?
- [ ] ¿Los elementos interactivos tienen foco visible?
- [ ] ¿Hay `client:*` en algún lado? Justificar por qué no puede ser estático.
