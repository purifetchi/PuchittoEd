<script lang="ts">
  import AssetBrowserView from "./AssetBrowserView.svelte"
  import EntityList from "./EntityList.svelte"
  import InspectorView from "./InspectorView.svelte"
  import PuchittoView from "./PuchittoView.svelte"
  import Panel from "./workspace/Panel.svelte"
  import PanelHeader from "./workspace/PanelHeader.svelte"


</script>

<div class="workspace">
  <Panel>
    <PanelHeader>HIERARCHY</PanelHeader>
    <EntityList />
  </Panel>
  <Panel flex={1}>
    <PuchittoView />
    <AssetBrowserView />
  </Panel>
  <Panel>
    <PanelHeader>INSPECTOR</PanelHeader>
    <InspectorView />
  </Panel>
</div>

<style>
  .workspace {
    display: flex;
    height: 100%;
  }
</style>
