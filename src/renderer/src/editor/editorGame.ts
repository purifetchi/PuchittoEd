import { Game, GameLoader } from "puchitto";

/**
 * The backing class for the editor, extending a normal Puchitto game.
 */
export class EditorGame extends Game {
  /**
   * Creates a new scene.
   */
  newScene() {
    this.createScene()
  }

  /**
   * Loads a level from a buffer.
   * @param buffer The buffer to load from.
   */
  async loadLevelFile(buffer: ArrayBufferLike) {
    this.createScene()

    await this._dataManager.loadPackageFromBuffer(buffer)
    const gameLoader = new GameLoader(this)
    await gameLoader.load()
  }
}

/**
 * The singleton instance of the editor.
 */
export const editor = new EditorGame()

