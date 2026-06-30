import type { Component } from 'svelte'

/**
 * A single item within the modal stack.
 */
export type ModalStackItem = {
  component: Component
  promise: Promise<unknown>
  resolver: (value: unknown) => void
}

/**
 * The stack of currently active modals.
 */
export const modalStack: ModalStackItem[] = $state([])

/**
 * Opens a modal component.
 * @param component The component to open.
 * @returns A promise with the value returned.
 */
export const openModal = <TResult>(component: Component): Promise<TResult> => {
  let resolver: (value: TResult) => void
  const promise = new Promise<TResult>((r) => {
    resolver = r
  })

  const stackItem: ModalStackItem = {
    component,
    promise,
    resolver
  }

  modalStack.push(stackItem)

  return promise
}
