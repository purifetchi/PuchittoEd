export const tokenize = (str: string): string[] => {
  const tokens: string[] = []
  let current = ''
  let depth = 0
  let quote: string | null = null

  for (const ch of str) {
    if (quote) {
      current += ch
      if (ch === quote) quote = null
      continue
    }
    if (ch === '"' || ch === "'") {
      quote = ch
      current += ch
      continue
    }
    if (ch === '(') {
      depth++
      current += ch
      continue
    }
    if (ch === ')') {
      depth--
      current += ch
      continue
    }
    if (/\s/.test(ch) && depth === 0) {
      if (current.length > 0) {
        tokens.push(current)
        current = ''
      }
      continue
    }
    current += ch
  }

  if (current.length > 0) tokens.push(current)

  return tokens
}
