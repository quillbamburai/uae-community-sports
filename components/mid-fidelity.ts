/**
 * Palette and type roles.
 *
 * Every value here reads a CSS variable from styles/theme.css — nothing is
 * hard-coded. Change a token, and every component that references it follows.
 * If you find yourself adding a hex value to this file, the token it belongs
 * to is missing from the theme.
 */

/** Semantic colours. Components use these names, never a raw ramp step. */
export const COLOR = {
  canvas: "var(--color-canvas)",
  surface: "var(--color-surface)",
  well: "var(--color-surface-well)",
  border: "var(--color-surface-border)",

  text: "var(--color-text-primary)",
  muted: "var(--color-text-muted)",
  faint: "var(--color-text-faint)",
  inverse: "var(--color-text-inverse)",

  hairline: "var(--color-hairline)",
  bar: "var(--color-bar)",

  success: "var(--color-success)",
  successSurface: "var(--color-success-surface)",
  warning: "var(--color-warning)",
  warningSurface: "var(--color-warning-surface)",
  danger: "var(--color-danger)",
  dangerSurface: "var(--color-danger-surface)",
  info: "var(--color-info)",
  infoSurface: "var(--color-info-surface)",

  /** Charts, donuts and share bars. */
  dataAccent: "var(--color-data-accent)",
} as const

/**
 * Type roles → utility classes. Seven jobs, mapped once.
 *
 * Components reference these names; nothing sets font-size, line-height or
 * tracking by hand. Adding a component means picking a role, which is why a
 * set of unrelated panels still reads as one product.
 */
export const TYPE = {
  /** 1 · Panel or section title — uppercase, e.g. FORECAST */
  panelTitle: "text-subheading-xs",
  /** 2 · Column header — uppercase, e.g. AMOUNT DELIVERED */
  columnHeader: "text-subheading-2xs",
  /** 3 · Hero figure — one large number per panel */
  heroFigure: "text-hero-figure numeric",
  /** 4 · Row value — the aligned right-hand column */
  rowValue: "text-paragraph-s numeric",
  /** 5 · Item name — product, person and campaign names */
  itemName: "text-paragraph-s font-medium",
  /** 6 · Supporting meta — dates, variants, axis ticks */
  meta: "text-paragraph-xs",
  /** 7 · Interactive — buttons, tabs, filters */
  control: "text-button-s",
} as const

/** Layout constants. See docs/LAYOUT-RULES.md for why each one is fixed. */
export const LAYOUT = {
  railWidth: "var(--layout-rail-width)",
  contextWidth: "var(--layout-context-width)",
  drawerWidth: "var(--layout-drawer-width)",
  gutter: "var(--layout-gutter)",
  panelLarge: "var(--panel-large)",
  panelMedium: "var(--panel-medium)",
  panelSmall: "var(--panel-small)",
} as const

/** Fixed width for the row-value column, so right edges align across panels. */
export const ROW_VALUE_WIDTH = 72
