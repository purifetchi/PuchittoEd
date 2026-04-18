<script lang="ts">
  import type { ObjectAntics } from 'puchitto/objects'
  import { editor } from '../../../editor/editorGame'
  import MiniAnticsCard from './MiniAnticsCard.svelte'

  let { id }: { id: number } = $props()

  let antics: ObjectAntics[] = $derived(editor.getObjectById(id).antics)

  $effect(() => {
    antics = editor.getObjectById(id).antics ?? []
  })
</script>

<div>
  {#each antics as antic (antic.script)}
    <MiniAnticsCard {antic} />
  {/each}
</div>

<style>
</style>
