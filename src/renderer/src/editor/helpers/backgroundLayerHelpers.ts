export type CssBackgroundLayer =
  | {
      type: 'image'
      asset: string
      size?: string
      repeat?: string
      position?: string
      scroll?: string
    }
  | {
      type: 'color'
      color: string
    }
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

  // TODO: This sucks.
  for (const part of parts) {
    const elements = part.split(' ')

    // Image
    if (elements[0].startsWith('url')) {
      const asset = decodeURIComponent(
        elements[0].replace('url(', '').replace(')', '').replaceAll("'", '').replaceAll('"', '')
      )

      result.push({
        type: 'image',
        asset
      })
    } else if (elements.length === 1) {
      result.push({
        type: 'color',
        color: elements[0]
      })
    } else {
      result.push({
        type: 'unknown',
        data: part
      })
    }
  }

  return result
}

export const joinCssBackgroundLayers = (layers: CssBackgroundLayer[]): string => {
  const cssParts: string[] = []

  // TODO: Mock
  for (const layer of layers) {
    if (layer.type === 'image') {
      cssParts.push(`url('${encodeURIComponent(layer.asset)}')`)
    } else if (layer.type === 'unknown') {
      cssParts.push(layer.data)
    }
  }

  console.log(layers, cssParts, cssParts.join(', '))

  return cssParts.join(', ')
}
