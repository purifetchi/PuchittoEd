<script lang="ts">
  import { onMount } from 'svelte'
  import { editor } from '../editor/editorGame'
  import { OfflineNetworkListener } from '../editor/offlineNetworkListener'

  let container: HTMLElement

  onMount(() => {
    editor.run({
      element: container,
      server: '',
      listenerFactory: () => new OfflineNetworkListener()
    })

    editor.newScene()
  })
</script>

<div id="puchitto-view" bind:this={container}></div>

<style>
  #puchitto-view {
    width: 100%;
    height: 100%;
    flex: 1;
    background: var(--bg-deep);
  }
</style>
