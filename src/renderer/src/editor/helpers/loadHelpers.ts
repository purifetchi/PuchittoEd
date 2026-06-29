import { editor } from '../editorGame'

let storedCallbacks: (() => Promise<void>)[] | undefined

export const afterEditorReady = (callback: () => Promise<void>): void => {
  if (editor.ready) {
    callback()
    return
  }

  storedCallbacks = [...(storedCallbacks ?? []), callback]
}

export const callEditorReadyCallbacks = async (): Promise<void> => {
  if (storedCallbacks === undefined) {
    return
  }

  for (const callback of storedCallbacks) {
    await callback()
  }

  storedCallbacks = undefined
}
