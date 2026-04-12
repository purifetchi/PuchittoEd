<div id="puchitto-view" bind:this={container}>

</div>

<script lang="ts">
  import { onMount } from 'svelte';
  import { editor } from '../editor/editorGame'

  let container: HTMLElement;

  onMount(() => {
    editor.run({
      element: container,
      server: "http://localhost:8080/"
    })
  })
</script>
