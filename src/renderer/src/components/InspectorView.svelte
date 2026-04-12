<script lang="ts">
  import type { GameObject } from "puchitto/objects"
  import { selectionState } from "../state/selectionState.svelte"
  import { editor } from "../editor/editorGame"

  let obj: GameObject<unknown> | undefined = $derived(editor.getObjectById(selectionState.id))
</script>

<div>
  { obj?.name }
  <div>
    { obj?.threeObject.position.x }
    { obj?.threeObject.position.y }
    { obj?.threeObject.position.z }
  </div>
</div>
