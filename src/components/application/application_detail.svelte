<script lang="ts">
  import type { Application } from '../../types/application';
  import './application_detail.css';

  export let application: Application | null = null;
  export let on_close: () => void;
  export let on_edit: () => void;
  export let on_delete: () => void;

  function format_date(date_string: string): string {
    const date = new Date(date_string);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
</script>

{#if application}
  <div class="modal-overlay" on:click={on_close} role="button" tabindex="-1">
    <div class="modal-content" on:click|stopPropagation role="dialog">
      <div class="modal-header">
        <div>
          <h2>{application.companyName}</h2>
          <p class="position">{application.position}</p>
        </div>
        <button class="btn-close" on:click={on_close}>×</button>
      </div>

      <div class="modal-body">
        <div class="detail-row">
          <span class="label">Status</span>
          <span class="status-badge">{application.status}</span>
        </div>

        <div class="detail-row">
          <span class="label">Applied Date</span>
          <span class="value">{format_date(application.appliedDate)}</span>
        </div>

        {#if application.salary}
          <div class="detail-row">
            <span class="label">Salary</span>
            <span class="value">{application.salary}</span>
          </div>
        {/if}

        {#if application.location}
          <div class="detail-row">
            <span class="label">Location</span>
            <span class="value">{application.location}</span>
          </div>
        {/if}

        {#if application.url}
          <div class="detail-row">
            <span class="label">Job URL</span>
            <a href={application.url} target="_blank" rel="noopener noreferrer" class="link">
              View Posting →
            </a>
          </div>
        {/if}

        {#if application.notes}
          <div class="detail-section">
            <span class="label">Notes</span>
            <p class="notes">{application.notes}</p>
          </div>
        {/if}
      </div>

      <div class="modal-footer">
        <button class="btn-delete" on:click={on_delete}>Delete</button>
        <button class="btn-edit" on:click={on_edit}>Edit</button>
      </div>
    </div>
  </div>
{/if}

