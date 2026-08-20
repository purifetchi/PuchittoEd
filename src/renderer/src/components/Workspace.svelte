<script lang="ts">
  import { resizePanel, workspaceState } from '../state/workspaceState.svelte'
  import AssetBrowserView from './AssetBrowserView.svelte'
  import EntityAddButton from './entities/EntityAddButton.svelte'
  import EntityList from './EntityList.svelte'
  import InspectorView from './InspectorView.svelte'
  import PuchittoView from './PuchittoView.svelte'
  import ViewTabs from './ViewTabs.svelte'
  import Panel from './workspace/Panel.svelte'
  import PanelHeader from './workspace/PanelHeader.svelte'
  import Splitter from './workspace/Splitter.svelte'
</script>

<div class="workspace">
  <Panel width={workspaceState.hierarchyWidth}>
    <PanelHeader>
      HIERARCHY
      <EntityAddButton />
    </PanelHeader>
    <EntityList />
  </Panel>
  <Splitter onresize={(d) => resizePanel('hierarchyWidth', d)} />
  <Panel flex={1}>
    <ViewTabs />
    <PuchittoView />
    <AssetBrowserView />
  </Panel>
  <Splitter onresize={(d) => resizePanel('inspectorWidth', -d)} />
  <Panel width={workspaceState.inspectorWidth}>
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
