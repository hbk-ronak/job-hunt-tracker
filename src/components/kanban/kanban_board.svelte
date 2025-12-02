<script lang="ts">
  import { applications } from '../../stores/applications';
  import { ApplicationStatus } from '../../types/application_status';
  import type { Application } from '../../types/application';
  import ApplicationDetail from '../application/application_detail.svelte';
  import StatusUpdateModal from '../application/status_update_modal.svelte';
  import './kanban_board.css';

  export let on_edit_app: (app: Application) => void;
  export let search_query = '';

  let dragged_app: Application | null = null;
  let drag_over_column: string | null = null;
  let selected_app: Application | null = null;
  let status_update_app: Application | null = null;

  const columns = [
    { 
      id: 'wishlist',
      title: 'Wishlist', 
      icon: 'star', 
      color: '#6366f1',
      statuses: [ApplicationStatus.WISHLIST]
    },
    { 
      id: 'applied',
      title: 'Applied', 
      icon: 'rocket_launch', 
      color: '#8b5cf6',
      statuses: [ApplicationStatus.APPLIED, ApplicationStatus.PHONE_SCREEN, ApplicationStatus.INTERVIEW]
    },
    { 
      id: 'done',
      title: 'Done', 
      icon: 'check_circle', 
      color: '#10b981',
      statuses: [ApplicationStatus.REJECTED, ApplicationStatus.GHOSTED, ApplicationStatus.OFFER]
    },
  ];

  $: filtered_apps = search_query
    ? $applications.filter(app =>
        app.companyName.toLowerCase().includes(search_query.toLowerCase()) ||
        app.position.toLowerCase().includes(search_query.toLowerCase())
      )
    : $applications;

  $: apps_by_column = columns.reduce((acc, col) => {
    acc[col.id] = filtered_apps.filter(app => col.statuses.includes(app.status));
    return acc;
  }, {} as Record<string, Application[]>);

  function handle_drag_start(app: Application) {
    dragged_app = app;
  }

  function handle_drag_over(event: DragEvent, column_id: string) {
    event.preventDefault();
    drag_over_column = column_id;
  }

  function handle_drag_leave() {
    drag_over_column = null;
  }

  function handle_drop(event: DragEvent, column_id: string) {
    event.preventDefault();
    if (dragged_app) {
      const column = columns.find(col => col.id === column_id);
      if (column) {
        // When dropping to Applied column, set status to Applied
        // When dropping to Done column, set status to Offer (assuming positive outcome)
        // When dropping to Wishlist, set status to Wishlist
        let new_status: ApplicationStatus;
        if (column_id === 'wishlist') {
          new_status = ApplicationStatus.WISHLIST;
        } else if (column_id === 'applied') {
          new_status = ApplicationStatus.APPLIED;
        } else {
          // For done column, keep current status if already in done statuses, otherwise set to Offer
          new_status = column.statuses.includes(dragged_app.status) 
            ? dragged_app.status 
            : ApplicationStatus.OFFER;
        }
        
        if (dragged_app.status !== new_status) {
          applications.update(dragged_app.id, { status: new_status });
        }
      }
    }
    dragged_app = null;
    drag_over_column = null;
  }

  function format_date(date_string: string): string {
    const date = new Date(date_string);
    const now = new Date();
    const diff_days = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff_days === 0) return 'Today';
    if (diff_days === 1) return 'Yesterday';
    if (diff_days < 7) return `${diff_days}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function handle_card_click(app: Application) {
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

  function handle_status_click(event: MouseEvent, app: Application) {
    event.stopPropagation();
    status_update_app = app;
  }

  function handle_close_status_modal() {
    status_update_app = null;
  }
</script>

<div class="kanban-board">
  {#each columns as column}
    <div 
      class="kanban-column"
      class:drag-over={drag_over_column === column.id}
      on:dragover={(e) => handle_drag_over(e, column.id)}
      on:dragleave={handle_drag_leave}
      on:drop={(e) => handle_drop(e, column.id)}
      role="region"
      aria-label="{column.title} column"
    >
      <div class="column-header" style="background: {column.color}">
        <div class="header-content">
          <span class="material-symbols-rounded icon">{column.icon}</span>
          <h3>{column.title}</h3>
        </div>
        <span class="count">{apps_by_column[column.id]?.length || 0}</span>
      </div>

      <div class="column-content">
        {#each apps_by_column[column.id] || [] as app (app.id)}
          <div
            class="card"
            draggable="true"
            on:dragstart={() => handle_drag_start(app)}
            on:click={() => handle_card_click(app)}
            role="button"
            tabindex="0"
          >
            <h4>{app.companyName}</h4>
            <p class="position">{app.position}</p>
            <div class="card-footer">
              <button 
                class="status-badge-small" 
                on:click={(e) => handle_status_click(e, app)}
                title="Click to change status"
              >
                {app.status}
              </button>
              <span class="date">{format_date(app.appliedDate)}</span>
            </div>
          </div>
        {/each}

        {#if !apps_by_column[column.id] || apps_by_column[column.id].length === 0}
          <div class="empty">Drop cards here</div>
        {/if}
      </div>
    </div>
  {/each}
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

