<script lang="ts">
  import Plus from '@lucide/svelte/icons/plus'
  import Folder from '@lucide/svelte/icons/folder'
  import Ghost from '@lucide/svelte/icons/ghost'
  import { afterEditorReady } from '../editor/helpers/loadHelpers'
  import { editor } from '../editor/editorGame'

  const newLevel = async (): Promise<void> => {
    const selected = await window.puchittoAPI.selectNewProjectFolder()

    if (selected) {
      afterEditorReady(async () => {
        editor.newScene()
      })
    }
  }

  const loadLevel = async (): Promise<void> => {
    const selected = await window.puchittoAPI.selectProject()
    if (selected) {
      afterEditorReady(async () => {
        await editor.loadLevel()
      })
    }
  }
</script>

<div class="welcome">
  <div class="container">
    <div class="left">
      <div class="branding">
        <h1>PuchittoEd</h1>
        <div>like puchitto rock shooter but it edits</div>
      </div>
      <div class="actions">
        <button class="action primary" onclick={newLevel}>
          <Plus size="18" />
          <span class="text">
            <span class="title">New realm</span>
            <span class="sub">Create an empty realm</span>
          </span>
        </button>
        <button class="action" onclick={loadLevel}>
          <Folder size="18" />
          <span class="text">
            <span class="title">Load realm</span>
            <span class="sub">Load an existing realm from disk</span>
          </span>
        </button>
      </div>
    </div>
    <div class="right">
      <div class="recent">
        <span>recent</span>
        <span class="clear">clear</span>
      </div>
      <div class="items">
        <!-- TODO -->
        <div class="empty">
          <div class="ghost">
            <Ghost size="48" />
          </div>
          <div>No recent realms found.</div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .welcome {
    display: flex;
    flex: 1;
    height: 100%;
    align-items: center;
    justify-content: center;
  }

  .container {
    display: flex;
    width: 100%;
    max-width: 720px;
    max-height: 100%;
  }

  .left {
    display: flex;
    flex-direction: column;
    gap: 30px;
    flex: 1;
    padding-right: 40px;
  }

  .right {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding-left: 40px;
    border-left: 1px solid var(--border-color);
  }

  .left .branding {
    display: flex;
    flex-direction: column;
  }

  .left .actions {
    display: flex;
    flex-direction: column;
    gap: 9px;
    max-width: 300px;
  }

  .action {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    text-align: left;
    border: 1px solid var(--border-color);
    border-radius: 5px;
    background: var(--bg-panel);
    color: var(--text-main);
    padding: 12px 14px;
    cursor: pointer;
    font: inherit;
  }

  .action.primary {
    background: var(--accent);
    border: 1px solid var(--accent);
  }

  .action.primary:hover {
    background: var(--accent-hover);
    border: 1px solid var(--accent);
  }

  .action:hover {
    background: var(--bg-hover);
    border: 1px solid var(--accent);
  }

  .action .text {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .action .text .title {
    color: white;
    font-size: 14px;
    font-weight: 600;
  }

  .action .text .sub {
    color: rgba(255, 255, 255, 0.7);
    font-size: 12px;
    font-weight: 300;
  }

  .recent {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--text-muted);
    text-transform: uppercase;

    font-size: 11px;
    margin-bottom: 15px;
  }

  .recent .clear {
    cursor: pointer;
  }

  .recent .clear:hover {
    color: var(--text-main);
  }

  .right .items {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .items .empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: var(--text-muted);
    font-size: 11px;
    font-style: italic;
  }

  .items .empty .ghost {
    opacity: 0.3;
  }
</style>
