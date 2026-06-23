import { editor } from '../editorGame'

let storedCallback: () => Promise<void> | undefined

export const afterEditorReady = (callback: () => Promise<void>): void => {
  if (editor.ready) {
    callback()
    return
  }

  storedCallback = callback
}

export const callEditorReadyCallbacks = async (): Promise<void> => {
  if (storedCallback === undefined) {
    return
  }

  await storedCallback()
  storedCallback = undefined
}
