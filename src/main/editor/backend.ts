import { dialog, ipcMain, net, protocol } from 'electron'
import { writeFile } from 'fs/promises'
import path from 'path'
import { Level } from 'puchitto/level'

/**
 * The backend of PuchittoEd.
 */
export class EditorBackend {
  /**
   * The current project's folder.
   */
  private _currentProjectFolder?: string

  /**
   * Registers editor schemes
   */
  registerSchemes(): void {
    protocol.registerSchemesAsPrivileged([
      { scheme: 'asset', privileges: { bypassCSP: true, supportFetchAPI: true, secure: true } }
    ])
  }

  /**
   * Registers the necessary hooks in electron.
   */
  registerElectronHooks(): void {
    ipcMain.handle('select-project', () => this._selectProject())
    ipcMain.handle('save-level', (_, level: Level) => this._saveLevel(level))
    protocol.handle('asset', (req) => this._handleAssetRequest(req))
  }

  /**
   * Selects the current project.
   */
  private async _selectProject(): Promise<boolean> {
    const result = await dialog.showOpenDialog({
      title: 'Open a puchitto realm project.',
      filters: [{ name: 'level', extensions: ['json'] }],
      properties: ['openFile']
    })
    if (result.canceled || result.filePaths.length < 1) {
      return false
    }

    this._currentProjectFolder = path.dirname(result.filePaths[0])
    return true
  }

  /**
   * Handles the asset request.
   * @param request The request being asked from us.
   */
  private async _handleAssetRequest(request: Request): Promise<Response> {
    const filename = request.url.slice('asset://'.length)
    const absolutePath = path.join(this._currentProjectFolder!, filename)

    return net.fetch(absolutePath)
  }

  /**
   * Saves a level.
   * @param level The level data.
   */
  private async _saveLevel(level: Level): Promise<boolean> {
    const serialized = JSON.stringify(level)
    try {
      const levelPath = path.join(this._currentProjectFolder!, 'level_new.json')
      await writeFile(levelPath, serialized)
      console.log(`Realm saved to ${levelPath}`)
    } catch (e) {
      console.log(e, 'Failed to write puchitto realm.')
      return false
    }

    return true
  }
}
