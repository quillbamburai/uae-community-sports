/**
 * Prefix a public asset path with the deployment's basePath.
 *
 * A static export served under a subpath would otherwise request
 * /images/x.png rather than /uae-community-sports/images/x.png. Every
 * reference to a file in public/ goes through here. Empty in dev, so paths
 * are unchanged locally.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

export function asset(path: string) {
  return `${BASE}${path}`
}
