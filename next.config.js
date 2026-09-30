/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Static export: both products are entirely client-side, so they build to
     plain HTML/CSS/JS and can be served from any host. */
  output: "export",

  /* Served from a subpath, not the domain root: /uae-community-sports on
     GitHub Pages, matching the repo name. */
  basePath: "/uae-community-sports",

  /* Next's image optimisation needs a server; a static export has none, so
     images are emitted as-is. They are already sized for their slots. */
  images: { unoptimized: true },

  /* Emit page/index.html so paths resolve without a server rewrite. */
  trailingSlash: true,

  /* Exposed to the client so asset paths can be prefixed. */
  env: { NEXT_PUBLIC_BASE_PATH: "/uae-community-sports" },
}

module.exports = nextConfig
