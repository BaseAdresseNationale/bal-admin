export function formatFileSize(bytes, options) {
  if (bytes === 0) {
    return '0 Bytes'
  }

  const k = 1000
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const number = Number.parseFloat((bytes / (k ** i))).toFixed(2)

  return `${options?.round ? Math.round(number / 10) * 10 : number} ${sizes[i]}`
}

