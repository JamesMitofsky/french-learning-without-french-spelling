/**
 * Transcode every non-iOS-playable audio clip in public/data/audio to AAC/.m4a
 * and rewrite public/data/pairs.json to point at the new files.
 *
 * iOS Safari cannot decode WebM/Opus, the format MediaRecorder produces on
 * Chrome. AAC in an MP4 (.m4a) container plays on every browser. Run this after
 * unzipping a studio export, before committing:
 *
 *   node scripts/transcode-audio.mjs
 *
 * Idempotent: clips already in a playable format (.m4a/.mp3) are skipped.
 */
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dataDir = join(root, 'public', 'data')
const manifestPath = join(dataDir, 'pairs.json')

/** Extensions already safe to ship to iOS Safari. */
const PLAYABLE = new Set(['m4a', 'mp3', 'aac'])

const pairs = JSON.parse(readFileSync(manifestPath, 'utf8'))
let changed = 0

for (const pair of pairs) {
  const ext = pair.audioFile.split('.').pop().toLowerCase()
  if (PLAYABLE.has(ext)) continue

  const srcPath = join(dataDir, pair.audioFile)
  if (!existsSync(srcPath)) {
    console.warn(`! missing, skipped: ${pair.audioFile}`)
    continue
  }

  const outFile = pair.audioFile.replace(/\.[^.]+$/, '.m4a')
  const outPath = join(dataDir, outFile)

  execFileSync('ffmpeg', ['-y', '-i', srcPath, '-c:a', 'aac', '-b:a', '128k', outPath], {
    stdio: ['ignore', 'ignore', 'inherit'],
  })

  rmSync(srcPath)
  pair.audioFile = outFile
  changed++
  console.log(`✓ ${pair.label}: ${ext} → m4a`)
}

if (changed > 0) {
  writeFileSync(manifestPath, JSON.stringify(pairs, null, 2) + '\n')
  console.log(`\nTranscoded ${changed} clip(s). Updated pairs.json.`)
} else {
  console.log('Nothing to transcode — all clips already playable.')
}
