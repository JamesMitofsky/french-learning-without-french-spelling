/** Map a MediaRecorder/Blob mime type to a sensible file extension. */
export function extForMime(mime: string): string {
  if (mime.includes('webm')) return 'webm'
  if (mime.includes('mp4')) return 'mp4'
  if (mime.includes('ogg')) return 'ogg'
  if (mime.includes('mpeg')) return 'mp3'
  if (mime.includes('wav')) return 'wav'
  return 'webm'
}

export type Draft = {
  id: string
  label: string
  blob: Blob
  ext: string
  /** object URL for in-studio preview playback */
  url: string
}
