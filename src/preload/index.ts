import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { Level } from 'puchitto/level'
import { AssetOp } from './editor/assetOps'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('puchittoAPI', {
      selectProject: () => ipcRenderer.invoke('select-project'),
      saveLevel: (level: Level) => ipcRenderer.invoke('save-level', level),
      onAssetUpdate: (callback: (ops: AssetOp[]) => void) =>
        ipcRenderer.on('update-assets', (_, ops) => callback(ops))
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
