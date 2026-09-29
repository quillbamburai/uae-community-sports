# Layout rules

Written once, inherited by every screen. The test of a rule is whether it
removes a decision: if a screen can still answer the same question differently,
the rule is not specific enough.

## Regions

| Region | Width | Behaviour |
|---|---|---|
| Rail | `--layout-rail-width` (64px) | Fixed. Never collapses, never resizes. |
| Work area | Fluid | Takes whatever is left. The only region that flexes. |
| Context column | `--layout-context-width` (320px) | Fixed. Standing information. |
| Drawer | `--layout-drawer-width` (420px) | Overlay. The only place actions commit. |

**Why fixed rails and a fluid centre:** when the viewport changes, one region
should absorb it. If several flex at once, everything reflows and the layout
feels unstable. The work area holds the content that benefits from more room —
a chart, a table — so it takes the difference.

**Why the context column is fixed:** its content does not benefit from width. A
percentage is a percentage at any size.

## Spacing

`--layout-gutter` (16px) governs the shell padding, the gap between columns and
the space between panels. One value, used everywhere. Within a component, use
the `--space-*` scale; outside it, use the gutter.

## Panels

Three sizes only:

| Size | Width | For |
|---|---|---|
| Large | 760px | Data you interrogate — read across, compare, conclude. |
| Medium | 420px | Data you scan — find one row, check the shape of a set. |
| Small | 320px | A single number you glance at. |

The width is the signal. If content needs a fourth size, it is usually doing
two jobs and should be split.

## Height and overflow

**The shell is exactly the viewport height.** Use `100dvh`, not `100vh` —
Safari measures `100vh` including the area behind its toolbar, so a layout
sized that way sits taller than the visible window and its foot is pushed
off-screen.

**Panels fit their content, or they scroll.** A scroller sized to its own
content cannot scroll — the parent has to be constrained first, or the content
runs past the fold with no way to reach it.

**Nothing is permanently unreachable.** If the viewport is shorter than the
layout needs, the page scrolls rather than clipping.

## Commitment

**One place in the product commits anything: the drawer.** Everything outside
it is read-only by rule, so a person always knows whether they are reading or
doing.

Inside the drawer, a multi-step process beats one long form: each step asks one
question, progress is visible, and Back never loses what was entered. Nothing
commits until the final step; every step before it is reversible.

## Motion

Motion explains, it does not decorate. A bar grows from its baseline because
that is how a quantity accumulates. A line draws left to right because that is
the direction of time on its axis.

Every animation respects `prefers-reduced-motion`: the end state is identical,
only the journey is skipped.

## States

Colour signals state, never decoration. An element with no colour carries no
warning.

- `--color-success` — complete, delivered, healthy
- `--color-warning` — at risk, pending, needs attention
- `--color-danger` — blocked, failed, exception
- `--color-info` — informational, neutral notice

A warning is **advisory unless it is genuinely unsafe to proceed**. Surfacing a
conflict and letting the person decide is usually right; refusing their action
means the interface is making a judgement it is rarely qualified to make.
