<script lang="ts">
  import type { GameObject } from 'puchitto/objects'
  import InspectorPartHeader from './InspectorPartHeader.svelte'
  import SerializedPropertiesInspector from './SerializedPropertiesInspector.svelte'
  import Box from '@lucide/svelte/icons/box'
  import type { EditorEntityDefinition } from '../../editor/data/editorEntityDefinition'
  import { editor } from '../../editor/editorGame'

  let { obj }: { obj: GameObject } = $props()

  let entityDef: EditorEntityDefinition = $state(undefined)

  $effect(() => {
    const type = editor._entityFactory.resolveType(obj)
    if (type === undefined) {
      entityDef = undefined
      return
    }

    entityDef = editor.gameData.entities.find((ent) => ent.type === type)
  })
</script>

{#if entityDef !== undefined}
  <InspectorPartHeader>
    <div slot="icon">
      <Box />
    </div>
    <div slot="name">{entityDef.displayName}</div>
  </InspectorPartHeader>
  <SerializedPropertiesInspector {obj} props={entityDef.properties} />
{/if}

<style>
</style>
