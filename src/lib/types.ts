import { z } from 'zod'

/**
 * One pairing shown on the player page: a short label (often the phonetic,
 * non-French spelling) tied to an audio file holding the real pronunciation.
 */
export const PairSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  // path relative to the data manifest, e.g. "audio/abc123.webm"
  audioFile: z.string().min(1),
})

export const PairsManifestSchema = z.array(PairSchema)

export type Pair = z.infer<typeof PairSchema>
