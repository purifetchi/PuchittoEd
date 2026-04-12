import { ElectronAPI } from '@electron-toolkit/preload'
import type { PuchittoAPI } from './puchittoApi'

declare global {
  interface Window {
    electron: ElectronAPI
    puchittoAPI: PuchittoAPI
    api: unknown
  }
}
