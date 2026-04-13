<script lang="ts">
  import { onMount } from 'svelte'
  import { editor } from '../editor/editorGame'
  import EntityListItem from './entities/EntityListItem.svelte'
  import type { GameObject } from 'puchitto/objects'
  import { selectionState } from '../state/selectionState.svelte'

  let objects: GameObject<unknown>[] = []

  let onclicked = (id: number): void => {
    selectionState.id = id
  }

  onMount(() => {
    editor.eventStream.on('objectAttached', () => {
      objects = [...editor._objects]
    })

    editor.eventStream.on('objectRemoved', () => {
      objects = [...editor._objects]
    })
  })
</script>

<div class="entity-list">
  {#each objects as object (object.id)}
    <EntityListItem
      name={object.name}
      id={object.id}
      onselect={onclicked}
      selected={object.id == selectionState.id}
    />
  {/each}
</div>

<style>
  .entity-list {
    padding-top: 5px;
    height: 100%;
    overflow-y: scroll;
  }
</style>
