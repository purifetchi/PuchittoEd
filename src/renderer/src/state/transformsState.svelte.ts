import type { Tool } from '../editor/entities/transformsObject'

export const transformsState = $state({
  tool: 'position' as Tool,
  space: 'world' as 'world' | 'local'
})
