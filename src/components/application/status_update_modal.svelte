<script lang="ts">
  import { ApplicationStatus } from '../../types/application_status';
  import type { Application } from '../../types/application';
  import { applications } from '../../stores/applications';
  import './status_update_modal.css';

  export let application: Application | null = null;
  export let on_close: () => void;

  function handle_status_change(new_status: ApplicationStatus) {
    if (application) {
      applications.update(application.id, { status: new_status });
      on_close();
    }
  }

  function handle_overlay_click() {
    on_close();
  }

  const status_options = [
    { value: ApplicationStatus.WISHLIST, label: 'Wishlist', icon: 'star', color: '#6366f1' },
    { value: ApplicationStatus.APPLIED, label: 'Applied', icon: 'send', color: '#8b5cf6' },
    { value: ApplicationStatus.PHONE_SCREEN, label: 'Phone Screen', icon: 'call', color: '#ec4899' },
    { value: ApplicationStatus.INTERVIEW, label: 'Interview', icon: 'groups', color: '#f59e0b' },
    { value: ApplicationStatus.OFFER, label: 'Offer', icon: 'celebration', color: '#10b981' },
    { value: ApplicationStatus.REJECTED, label: 'Rejected', icon: 'cancel', color: '#ef4444' },
    { value: ApplicationStatus.GHOSTED, label: 'Ghosted', icon: 'visibility_off', color: '#6b7280' },
  ];
</script>

{#if application}
  <div class="status-modal-overlay" on:click={handle_overlay_click} role="button" tabindex="-1">
    <div class="status-modal-content" on:click|stopPropagation role="dialog">
      <div class="status-modal-header">
        <h3>Update Status</h3>
        <button class="btn-close-modal" on:click={on_close}>×</button>
      </div>
      
      <div class="status-modal-body">
        <p class="application-info">
          <strong>{application.companyName}</strong> - {application.position}
        </p>
        
        <div class="status-options">
          {#each status_options as option}
            <button
              class="status-option"
              class:active={application.status === option.value}
              style="border-color: {option.color};"
              on:click={() => handle_status_change(option.value)}
            >
              <span class="material-symbols-rounded status-icon" style="color: {option.color};">{option.icon}</span>
              <span class="status-label">{option.label}</span>
              {#if application.status === option.value}
                <span class="material-symbols-rounded check-mark">check_circle</span>
              {/if}
            </button>
          {/each}
        </div>
      </div>
    </div>
  </div>
{/if}

