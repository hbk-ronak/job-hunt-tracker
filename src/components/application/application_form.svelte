<script lang="ts">
  import { applications } from '../../stores/applications';
  import { ApplicationStatus } from '../../types/application_status';
  import type { Application } from '../../types/application';
  import './application_form.css';

  export let is_open = false;
  export let on_close: () => void;
  export let editing_app: Application | null = null;

  let company_name = '';
  let position = '';
  let url = '';

  $: if (editing_app) {
    company_name = editing_app.companyName;
    position = editing_app.position;
    url = editing_app.url || '';
  }

  function handle_submit() {
    if (!company_name.trim() || !position.trim()) return;

    if (editing_app) {
      applications.update(editing_app.id, {
        companyName: company_name.trim(),
        position: position.trim(),
        url: url.trim() || undefined
      });
    } else {
      applications.add({
        companyName: company_name.trim(),
        position: position.trim(),
        status: ApplicationStatus.WISHLIST,
        appliedDate: new Date().toISOString().split('T')[0],
        url: url.trim() || undefined
      });
    }

    reset_form();
    on_close();
  }

  function reset_form() {
    company_name = '';
    position = '';
    url = '';
  }
</script>

{#if is_open}
  <div class="overlay" on:click={on_close} role="button" tabindex="-1"></div>
  <div class="sidebar" class:open={is_open}>
    <div class="sidebar-header">
      <h2>{editing_app ? 'Edit Application' : 'New Application'}</h2>
      <button class="btn-close" on:click={on_close}>×</button>
    </div>

    <form on:submit|preventDefault={handle_submit}>
      <div class="form-group">
        <label for="company">Company *</label>
        <input id="company" type="text" bind:value={company_name} required />
      </div>

      <div class="form-group">
        <label for="position">Position *</label>
        <input id="position" type="text" bind:value={position} required />
      </div>

      <div class="form-group">
        <label for="url">Job URL</label>
        <input id="url" type="url" bind:value={url} placeholder="https://..." />
      </div>

      <div class="form-actions">
        <button type="button" class="btn-cancel" on:click={on_close}>Cancel</button>
        <button type="submit" class="btn-submit">{editing_app ? 'Update' : 'Create'}</button>
      </div>
    </form>
  </div>
{/if}

