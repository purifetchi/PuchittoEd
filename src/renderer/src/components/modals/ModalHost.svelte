<script lang="ts">
  import { untrack } from 'svelte'
  import { modalStack, type ModalStackItem } from '../../state/modalState.svelte'

  const topmost = $derived(modalStack.length < 1 ? undefined : modalStack[modalStack.length - 1])

  /**
   * Captured by the svelte window.
   * @param ev The keyboard event.
   */
  const onkeydown = (ev: KeyboardEvent): void => {
    if (topmost === undefined) {
      return
    }

    if (ev.key === 'Escape') {
      resolveModal(topmost, undefined)
      ev.preventDefault()
    }
  }

  /**
   * Resolves a modal and pops it off the stack.
   * @param modal The modal.
   * @param value The value to resolve it with.
   */
  const resolveModal = (modal: ModalStackItem, value: unknown): void => {
    modal.resolver(value)

    untrack(() => {
      const index = modalStack.indexOf(modal)
      if (index !== -1) {
        modalStack.splice(index, 1)
      }
    })
  }
</script>

<svelte:window {onkeydown} />

{#if topmost !== undefined}
  {@const modal = topmost}
  {@const ModalComponent = modal.component}
  <div class="modal-container">
    <ModalComponent close={(value) => resolveModal(modal, value)} />
  </div>
{/if}

<style>
  .modal-container {
    position: fixed;
    z-index: 9999;

    top: 0;
    left: 0;

    width: 100vw;
    height: 100vh;

    background: rgba(0, 0, 0, 0.6);

    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
