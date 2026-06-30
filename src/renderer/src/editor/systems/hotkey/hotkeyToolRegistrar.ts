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
 * Registers a single tool.
 * @param ctor The constructor.
 */
export function registerTool<T extends HotkeyTool>(ctor: Constructor<T>): void {
  toolList.push(ctor)
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
