<script lang="ts">
  import MenuBar from './components/MenuBar.svelte'
  import ModalHost from './components/modals/ModalHost.svelte'
  import Welcome from './components/Welcome.svelte'
  import Workspace from './components/Workspace.svelte'
  import { projectState } from './state/projectState.svelte'
</script>

<MenuBar />
<ModalHost />

{#if projectState.project === ''}
  <Welcome />
{:else}
  <Workspace />
{/if}
