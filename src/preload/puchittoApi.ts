import { Level } from 'puchitto/level'
import { AssetOp } from './editor/assetOps'

/**
 * The exposed IPC API from within PuchittoEd's renderer.
 */
export interface PuchittoAPI {
  selectNewProjectFolder: () => Promise<boolean>
  selectProject: () => Promise<boolean>
  saveLevel: (level: Level) => Promise<boolean>
  onAssetUpdate: (callback: (ops: AssetOp[]) => void) => void
  onProjectSelected: (callback: (path: string) => void) => void
}
