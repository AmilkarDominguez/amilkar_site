# Estilos — Reglas específicas

> Complementa `CLAUDE.md` (raíz del proyecto). El sistema de diseño parte de `src/styles/tokens.scss`.

## Jerarquía de archivos de estilos

```
tokens.scss      ← única fuente de verdad de valores de diseño
fonts.scss       ← @font-face declarations (archivos en public/fonts/)
reset.scss       ← reset moderno (Andy Bell); no modificar sin justificación
animations.scss  ← @keyframes globales; agregar aquí si es reutilizable
global.scss      ← importa todo lo anterior; estilos base del sitio
```

Todos los componentes de `src/components/` y `src/layouts/` **importan indirectamente** estos archivos a través de `BaseLayout.astro`, que importa `global.scss`.

## Custom properties disponibles en todos los componentes

### Colores
```css
--color-bg            /* #0a0e14  fondo principal */
--color-bg-surface    /* #0d1117  cards, inputs */
--color-bg-elevated   /* #161b22  menús, tooltips */
--color-text          /* #e6f1ff  texto principal */
--color-text-muted    /* #8b96a8  texto secundario */
--color-neon-cyan     /* #00ffff  acento primario */
--color-neon-magenta  /* #ff00ff  acento secundario */
--color-neon-green    /* #39ff14  terminal, status OK */
--color-amber         /* #ffb000  warnings */
--color-border        /* #1e2a3a  bordes normales */
--color-border-subtle /* #131920  bordes sutiles */
```

### Tipografía
```css
--font-mono           /* Ubuntu Mono (self-hosted en public/fonts/) */
--font-display        /* Orbitron variable (self-hosted), fallback a --font-mono */
--font-size-xs / sm / base / lg / xl / 2xl / 3xl / 4xl / 5xl
--line-height-tight / base / relaxed
```

### Espaciado (escala 4px)
```css
--space-1  /* 4px */   --space-2  /* 8px */   --space-3  /* 12px */
--space-4  /* 16px */  --space-6  /* 24px */  --space-8  /* 32px */
--space-10 /* 40px */  --space-12 /* 48px */  --space-16 /* 64px */
/* Aliases: --space-xs/sm/md/lg/xl/2xl/3xl */
```

### Z-index
```css
--z-base: 0    --z-elevated: 10    --z-nav: 100
--z-overlay: 200    --z-modal: 300    --z-terminal: 9000
```

## Reglas de escritura de estilos

### Lo que está permitido
```scss
// ✓ Custom properties del sistema
color: var(--color-neon-cyan);
padding: var(--space-md);

// ✓ color-mix para semitransparencias (baseline 2023)
background: color-mix(in srgb, var(--color-neon-cyan) 10%, transparent);

// ✓ clamp() para tipografía fluida
font-size: clamp(var(--font-size-4xl), 8vw, 5rem);

// ✓ Breakpoints como literales en @media (NO SCSS vars en <style> de componente)
@media (min-width: 640px) { ... }
@media (min-width: 1024px) { ... }
```

### Lo que NO está permitido
```scss
// ✗ Colores hardcodeados
color: #00ffff;
background: rgba(0, 0, 0, 0.5);

// ✗ Importar SCSS vars en <style lang="scss"> de componentes
@use '~/styles/tokens' as t;   // ← no funciona correctamente en Astro scoped styles

// ✗ Propiedades que disparan layout en animaciones
transition: width, height, margin, padding;  // ← usar transform/opacity

// ✗ Estilos globales en componentes (excepto .prose y efectos que lo justifiquen)
:global(.mi-clase) { ... }
```

## Agregar un nuevo @keyframe

Si la animación es reutilizable en más de un componente → agregarla en `animations.scss`.  
Si es local a un único componente → declararla en el bloque `<style>` del componente.

## @font-face y fuentes

Los archivos WOFF2 van en `public/fonts/`. El `<link rel="preload">` está en `BaseLayout.astro`.  
Si se agrega una fuente nueva:
1. Agregar `@font-face` en `fonts.scss`.
2. Agregar el token en `tokens.scss` (`--font-nueva`).
3. Agregar `<link rel="preload">` en `BaseLayout.astro` para el peso/estilo principal.
