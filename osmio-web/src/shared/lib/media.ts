export function exerciseImageUrl(path?: string): string | undefined {
  return path ? `/exercise-images/${path.split('/').pop()}` : undefined
}

export function exerciseGifUrl(path?: string): string | undefined {
  return path ? `/exercise-videos/${path.split('/').pop()}` : undefined
}
