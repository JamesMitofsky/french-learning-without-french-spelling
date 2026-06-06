# french-learning-without-french-spelling

Mobile-first single-page app. Each entry pairs a short label (the phonetic,
non-French spelling) with an audio clip of the real French pronunciation. Tap
the circle to play, tap again to pause. Only one clip plays at a time.

## Stack

Vite · React · TypeScript · Tailwind v4 · Zod · JSZip · Phosphor Icons.

## Develop

```bash
pnpm install
pnpm dev
```

## Two views

- `#/` — **Sounds**: the player. Reads `public/data/pairs.json`.
- `#/studio` — **Studio**: developer tooling to record clips, label them, and
  export a zip. Not an upload system — it just packages data for you.

## Data model

`public/data/pairs.json` is an array validated by Zod:

```json
[
  { "id": "uuid", "label": "bonjour", "audioFile": "audio/uuid.webm" }
]
```

Audio files live in `public/data/audio/`.

## Adding recordings (the workflow)

1. Run `pnpm dev`, open `#/studio`.
2. Tap **Record**, speak, tap **Stop**. Repeat for each clip.
3. Type a label under each clip.
4. Tap **Export zip** → downloads `data-export.zip`.
5. Unzip it into `public/data/`. It carries a merged `pairs.json` (existing +
   new) plus the new audio files, so existing recordings are preserved.
6. Commit and push.

## Build

```bash
pnpm build
```
