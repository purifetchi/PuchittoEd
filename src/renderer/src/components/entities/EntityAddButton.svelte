<script lang="ts">
  import Plus from '@lucide/svelte/icons/plus'
  import DropdownButton from '../menu/DropdownButton.svelte'
  import { editor } from '../../editor/editorGame'
  import { GameObject } from 'puchitto/objects'
  import type { EditorEntityDefinition } from '../../editor/data/editorEntityDefinition'
  import { onMount } from 'svelte'

  let addObject = (type: string): void => {
    const object = editor._entityFactory.create<GameObject>(type, editor.allocator.get(), {})
    editor.addObject(object)
  }

  let entities: EditorEntityDefinition[] = $state([])

  onMount(() => {
    editor.editorEventStream.on('gameDataLoaded', () => {
      entities = editor.gameData.entities.filter((ent) => ent.type !== 'unknown')
    })
  })
</script>

<div class="add-button">
  <Plus size="16" />

  <div class="dropdown">
    {#each entities as entity (entity.type)}
      <DropdownButton clicked={() => addObject(entity.type)}>{entity.displayName}</DropdownButton>
    {/each}
  </div>
</div>

<style>
  .add-button {
    display: flex;
    align-items: center;
    margin-right: 10px;
    padding: 2px;
    border-radius: 4px;
    position: relative;
  }

  .add-button:hover {
    background: var(--bg-hover);
  }

  .add-button:hover .dropdown {
    display: flex;
  }

  .dropdown {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    background: var(--bg-panel);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    min-width: 220px;
    z-index: 5;
    padding: 4px 0;
  }
</style>
