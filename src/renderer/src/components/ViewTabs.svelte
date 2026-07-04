<script lang="ts">
  import Camera from '@lucide/svelte/icons/camera'
  import Globe from '@lucide/svelte/icons/globe'
</script>

<div class="view-tabs">
  <button class="tab active">
    <span class="icon">
      <Globe size="14" />
    </span>
    <span>Editor</span>
  </button>
  <button class="tab">
    <span class="icon">
      <Camera size="14" />
    </span>
    Camera
  </button>
</div>

<style>
  .view-tabs {
    display: flex;
    align-items: stretch;
    flex-shrink: 0;
    height: 26px;
    background: var(--bg-header);
    border-bottom: 1px solid var(--border-color);
  }

  .view-tabs .tab {
    display: flex;
    text-align: left;
    align-items: center;
    vertical-align: middle;
    font: inherit;

    gap: 6px;
    padding: 0 14px;
    font-size: 12px;
    cursor: pointer;
    position: relative;

    background: inherit;
    color: var(--text-muted);
    border: none;
    border-right: 1px solid var(--border-color);
  }

  .view-tabs .tab .icon {
    display: flex;
    align-items: center;
  }

  .tab.active {
    background: var(--bg-deep) !important;
    color: white !important;
  }

  .tab.active::after {
    content: '';
    position: absolute;

    width: 100%;
    height: 2px;
    left: 0;
    bottom: -1px;
    background: var(--accent-hover);
  }

  .view-tabs .tab:hover {
    background: var(--bg-hover);
    color: var(--text-main);
  }
</style>
