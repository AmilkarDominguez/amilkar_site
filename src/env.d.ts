/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  /** Google Analytics 4 Measurement ID (formato "G-XXXXXXXXXX"). Opcional: sin ella, Analytics.astro no renderiza nada. */
  readonly PUBLIC_GA_MEASUREMENT_ID?: string = "G-Y76T4YN55Q";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
