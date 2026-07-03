import type { GameSystem } from 'puchitto/systems'
import { type EditorGame } from '../editorGame'
import type { Game } from 'puchitto'
import { HotkeyHandlingResult } from './hotkey/hotkeyHandlingResult'
import type { HotkeyTool } from './hotkey/hotkeyTool'
import { toolState } from '../../state/toolState.svelte'
import { isModalActive } from '../../state/modalState.svelte'
import type { HotkeyConfig } from './hotkey/hotkeyConfig'

export class HotkeyToolSystem implements GameSystem {
  private _game: EditorGame

  private _tools: HotkeyTool[] = []

  private _activeTool?: HotkeyTool

  /**
   * Registers a hotkey tool.
   * @param tool The tool.
   */
  registerTool(tool: HotkeyTool): void {
    this._tools.push(tool)
  }

  /**
   * Registers the game.
   * @param game The game.
   */
  registerGame(game: Game): void {
    this._game = game as EditorGame
  }

  /**
   * Registers the effects for the effect composer.
   * @param composer The effect composer.
   */
  registerComposerEffects(): void {
    // ignored
  }

  /**
   * Manually invokes a tool.
   */
  invokeTool(toolName: string): void {
    // Get the tool
    const tool = this._tools.find((t) => t.name == toolName)
    if (tool === undefined) {
      return
    }

    if (tool.available) {
      tool.setup(this._game)
      toolState.tool = tool.name
      this._activeTool = tool
    }
  }

  /**
   * Ticks this system.
   * @param dt The delta time since the last frame.
   */
  tick(): void {
    if (this._activeTool !== undefined) {
      const result = this._activeTool.tick(this._game)
      if (result === HotkeyHandlingResult.FINISHED || this._game.input.keyDown('Escape')) {
        this._activeTool = undefined
        toolState.tool = undefined
      }
      return
    }

    if (!this._game.input.keysChanged || this._game.input.cursorLocked || isModalActive()) {
      return
    }

    let selectedTool: HotkeyTool | undefined = undefined
    let selectedToolConfig: HotkeyConfig
    for (const tool of this._tools) {
      if (selectedTool !== undefined) {
        const cfg = tool.config

        // The tool with the highest modifier count wins.
        if (cfg.key !== selectedToolConfig.key) {
          continue
        }

        if (cfg.modifiers.length < selectedToolConfig.modifiers.length) {
          continue
        }
      }

      if (this.validate(tool)) {
        selectedTool = tool
        selectedToolConfig = tool.config
      }
    }

    if (selectedTool !== undefined) {
      selectedTool.setup(this._game)
      toolState.tool = selectedTool.name
      this._activeTool = selectedTool
    }
  }

  /**
   * Validates the tools usability.
   * @param tool The tool.
   */
  private validate(tool: HotkeyTool): boolean {
    // Check the key combination.
    const bindings = tool.config
    if (!this._game.input.keyDown(bindings.key)) {
      return false
    }

    // If we have bindings, all have to be pressed.
    for (const modifier of bindings.modifiers) {
      if (!this._game.input.keyDown(modifier)) {
        return false
      }
    }

    // Return whether the setup has finished properly.
    return tool.available(this._game)
  }
}
