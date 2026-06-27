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
      selectNewProjectFolder: () => ipcRenderer.invoke('select-new-project-folder'),
      selectProject: () => ipcRenderer.invoke('select-project'),
      saveLevel: (level: Level) => ipcRenderer.invoke('save-level', level),
      exportLevel: (level: Level) => ipcRenderer.invoke('export-level', level),
      copyFilesToProject: (filePaths: string[]) =>
        ipcRenderer.invoke('copy-files-to-project', filePaths),
      onAssetUpdate: (callback: (ops: AssetOp[]) => void) =>
        ipcRenderer.on('update-assets', (_, ops) => callback(ops)),
      onProjectSelected: (callback: (path: string) => void) =>
        ipcRenderer.on('select-project', (_, path) => callback(path))
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
