# 02 · System

The governance layer. Written before the first screen, so every decision
downstream inherits a rule rather than re-arguing it.

```
tokens/         tokens.json — the exported design-system source
guidelines/     Brand guidelines, type sheets, colour specs
LAYOUT-RULES.md The constraints a screen inherits
```

The live tokens are in `/styles/theme.css` at the root — that's the file the
app actually reads. This folder holds the *source* they came from.

A rule belongs here if a screen could otherwise answer the same question
differently. If you find yourself explaining the same behaviour twice while
building, it was missing from here.
