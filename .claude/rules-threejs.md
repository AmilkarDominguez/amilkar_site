# Three.js — Reglas específicas

> Complementa `CLAUDE.md` (raíz del proyecto). Three.js es una excepción deliberada a la
> disciplina de dependencias (sección 7): es una librería grande (WebGL), así que su uso
> está acotado a lo documentado acá. No la uses para nada que GSAP o CSS puedan resolver.

## Alcance actual

Un único efecto: el fondo animado global (`ThreeBackground.astro`, montado en
`BaseLayout.astro`, visible en todas las páginas). No agregar más instancias de Three.js
sin actualizar esta regla — cada canvas/renderer nuevo es presupuesto de performance nuevo.

## Estructura obligatoria

```
src/components/effects/ThreeBackground.astro   # canvas + ciclo de vida (mount/pause/dispose)
src/lib/three/backgroundScene.ts                # toda la lógica de THREE (escena, materiales, loop)
```

- El `.astro` **no** importa `three` directamente. Solo hace `await import('~/lib/three/...')`
  dentro del `<script>`, y únicamente cuando `prefers-reduced-motion` no está activo. Así el
  chunk de three.js (~120kb gzip) nunca se descarga para quien no lo va a ver.
- Cada módulo de escena en `src/lib/three/` exporta una factory (`createXScene(canvas)`) que
  devuelve `{ pause, resume, dispose }`. Nada de lógica de Three.js suelta en el `.astro`.

## No negociables (performance + a11y, sección 8 de CLAUDE.md)

1. **`prefers-reduced-motion`**: si está activo, no se monta el canvas y **no se importa
   `three`**. Chequear con `window.matchMedia('(prefers-reduced-motion: reduce)').matches`
   antes de cualquier `import()`. El fallback CSS (`display: none` en el canvas) es solo
   defensivo — la condición real vive en el script.
2. **Carga diferida**: arrancar la escena con `requestIdleCallback` (fallback `setTimeout`),
   nunca en el primer paint. El fondo es decorativo, no puede competir con el LCP/TBT de la
   página.
3. **Pausar cuando no se ve**: `document.visibilitychange` → `pause()`/`resume()` del render
   loop (`cancelAnimationFrame` / `requestAnimationFrame`). Una pestaña en background no debe
   seguir renderizando frames de WebGL.
4. **Dispose real**: `pagehide` → `dispose()` — `geometry.dispose()`, `material.dispose()`,
   `renderer.dispose()`, remover listeners de `resize`. Nada de fugas de contexto WebGL.
5. **Presupuesto de partículas/polígonos**: mantené las escenas de fondo baratas (miles de
   puntos, no miles de triángulos con materiales complejos). `powerPreference: 'low-power'`,
   `antialias: false`, `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))` siempre.
6. **Decorativo, nunca interactivo por bloqueo**: `aria-hidden="true"` en el canvas,
   `pointer-events: none` siempre. Si en el futuro se agrega interacción (parallax con mouse,
   raycasting), debe seguir sin capturar el puntero del contenido real.
7. **Colores desde tokens, no hardcodeados**: leer los colores de la paleta en runtime con
   `getComputedStyle(document.documentElement).getPropertyValue('--color-neon-cyan')` en vez
   de escribir hex directamente en el `.ts`. Si `tokens.scss` cambia de paleta, la escena se
   actualiza sin tocar código.

## Z-index y capas

- El fondo va **detrás** de todo el contenido: `position: fixed; inset: 0; z-index: var(--z-behind)`
  (`--z-behind: -1`, definido en `tokens.scss`). No uses `--z-base` para esto — un elemento
  `position: fixed` con `z-index: 0` pinta *después* del contenido normal del documento, no
  detrás (ver orden de pintado CSS2.1 Apéndice E), así que taparía la página.
- `TerminalLoader` (`--z-terminal: 9000`) sigue por encima de todo durante la carga inicial de
  la home — no requiere ningún ajuste porque su z-index ya es mayor.

## TypeScript

- `strict: true`, cero `any` (igual que el resto del proyecto). Tipar el retorno de cada
  factory de escena con una interfaz explícita (`BackgroundScene`, o la que corresponda).
- `@types/three` es una `devDependency` fija (sin `^`/`~`), igual versión que `three` en
  `dependencies` cuando sea posible.

## Checklist antes de agregar una escena Three.js nueva

- [ ] ¿Realmente necesita WebGL, o alcanza con GSAP/CSS (ya aceptados y sin este costo)?
- [ ] ¿El import de `three` está detrás de un `prefers-reduced-motion` check y es dinámico?
- [ ] ¿Arranca en idle, no bloquea el primer render?
- [ ] ¿Pausa en `visibilitychange` y libera recursos en `pagehide`?
- [ ] ¿`aria-hidden` + `pointer-events: none`?
- [ ] ¿Usa `var(--z-behind)` o el z-index correcto para su capa, sin taparse con contenido real?
- [ ] ¿Los colores salen de `tokens.scss`, no de hex sueltos en el `.ts`?
