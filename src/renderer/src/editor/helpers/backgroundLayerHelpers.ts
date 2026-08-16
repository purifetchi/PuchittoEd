import { isColorToken, type CssColorLayer } from './css/backgroundColorLayer'
import { joinImageLayer, parseImageLayer, type CssImageLayer } from './css/backgroundImageLayer'
import { tokenize } from './css/tokenizer'

export type CssBackgroundLayer =
  | CssImageLayer
  | CssColorLayer
  | {
      type: 'unknown'
      data: string
    }

export const parseCssBackgroundLayers = (background: string): CssBackgroundLayer[] => {
  if (background === undefined || background.length < 1) {
    return []
  }

  const parts = background.split(',')
  const result: CssBackgroundLayer[] = []

  for (const part of parts) {
    const trimmed = part.trim()
    if (trimmed.length < 1) {
      continue
    }

    const tokens = tokenize(trimmed)

    if (tokens[0].startsWith('url')) {
      result.push(parseImageLayer(tokens))
    } else if (tokens.length === 1 && isColorToken(tokens[0])) {
      result.push({
        type: 'color',
        color: tokens[0]
      })
    } else {
      result.push({
        type: 'unknown',
        data: trimmed
      })
    }
  }

  return result
}

export const joinCssBackgroundLayers = (layers: CssBackgroundLayer[]): string => {
  const cssParts: string[] = []

  for (const layer of layers) {
    if (layer.type === 'image') {
      cssParts.push(joinImageLayer(layer))
    } else if (layer.type === 'color') {
      cssParts.push(layer.color)
    } else if (layer.type === 'unknown') {
      cssParts.push(layer.data)
    }
  }

  console.log(cssParts)

  return cssParts.join(', ')
}
