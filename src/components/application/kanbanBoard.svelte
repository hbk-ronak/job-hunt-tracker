<script lang="ts">
  import { applications } from '../../stores/applications';
  import type { Application } from '../../types/Application';
  import { ApplicationStatus } from '../../types/ApplicationStatus';

  export let onEdit: (app: Application) => void;
  export let onViewNotes: (app: Application) => void;
  export let onAdd: () => void;

  let draggedApp: Application | null = null;

  const statusColumns = [
    { status: ApplicationStatus.WISHLIST, color: '#1e3a8a' },
    { status: ApplicationStatus.APPLIED, color: '#7c2d12' },
    { status: ApplicationStatus.PHONE_SCREEN, color: '#713f12' },
    { status: ApplicationStatus.INTERVIEW, color: '#4c1d95' },
    { status: ApplicationStatus.OFFER, color: '#14532d' },
    { status: ApplicationStatus.REJECTED, color: '#7f1d1d' },
  ];

  $: appsByStatus = statusColumns.reduce((acc, col) => {
    acc[col.status] = $applications.filter(app => app.status === col.status);
    return acc;
  }, {} as Record<ApplicationStatus, Application[]>);

  function handleDragStart(app: Application) {
    draggedApp = app;
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
  }

  function handleDrop(event: DragEvent, targetStatus: ApplicationStatus) {
    event.preventDefault();
    if (draggedApp && draggedApp.status !== targetStatus) {
      applications.update(draggedApp.id, { status: targetStatus });
    }
    draggedApp = null;
  }

  function handleDelete(app: Application) {
    if (confirm(`Delete application to ${app.companyName}?`)) {
      applications.delete(app.id);
    }
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
</script>

<div class="kanban-board">
  {#each statusColumns as column}
    <div 
      class="kanban-column"
      on:dragover={handleDragOver}
      on:drop={(e) => handleDrop(e, column.status)}
    >
      <div class="column-header" style="background: {column.color}">
        <h3>{column.status}</h3>
        <span class="count">{appsByStatus[column.status]?.length || 0}</span>
      </div>

      <div class="column-content">
        {#if column.status === ApplicationStatus.WISHLIST}
          <button class="add-card-btn" on:click={onAdd}>
            <span class="plus-icon">+</span>
            <span>New Application</span>
          </button>
        {/if}

        {#each appsByStatus[column.status] || [] as app (app.id)}
          <div
            class="kanban-card"
            draggable="true"
            on:dragstart={() => handleDragStart(app)}
          >
            <div class="card-header-mini">
              <h4>{app.companyName}</h4>
              <button class="card-menu-btn" on:click={() => handleDelete(app)}>×</button>
            </div>
            
            <p class="card-position">{app.position}</p>
            
            <div class="card-meta">
              <span class="card-date">📅 {formatDate(app.appliedDate)}</span>
            </div>

            {#if app.url}
              <a href={app.url} target="_blank" rel="noopener noreferrer" class="card-link">
                🔗 View Posting
              </a>
            {/if}

            <div class="card-actions">
              <button class="action-btn" on:click={() => onViewNotes(app)}>📝</button>
              <button class="action-btn" on:click={() => onEdit(app)}>✏️</button>
            </div>
          </div>
        {/each}

        {#if !appsByStatus[column.status] || appsByStatus[column.status].length === 0}
          {#if column.status !== ApplicationStatus.WISHLIST}
            <div class="empty-column">
              Drop cards here
            </div>
          {/if}
        {/if}
      </div>
    </div>
  {/each}
</div>

