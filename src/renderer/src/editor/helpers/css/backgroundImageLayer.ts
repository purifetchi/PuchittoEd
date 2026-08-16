import { isColorToken } from './backgroundColorLayer'

/**
 * The definition of an image layer.
 */
export type CssImageLayer = {
  type: 'image'
  asset: string
  size?: string
  repeat?: string
  position?: string
  scroll?: string
  origin?: string
  clip?: string
  color?: string
}

const repeatKeywords = ['repeat', 'repeat-x', 'repeat-y', 'no-repeat', 'space', 'round']
const attachmentKeywords = ['scroll', 'fixed', 'local']
const boxKeywords = ['border-box', 'padding-box', 'content-box']
const sizeKeywords = ['cover', 'contain']

const isRepeatKeyword = (token: string): boolean => repeatKeywords.includes(token)
const isAttachmentKeyword = (token: string): boolean => attachmentKeywords.includes(token)
const isBoxKeyword = (token: string): boolean => boxKeywords.includes(token)
const isSizeKeyword = (token: string): boolean => sizeKeywords.includes(token)

const cleanUrlToken = (raw: string): string =>
  decodeURIComponent(raw.replace(/^url\(['"]?|['"]?\)$/gi, ''))

export const parseImageLayer = (tokens: string[]): CssImageLayer => {
  const asset = cleanUrlToken(tokens[0])

  const position: string[] = []
  let size: string | undefined
  let repeat: string | undefined
  let scroll: string | undefined
  let origin: string | undefined
  let clip: string | undefined
  let color: string | undefined

  let sawSlash = false

  for (let i = 1; i < tokens.length; i++) {
    const token = tokens[i]

    if (token === '/') {
      sawSlash = true
      continue
    }

    if (sawSlash) {
      size = size ? `${size} ${token}` : token
      continue
    }

    if (isRepeatKeyword(token)) {
      repeat = repeat ? `${repeat} ${token}` : token
    } else if (isAttachmentKeyword(token)) {
      scroll = token
    } else if (token === 'text') {
      clip = 'text'
    } else if (isBoxKeyword(token)) {
      if (origin === undefined) {
        origin = token
      } else {
        clip = token
      }
    } else if (isSizeKeyword(token)) {
      size = token
    } else if (isColorToken(token)) {
      color = token
    } else {
      position.push(token)
    }
  }

  return {
    type: 'image',
    asset,
    ...(position.length > 0 && { position: position.join(' ') }),
    ...(size && { size }),
    ...(repeat && { repeat }),
    ...(scroll && { scroll }),
    ...(origin && { origin }),
    ...(clip && { clip }),
    ...(color && { color })
  }
}

export const joinImageLayer = (layer: CssImageLayer): string => {
  const parts: string[] = [`url('${layer.asset}')`]

  if (layer.position) {
    parts.push(layer.position)

    if (layer.size) {
      parts.push(`/ ${layer.size}`)
    }
  }

  if (layer.repeat) {
    parts.push(layer.repeat)
  }

  if (layer.scroll) {
    parts.push(layer.scroll)
  }

  if (layer.origin) {
    parts.push(layer.origin)
  }

  if (layer.clip) {
    parts.push(layer.clip)
  }

  if (layer.color) {
    parts.push(layer.color)
  }

  return parts.join(' ')
}
