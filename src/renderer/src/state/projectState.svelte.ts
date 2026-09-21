import { editor } from '../editor/editorGame'

export const projectState = $state({
  project: '',
  modified: false,
  viewMode: 'editor',
  assetMode: 'assets'
} as {
  project: string
  modified: boolean
  viewMode: 'editor' | 'camera'
  assetMode: 'assets' | 'console'
})

export const setModifiedFlag = (): void => {
  if (!projectState.modified) {
    projectState.modified = true
  }
}

export const resetModifiedFlag = (): void => {
  projectState.modified = false
}

/**
 * Sets the view mode of the editor.
 * @param mode The view mode.
 */
export const setViewMode = (mode: 'editor' | 'camera'): void => {
  projectState.viewMode = mode
  editor.setViewMode(mode)
}
