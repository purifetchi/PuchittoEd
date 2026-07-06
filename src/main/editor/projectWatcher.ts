import chokidar, { FSWatcher } from 'chokidar'
import { AssetOp } from '../../preload/editor/assetOps'
import path from 'path'
import { stat } from 'fs/promises'

/**
 * Type used for sending asset ops to the renderer.
 */
export type AssetOpSender = (ops: AssetOp[]) => void

/**
 * Watches the project for any changes.
 */
export class ProjectWatcher {
  /**
   * The chokidar instance watching over the filesystem.
   */
  private _watcher: FSWatcher

  /**
   * The asset operation sender.
   */
  private _sender: AssetOpSender

  constructor(path: string, sender: AssetOpSender) {
    this._watcher = chokidar.watch(path, {
      ignoreInitial: true
    })
    this._sender = sender

    this._buildChokidarListeners()
  }

  /**
   * Builds chokidar event listeners.
   */
  private _buildChokidarListeners(): void {
    this._watcher
      .on('add', (path) => this._addAsset(path))
      .on('unlink', (path) => this._removeAsset(path))
  }

  /**
   * Handles the addition of an asset.
   * @param asset The path to the asset.
   */
  private async _addAsset(asset: string): Promise<void> {
    const ent = await stat(asset)
    this._sender([
      {
        type: 'create',
        name: {
          path: asset,
          type: ent.isDirectory() ? 'folder' : 'file'
        }
      }
    ])
  }

  /**
   * Handles the removal of an asset.
   * @param asset The path to the asset.
   */
  private _removeAsset(asset: string): void {
    const filename = path.basename(asset)
    this._sender([
      {
        type: 'delete',
        name: filename
      }
    ])
  }

  /**
   * Destroys the watcher.
   */
  destroy(): void {
    this._watcher.close()
  }
}
