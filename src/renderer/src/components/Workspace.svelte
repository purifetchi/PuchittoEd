<script lang="ts">
  import { Camera, Globe, FileBox, SquareTerminal } from '@lucide/svelte'
  import { resizePanel, workspaceState } from '../state/workspaceState.svelte'
  import AssetBrowserView from './AssetBrowserView.svelte'
  import EntityAddButton from './entities/EntityAddButton.svelte'
  import EntityList from './EntityList.svelte'
  import InspectorView from './InspectorView.svelte'
  import PuchittoView from './PuchittoView.svelte'
  import Panel from './workspace/Panel.svelte'
  import PanelHeader from './workspace/PanelHeader.svelte'
  import Splitter from './workspace/Splitter.svelte'
  import Tabs from './workspace/Tabs.svelte'
  import { projectState, setViewMode } from '../state/projectState.svelte'
  import HorizontalPanel from './workspace/HorizontalPanel.svelte'
  import ConsoleView from './ConsoleView.svelte'

  const viewTabs = [
    { value: 'editor', name: 'Editor', icon: Globe },
    { value: 'camera', name: 'Camera', icon: Camera }
  ]

  const assetTabs = [
    { value: 'assets', name: 'Assets', icon: FileBox },
    { value: 'console', name: 'Console', icon: SquareTerminal }
  ]
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
    <HorizontalPanel flex={1}>
      <Tabs
        tabs={viewTabs}
        value={projectState.viewMode}
        onchange={(val: 'camera' | 'editor') => setViewMode(val)}
      />
      <PuchittoView />
    </HorizontalPanel>
    <Splitter onresize={(d) => resizePanel('assetBrowserWidth', -d)} direction="horizontal" />
    <HorizontalPanel height={workspaceState.assetBrowserWidth}>
      <Tabs
        tabs={assetTabs}
        value={projectState.assetMode}
        onchange={(val: 'assets' | 'console') => (projectState.assetMode = val)}
        splits="top"
      />
      {#if projectState.assetMode === 'assets'}
        <AssetBrowserView />
      {:else if projectState.assetMode === 'console'}
        <ConsoleView />
      {/if}
    </HorizontalPanel>
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
    flex: 1;
    min-height: 0;
  }
</style>
