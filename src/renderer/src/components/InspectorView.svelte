<script lang="ts">
  import type { GameObject } from 'puchitto/objects'
  import { selectionState } from '../state/selectionState.svelte'
  import { editor } from '../editor/editorGame'
  import InspectorPartHeader from './inspector/InspectorPartHeader.svelte'
  import Move from '@lucide/svelte/icons/move'
  import Vector3Property from './inspector/properties/Vector3Property.svelte'
  import InspectorPart from './inspector/InspectorPart.svelte'
  import Box from '@lucide/svelte/icons/box'
  import Input from './common/Input.svelte'
  import InspectorRow from './inspector/InspectorRow.svelte'
  import Checkbox from './common/Checkbox.svelte'

  let obj: GameObject<unknown> | undefined = $derived(editor.getObjectById(selectionState.id))
</script>

<div>
  {#if obj !== undefined}
    <InspectorPart>
      <InspectorRow>
        <Checkbox bind:checked={obj.visible} />
        <Box />
        <Input bind:value={obj.name} />
      </InspectorRow>
    </InspectorPart>
    <InspectorPartHeader>
      <div slot="icon">
        <Move></Move>
      </div>
      <div slot="name">Transform</div>
    </InspectorPartHeader>
    <InspectorPart>
      <Vector3Property name="Position" accessor={() => obj.threeObject.position} setter={(x, y, z) => obj.threeObject.position.set(x,y,z)} />
      <Vector3Property name="Rotation" accessor={() => obj.threeObject.rotation} setter={(x, y, z) => obj.threeObject.rotation.set(x,y,z)} />
      <Vector3Property name="Scale" accessor={() => obj.threeObject.scale}  setter={(x, y, z) => obj.threeObject.scale.set(x,y,z)} />
    </InspectorPart>
    <InspectorPartHeader>
      <div slot="icon">
        <Box></Box>
      </div>
      <div slot="name">{obj.constructor.name}</div>
    </InspectorPartHeader>
  {/if}
</div>
