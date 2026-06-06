import { PairsManifestSchema, type Pair } from './types'

const DATA_DIR = 'data'

/** Public URL for a pair's audio file, respecting Vite's base path. */
export function audioUrl(pair: Pair): string {
  return `${import.meta.env.BASE_URL}${DATA_DIR}/${pair.audioFile}`
}

/**
 * Load and validate the pairs manifest written to public/data/pairs.json.
 * Returns [] when the manifest is missing so a fresh repo renders empty
 * instead of crashing.
 */
export async function loadPairs(): Promise<Pair[]> {
  const res = await fetch(`${import.meta.env.BASE_URL}${DATA_DIR}/pairs.json`)
  if (!res.ok) return []
  const json = await res.json()
  return PairsManifestSchema.parse(json)
}
