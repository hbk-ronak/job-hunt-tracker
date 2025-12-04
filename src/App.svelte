<script lang="ts">
  import { onMount } from 'svelte';
  import { applications } from './stores/applications';
  import { notes } from './stores/notes';
  import type { Application } from './types/application';
  import KanbanBoard from './components/kanban/kanban_board.svelte';
  import TableView from './components/table/table_view.svelte';
  import NotesBoard from './components/notes/notes_board.svelte';
  import ApplicationForm from './components/application/application_form.svelte';
  import './app.css';

  let search_query = '';
  let show_form = false;
  let editing_app: Application | null = null;
  let view_mode: 'kanban' | 'table' | 'notes' = 'kanban';

  onMount(() => {
    applications.load();
    notes.load();
  });

  function handle_add() {
    editing_app = null;
    show_form = true;
  }

  function handle_edit(app: Application) {
    editing_app = app;
    show_form = true;
  }

  function handle_close_form() {
    show_form = false;
    editing_app = null;
  }

  $: total_count = $applications.length;
  $: active_count = $applications.filter(app => 
    ['Applied', 'Phone Screen', 'Interview'].includes(app.status)
  ).length;
  $: offer_count = $applications.filter(app => app.status === 'Offer').length;
  $: rejected_count = $applications.filter(app => 
    ['Rejected', 'Ghosted'].includes(app.status)
  ).length;
  $: success_rate = total_count > 0 
    ? Math.round((offer_count / total_count) * 100) 
    : 0;
</script>

<main>
  <header>
    <h1>
      <span class="material-symbols-rounded" style="font-size: 2rem; vertical-align: middle;">work</span>
      Job Hunt Tracker
    </h1>
    <div class="header-actions">
      <input 
        type="search" 
        placeholder="Search companies or positions..." 
        bind:value={search_query}
      />
      <div class="view-toggle">
        <button 
          class="toggle-btn" 
          class:active={view_mode === 'kanban'}
          on:click={() => view_mode = 'kanban'}
        >
          Kanban
        </button>
        <button 
          class="toggle-btn" 
          class:active={view_mode === 'table'}
          on:click={() => view_mode = 'table'}
        >
          Table
        </button>
        <button 
          class="toggle-btn" 
          class:active={view_mode === 'notes'}
          on:click={() => view_mode = 'notes'}
        >
          Notes
        </button>
      </div>
      <button class="btn-add" on:click={handle_add}>+ Add</button>
    </div>
  </header>

  <div class="stats">
    <div class="stat-card stat-card-total">
      <div class="stat-icon">
        <span class="material-symbols-rounded">bar_chart</span>
      </div>
      <div class="stat-content">
        <span class="number">{total_count}</span>
        <span class="label">Total Applications</span>
      </div>
    </div>
    <div class="stat-card stat-card-active">
      <div class="stat-icon">
        <span class="material-symbols-rounded">rocket_launch</span>
      </div>
      <div class="stat-content">
        <span class="number">{active_count}</span>
        <span class="label">In Progress</span>
      </div>
    </div>
    <div class="stat-card stat-card-offers">
      <div class="stat-icon">
        <span class="material-symbols-rounded">celebration</span>
      </div>
      <div class="stat-content">
        <span class="number">{offer_count}</span>
        <span class="label">Offers</span>
      </div>
    </div>
    <div class="stat-card stat-card-success">
      <div class="stat-icon">
        <span class="material-symbols-rounded">trending_up</span>
      </div>
      <div class="stat-content">
        <span class="number">{success_rate}%</span>
        <span class="label">Success Rate</span>
      </div>
    </div>
  </div>

  <div class="kanban">
    {#if view_mode === 'kanban'}
      <KanbanBoard on_edit_app={handle_edit} search_query={search_query} />
    {:else if view_mode === 'table'}
      <TableView on_edit_app={handle_edit} search_query={search_query} />
    {:else}
      <NotesBoard />
    {/if}
  </div>
</main>

<ApplicationForm is_open={show_form} on_close={handle_close_form} editing_app={editing_app} />

