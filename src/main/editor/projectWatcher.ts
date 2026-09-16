import chokidar, { FSWatcher } from 'chokidar'
import { AssetOp } from '../../preload/editor/assetOps'
import { stat } from 'fs/promises'
import { statToAsset, toAssetPath } from '../helpers/assetImportHelpers'

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

  /**
   * The parent's path.
   */
  private _parent: string

  constructor(path: string, sender: AssetOpSender) {
    this._parent = path
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
      .on('addDir', (path) => this._addAsset(path))
      .on('unlink', (path) => this._removeAsset(path))
      .on('unlinkDir', (path) => this._removeAsset(path))
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
        name: statToAsset(this._parent, asset, ent)
      }
    ])
  }

  /**
   * Handles the removal of an asset.
   * @param asset The path to the asset.
   */
  private _removeAsset(asset: string): void {
    this._sender([
      {
        type: 'delete',
        name: toAssetPath(this._parent, asset)
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
