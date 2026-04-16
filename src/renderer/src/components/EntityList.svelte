<script lang="ts">
  import { onMount } from 'svelte'
  import { editor } from '../editor/editorGame'
  import EntityListItem from './entities/EntityListItem.svelte'
  import type { GameObject } from 'puchitto/objects'
  import { resetSelectedObject, selectionState } from '../state/selectionState.svelte'

  let objects: GameObject<unknown>[] = []

  let onclicked = (id: number): void => {
    selectionState.id = id
  }

  let reloadObjects = (): void => {
    objects = [...editor._objects.filter((obj) => obj.tag !== 'editor')]
  }

  onMount(() => {
    editor.eventStream.on('objectAttached', () => {
      reloadObjects()
    })

    editor.eventStream.on('objectRemoved', () => {
      reloadObjects()
    })

    editor.eventStream.on('sceneCreated', () => {
      resetSelectedObject()
      reloadObjects()
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
