<script lang="ts">
  import Lock from '@lucide/svelte/icons/lock'

  let {
    name,
    selected,
    locked,
    onfilterchanged
  }: {
    name: string
    selected: boolean
    locked: boolean
    onfilterchanged: (filter?: string) => void
  } = $props()

  const onclick = (): void => {
    if (!locked) {
      onfilterchanged(name)
    }
  }

  const onkeydown = (ev: KeyboardEvent): void => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault()
      onclick()
    }
  }
</script>

<div
  class="group-pill"
  role="button"
  aria-label={name}
  tabindex="0"
  {onkeydown}
  {onclick}
  class:selected
>
  {#if locked}
    <Lock size="9" />
  {/if}
  {name}
</div>

<style>
  .group-pill {
    background: var(--bg-base);
    border: 1px solid var(--border-color);
    color: var(--text-muted);
    font-size: 10px;
    padding: 2px 9px;
    border-radius: 10px;
    cursor: pointer;
  }

  .group-pill.selected {
    background: var(--bg-active);
    border: 1px solid var(--accent);
    color: var(--text-light);
  }
</style>
