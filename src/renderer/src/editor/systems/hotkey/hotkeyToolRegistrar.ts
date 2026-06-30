import type { HotkeyToolSystem } from '../hotkeyToolSystem.svelte'
import type { HotkeyTool } from './hotkeyTool'

/**
 * The global list of registered tools.
 */
const toolList: Constructor<HotkeyTool>[] = []

/**
 * A constructor.
 */
type Constructor<T> = new () => T

/**
 * The tool leaf.
 */
export type ToolTreeLeaf = {
  name: string
  toolName: string
  order: number
}

/**
 * The tool tree node.
 */
export type ToolTreeNode =
  | {
      name: string
      children: ToolTreeNode[]
      order: number
    }
  | ToolTreeLeaf

/**
 * Registers a single tool.
 * @param ctor The constructor.
 */
export function registerTool<T extends HotkeyTool>(ctor: Constructor<T>): void {
  toolList.push(ctor)
}

/**
 * Builds the tool tree.
 */
export const getToolTree = (): ToolTreeNode => {
  const root: ToolTreeNode = {
    name: '',
    children: [],
    order: 0
  }

  for (const tool of toolList) {
    // Not the prettiest but oh well.
    const obj = new tool()

    const path = obj.menuBarPath
    if (path === undefined) {
      continue
    }

    let lastNode: ToolTreeNode = root
    const parts = path.split('/')
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      if ('toolName' in lastNode) {
        throw new Error('Hit a leaf node while constructing the tool tree.')
      }

      if (i == parts.length - 1) {
        lastNode.children.push({
          name: part,
          toolName: obj.name,
          order: obj.menuOrder
        })
        lastNode.children.sort((l, r) => l.order - r.order)
        continue
      }

      let nodeIndex = lastNode.children.findIndex((n) => n.name == part)
      if (nodeIndex < 0) {
        const newNode: ToolTreeNode = {
          name: part,
          children: [],
          order: obj.menuOrder
        }

        nodeIndex = lastNode.children.length
        lastNode.children.push(newNode)
      }

      lastNode = lastNode.children[nodeIndex]
    }
  }

  return root
}

/**
 * Registers all the given tools in a hotkey system.
 * @param system The hotkey system.
 */
export const registerToolsInSystem = (system: HotkeyToolSystem): void => {
  for (const tool of toolList) {
    system.registerTool(new tool())
  }
}
