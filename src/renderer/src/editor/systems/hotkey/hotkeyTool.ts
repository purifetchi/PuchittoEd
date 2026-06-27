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

  get config(): HotkeyConfig {
    // TODO: Support rebinding.
    return this._defaultConfig
  }

  /**
   * The name of the tool.
   */
  abstract get name(): string

  /**
   * Sets up the tool.
   * @param game The game.
   */
  abstract setup(game: EditorGame): boolean

  /**
   * Ticks this hotkey.
   */
  abstract tick(game: EditorGame): HotkeyHandlingResult
}
