<script lang="ts">
  import { GameObject } from 'puchitto/objects'
  import { recordCommand } from '../../../editor/systems/history/editorHistory'
  import { EntityPropertyChangedCommand } from '../../../editor/systems/history/commands/entityPropertyChangedCommand'
  import Box from '@lucide/svelte/icons/box'
  import Chevron from '@lucide/svelte/icons/chevrons-up-down'
  import Ban from '@lucide/svelte/icons/ban'
  import Warn from '@lucide/svelte/icons/triangle-alert'
  import Property from '../Property.svelte'
  import { editor } from '../../../editor/editorGame'
  import { openEntitySearch } from '../../../editor/helpers/searchHelpers'

  let {
    name,
    obj,
    path,
    hints
  }: { name: string; obj: GameObject; path: string; hints: Record<string, unknown> | undefined } =
    $props()

  let id: number = $state(undefined)
  let entity: GameObject = $derived(editor.getObjectById(id))
  let isMissingEntity: boolean = $derived(entity === undefined && id !== undefined)
  let accessor: () => number
  let setter: (value: number) => void

  $effect(() => {
    accessor = () => obj[path]
    setter = (value: number) => (obj[path] = value)

    id = accessor()
  })

  $effect(() => {
    const previous = accessor()

    if (previous !== id) {
      recordCommand(new EntityPropertyChangedCommand(obj, path, previous, id))
      setter(id)
    }
  })

  const onclick = (): void => {
    const forcedGroupHint = hints?.['type'] as string | undefined
    openEntitySearch(forcedGroupHint).then((selected) => {
      id = selected
    })
  }

  const onkeydown = (ev: KeyboardEvent): void => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault()
      onclick()
    }
  }
</script>

<Property label={name}>
  <div
    class="reference-field"
    class:error={isMissingEntity}
    role="button"
    tabindex="0"
    aria-label={name}
    {onclick}
    {onkeydown}
  >
    <span class="icon">
      {#if entity !== undefined}
        <Box size="14" />
      {:else if isMissingEntity}
        <Warn size="14" />
      {:else}
        <Ban size="14" />
      {/if}
    </span>
    <span class="value" class:empty={entity === undefined}>
      {#if entity !== undefined}
        {entity.name}
      {:else if isMissingEntity}
        missing entity #{id}
      {:else}
        None
      {/if}
    </span>
    <Chevron size="14" />
  </div>
</Property>

<style>
  .reference-field {
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 1;

    min-width: 0;
    background: var(--bg-base);
    border: 1px solid var(--border-color);
    border-radius: 3px;

    padding: 2px 6px 2px 3px;
    min-height: 26px;
    cursor: pointer;
    position: relative;
  }

  .reference-field.error {
    color: var(--error);
    border: 1px solid var(--error);
  }

  .reference-field:hover {
    border: 1px solid var(--border-light);
  }

  .reference-field .icon {
    width: 20px;
    height: 20px;

    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
  }

  .reference-field .value {
    flex: 1;
    font-size: 12px;
    color: var(--accent-hover);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .reference-field .value.empty {
    color: var(--text-muted) !important;
    font-style: italic;
  }
</style>
