import { editor, type EditorGame } from '../../editorGame'
import type { HistoryCommand } from './historyCommand'

/**
 * Records a command in the singleton editor.
 * @param command The command to be recorded.
 */
export const recordCommand = (command: HistoryCommand): void => {
  editor.history.record(command)
  console.log(`recorded ${command}`)
}

/**
 * The editor history system.
 */
export class EditorHistory {
  /**
   * The max amount of recorded commands.
   */
  private static readonly MAX_COMMANDS = 50

  /**
   * The editor game.
   */
  private _game: EditorGame

  /**
   * The list of commands.
   */
  private _commands: HistoryCommand[] = []

  /**
   * The undo offset.
   */
  private _undoOffset = 0

  /**
   * Constructs a new editor game.
   * @param game The editor game.
   */
  constructor(game: EditorGame) {
    this._game = game
  }

  /**
   * Resets the history.
   */
  reset(): void {
    this._commands = []
    this._undoOffset = 0
  }

  /**
   * Records a command.
   * @param command The history command.
   */
  record(command: HistoryCommand): void {
    // If we have no commands, we can outright append.
    if (this._commands.length <= 0) {
      this._commands.push(command)
    } else {
      // If we are behind from the head, detach all the children.
      if (this._undoOffset > 0) {
        this._commands = this._commands.slice(0, this._commands.length - this._undoOffset)
      }

      // Push the new command.
      this._commands.push(command)

      // If we exceed the max count, remove the beginning.
      if (this._commands.length > EditorHistory.MAX_COMMANDS) {
        const diff = this._commands.length - EditorHistory.MAX_COMMANDS
        this._commands = this._commands.slice(diff)
      }
    }

    // Reset the undo offset, to bring to the head.
    this._undoOffset = 0
  }

  /**
   * Undoes the last command.
   */
  undo(): void {
    if (!this.canUndo) {
      return
    }

    const oldOffset = this._commands.length - this._undoOffset - 1

    this._commands[oldOffset].undo(this._game)
    this._undoOffset += 1
  }

  /**
   * Redoes the last command.
   */
  redo(): void {
    if (!this.canRedo) {
      return
    }

    const oldOffset = this._commands.length - this._undoOffset - 1
    const newOffset = oldOffset + 1

    this._commands[newOffset].redo(this._game)
    this._undoOffset -= 1
  }

  /**
   * Returns whether we can undo.
   */
  get canUndo(): boolean {
    return this._commands.length - this._undoOffset - 1 >= 0
  }

  /**
   * Returns whether we can redo.
   */
  get canRedo(): boolean {
    return this._undoOffset > 0
  }
}
