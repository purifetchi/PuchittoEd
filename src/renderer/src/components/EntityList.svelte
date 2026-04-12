<script lang="ts">
  import { onMount } from "svelte"
  import { editor } from "../editor/editorGame"

  let objects = []

  onMount(() => {
    editor.eventStream.on("objectAttached", _ => {
      objects = [...editor._objects]
    })
  })
</script>

<div>
  <div>Entities:</div>
  {#each objects as object}
    <div>{object.id} - {object.name}</div>
  {/each}
</div>
