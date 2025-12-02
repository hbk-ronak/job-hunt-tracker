<script lang="ts">
  import { applications } from '../../stores/applications';
  import { ApplicationStatus } from '../../types/application_status';
  import type { Application } from '../../types/application';
  import ApplicationDetail from '../application/application_detail.svelte';
  import StatusUpdateModal from '../application/status_update_modal.svelte';
  import './table_view.css';

  export let on_edit_app: (app: Application) => void;
  export let search_query = '';

  let selected_app: Application | null = null;
  let status_update_app: Application | null = null;
  let sort_by: 'company' | 'position' | 'status' | 'date' = 'date';
  let sort_dir: 'asc' | 'desc' = 'desc';
  let visible_statuses = new Set(Object.values(ApplicationStatus));
  let show_filter = false;

  $: filtered_apps = $applications.filter(app => {
    const matches_search = !search_query || 
      app.companyName.toLowerCase().includes(search_query.toLowerCase()) ||
      app.position.toLowerCase().includes(search_query.toLowerCase());
    const matches_status = visible_statuses.has(app.status);
    return matches_search && matches_status;
  });

  $: sorted_apps = [...filtered_apps].sort((a, b) => {
    let result = 0;
    
    if (sort_by === 'company') {
      result = a.companyName.localeCompare(b.companyName);
    } else if (sort_by === 'position') {
      result = a.position.localeCompare(b.position);
    } else if (sort_by === 'status') {
      result = a.status.localeCompare(b.status);
    } else {
      result = new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime();
    }
    
    return sort_dir === 'asc' ? result : -result;
  });

  function handle_sort(column: typeof sort_by) {
    if (sort_by === column) {
      sort_dir = sort_dir === 'asc' ? 'desc' : 'asc';
    } else {
      sort_by = column;
      sort_dir = 'desc';
    }
  }

  function handle_row_click(app: Application) {
    selected_app = app;
  }

  function handle_close_detail() {
    selected_app = null;
  }

  function handle_edit() {
    if (selected_app) {
      on_edit_app(selected_app);
      selected_app = null;
    }
  }

  function handle_delete() {
    if (selected_app && confirm(`Delete application to ${selected_app.companyName}?`)) {
      applications.delete(selected_app.id);
      selected_app = null;
    }
  }

  function format_date(date_string: string): string {
    const date = new Date(date_string);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }

  function toggle_status(status: ApplicationStatus) {
    if (visible_statuses.has(status)) {
      visible_statuses.delete(status);
    } else {
      visible_statuses.add(status);
    }
    visible_statuses = visible_statuses;
  }

  function handle_status_click(event: MouseEvent, app: Application) {
    event.stopPropagation();
    status_update_app = app;
  }

  function handle_close_status_modal() {
    status_update_app = null;
  }
</script>

<div class="table-controls">
  <button class="filter-btn" on:click={() => show_filter = !show_filter}>
    <span class="material-symbols-rounded" style="font-size: 1.125rem; vertical-align: middle;">filter_list</span>
    Filter Status
  </button>
  
  {#if show_filter}
    <div class="filter-overlay" on:click={() => show_filter = false} role="button" tabindex="-1"></div>
    <div class="filter-dropdown" on:click|stopPropagation role="dialog">
      {#each Object.values(ApplicationStatus) as status}
        <label class="filter-option">
          <input 
            type="checkbox" 
            checked={visible_statuses.has(status)}
            on:change={() => toggle_status(status)}
          />
          <span>{status}</span>
        </label>
      {/each}
    </div>
  {/if}
</div>

<div class="table-container">
  <table class="applications-table">
    <thead>
      <tr>
        <th on:click={() => handle_sort('company')} class="sortable">
          Company {sort_by === 'company' ? (sort_dir === 'asc' ? '↑' : '↓') : ''}
        </th>
        <th on:click={() => handle_sort('position')} class="sortable">
          Position {sort_by === 'position' ? (sort_dir === 'asc' ? '↑' : '↓') : ''}
        </th>
        <th on:click={() => handle_sort('status')} class="sortable">
          Status {sort_by === 'status' ? (sort_dir === 'asc' ? '↑' : '↓') : ''}
        </th>
        <th on:click={() => handle_sort('date')} class="sortable">
          Applied {sort_by === 'date' ? (sort_dir === 'asc' ? '↑' : '↓') : ''}
        </th>
        <th>Salary</th>
        <th>Location</th>
      </tr>
    </thead>
    <tbody>
      {#each sorted_apps as app (app.id)}
        <tr on:click={() => handle_row_click(app)} class="table-row">
          <td class="company">{app.companyName}</td>
          <td>{app.position}</td>
          <td>
            <button 
              class="status-badge" 
              on:click={(e) => handle_status_click(e, app)}
              title="Click to change status"
            >
              {app.status}
            </button>
          </td>
          <td class="date">{format_date(app.appliedDate)}</td>
          <td class="muted">{app.salary || '—'}</td>
          <td class="muted">{app.location || '—'}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  {#if sorted_apps.length === 0}
    <div class="empty-state">
      <p>No applications found</p>
    </div>
  {/if}
</div>

<ApplicationDetail 
  application={selected_app}
  on_close={handle_close_detail}
  on_edit={handle_edit}
  on_delete={handle_delete}
/>

<StatusUpdateModal 
  application={status_update_app}
  on_close={handle_close_status_modal}
/>

