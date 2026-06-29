import type { EditorGame } from '../../editorGame'

/**
 * The command recorded in the history.
 */
export abstract class HistoryCommand {
  /**
   * Gets the name of this command.
   */
  abstract get name(): string

  /**
   * Undoes this command.
   * @param game The game to undo on.
   */
  abstract undo(game: EditorGame): void

  /**
   * Redoes the command.
   * @param game The game to redo on.
   */
  abstract redo(game: EditorGame): void
}
