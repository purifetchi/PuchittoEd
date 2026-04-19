import type { EditorEntityDefinition } from './editorEntityDefinition'

/**
 * The loadable editor data for the editor. Think Source's FGDs.
 */
export interface GameData {
  /**
   * The name of the game data.
   */
  name: string

  /**
   * The description of the game data.
   */
  description?: string

  /**
   * The authors of the game data.
   */
  author?: string

  /**
   * The definition of all entities.
   */
  entities: EditorEntityDefinition[]
}
