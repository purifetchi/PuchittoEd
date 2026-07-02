import { app, BrowserWindow, dialog, ipcMain, net, protocol } from 'electron'
import { copyFile, lstat, readdir, writeFile } from 'fs/promises'
import path, { join } from 'path'
import { Level } from 'puchitto/level'
import { AssetOp } from '../../preload/editor/assetOps'
import { ProjectWatcher } from './projectWatcher'
import { AlfBuilder } from './alfBuilder'
import { pathToFileURL } from 'url'

/**
 * The backend of PuchittoEd.
 */
export class EditorBackend {
  /**
   * The current project's folder.
   */
  private _currentProjectFolder?: string

  /**
   * The browser window running PuchittoEd.
   */
  private _window!: BrowserWindow

  /**
   * The current chokidar watcher.
   */
  private _watcher?: ProjectWatcher

  /**
   * Sets the current main window.
   * @param window The browser window.
   */
  setWindow(window: BrowserWindow): void {
    this._window = window
  }

  /**
   * Registers editor schemes
   */
  registerSchemes(): void {
    protocol.registerSchemesAsPrivileged([
      {
        scheme: 'asset',
        privileges: { bypassCSP: true, supportFetchAPI: true, secure: true, corsEnabled: true }
      },
      {
        scheme: 'editor',
        privileges: { bypassCSP: true, supportFetchAPI: true, secure: true, corsEnabled: true }
      }
    ])
  }

  /**
   * Registers the necessary hooks in electron.
   */
  registerElectronHooks(): void {
    ipcMain.handle('select-new-project-folder', () => this._selectNewProjectFolder())
    ipcMain.handle('select-project', () => this._selectProject())
    ipcMain.handle('save-level', (_, level: Level) => this._saveLevel(level))
    ipcMain.handle('export-level', (_, level: Level) => this._exportLevel(level))
    ipcMain.handle('copy-files-to-project', (_, filePaths: string[]) =>
      this._copyFilesToProject(filePaths)
    )
    protocol.handle('asset', (req) => this._handleAssetRequest(req))
    protocol.handle('editor', (req) => this._handleEditorRequest(req))
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

    const projectPath = path.dirname(result.filePaths[0])
    await this._setProjectFromPath(projectPath)
    return true
  }

  /**
   * Selects the current project.
   */
  private async _selectNewProjectFolder(): Promise<boolean> {
    const result = await dialog.showOpenDialog({
      title: 'Select the puchitto realm.',
      properties: ['openDirectory']
    })
    if (result.canceled || result.filePaths.length < 1) {
      return false
    }

    await this._setProjectFromPath(result.filePaths[0])
    return true
  }

  /**
   * Sets a project from its path.
   * @param path The path to the project.
   */
  private async _setProjectFromPath(path: string): Promise<void> {
    this._currentProjectFolder = path
    this._sendProjectFolder()
    await this._reloadAssetBrowserForRenderer()

    this._watcher?.destroy()
    this._watcher = new ProjectWatcher(this._currentProjectFolder, (ops) =>
      this._sendAssetUpdate(ops)
    )
  }

  /**
   * Reloads the asset browser for the renderer.
   */
  private async _reloadAssetBrowserForRenderer(): Promise<void> {
    const files = await readdir(this._currentProjectFolder!)
    const ops: AssetOp[] = [
      {
        type: 'clearAll'
      },
      {
        type: 'bulkLoad',
        names: files
      }
    ]

    this._sendAssetUpdate(ops)
  }

  /**
   * Sends asset database updates to the renderer.
   * @param ops The asset operations.
   */
  private _sendAssetUpdate(ops: AssetOp[]): void {
    this._window.webContents.send('update-assets', ops)
  }

  /**
   * Sends the current project folder.
   */
  private _sendProjectFolder(): void {
    this._window.webContents.send('select-project', this._currentProjectFolder)
  }

  /**
   * Handles the asset request.
   * @param request The request being asked from us.
   */
  private async _handleAssetRequest(request: Request): Promise<Response> {
    const filename = request.url.slice('asset://'.length)
    const absolutePath = path.join(this._currentProjectFolder!, decodeURIComponent(filename))

    return net.fetch(pathToFileURL(absolutePath).toString())
  }

  /**
   * Handles the editor request.
   * @param request The request being asked from us.
   */
  private async _handleEditorRequest(request: Request): Promise<Response> {
    const filename = request.url.slice('editor://'.length)
    const absolutePath = path.join(app.getAppPath(), 'resources', decodeURIComponent(filename))

    return net.fetch(pathToFileURL(absolutePath).toString())
  }

  /**
   * Copies files into the current project folder.
   * @param filePaths The absolute paths of the files to copy.
   */
  private async _copyFilesToProject(filePaths: string[]): Promise<boolean> {
    if (!this._currentProjectFolder) {
      return false
    }

    try {
      for (const filePath of filePaths) {
        const fileName = path.basename(filePath)
        const dest = path.join(this._currentProjectFolder, fileName)
        await copyFile(filePath, dest)
      }
      return true
    } catch (e) {
      console.error('Failed to copy files to project:', e)
      return false
    }
  }

  /**
   * Saves a level.
   * @param level The level data.
   */
  private async _saveLevel(level: Level): Promise<boolean> {
    const serialized = JSON.stringify(level)
    try {
      const levelPath = path.join(this._currentProjectFolder!, 'level.json')
      await writeFile(levelPath, serialized)
      console.log(`Realm saved to ${levelPath}`)
    } catch (e) {
      console.log(e, 'Failed to write puchitto realm.')
      return false
    }

    return true
  }

  /**
   * Exports a level.
   * @param level The level data.
   */
  private async _exportLevel(level: Level): Promise<boolean> {
    if (!(await this._saveLevel(level))) {
      return false
    }

    const builder = new AlfBuilder()
    const files = await readdir(this._currentProjectFolder!)
    for (const file of files) {
      const path = join(this._currentProjectFolder!, file)
      const stat = await lstat(path)

      // We do not support nesting, for now.
      if (stat.isDirectory()) {
        continue
      }

      builder.addFile(path, file)
    }

    const result = await dialog.showSaveDialog({
      title: 'Save the realm.',
      filters: [{ name: 'realm', extensions: ['alf'] }],
      properties: ['showOverwriteConfirmation']
    })
    if (result.canceled || result.filePath.length < 1) {
      return false
    }

    await builder.save(result.filePath)

    return true
  }
}
