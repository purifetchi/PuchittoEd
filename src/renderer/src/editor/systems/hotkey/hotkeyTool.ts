import type { HotkeyHandlingResult } from './hotkeyHandlingResult'
import type { EditorGame } from '../../editorGame'
import type { HotkeyConfig } from './hotkeyConfig'

/**
 * The base class for any hotkey tool.
 */
export abstract class HotkeyTool {
  /**
   * The default hotkey config.
   */
  private _defaultConfig: HotkeyConfig

  /**
   * Constructs a hotkey tool.
   * @param config The default hotkey binding.
   */
  constructor(config: HotkeyConfig) {
    this._defaultConfig = config
  }

  /**
   * The keybinding config.
   */
  get config(): HotkeyConfig {
    // TODO: Support rebinding.
    return this._defaultConfig
  }

  /**
   * The menu bar path of the tool.
   */
  get menuBarPath(): string | undefined {
    return undefined
  }

  /**
   * The order within the menu.
   */
  get menuOrder(): number {
    return 0
  }

  /**
   * The name of the tool.
   */
  abstract get name(): string

  /**
   * Gets whether the tool is available to use.
   */
  abstract available(game: EditorGame): boolean

  /**
   * Sets up the tool.
   * @param game The game.
   */
  setup(game: EditorGame): void {
    void game

    // Overridable.
  }

  /**
   * Ticks this hotkey.
   */
  abstract tick(game: EditorGame): HotkeyHandlingResult
}
