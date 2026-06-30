<script lang="ts">
  import DialogModalSkeleton from './DialogModalSkeleton.svelte'

  let { close } = $props()
</script>

<DialogModalSkeleton {close}>
  <h3>PuchittoEd</h3>
  <p>Realm editor for Puchitto. Blah blah blah I am but a tiny about dialog modal.</p>
  <p>Add a cute anime girl or something please.</p>
  <p>Multiline text.</p>
</DialogModalSkeleton>

<style>
  h3 {
    margin-bottom: 7px;
  }
  p {
    line-height: 1.5;
    color: var(--text-muted);
  }
</style>
