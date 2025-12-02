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
  let status = ApplicationStatus.WISHLIST;
  let applied_date = new Date().toISOString().split('T')[0];
  let salary = '';
  let location = '';
  let url = '';
  let notes = '';

  $: if (editing_app) {
    company_name = editing_app.companyName;
    position = editing_app.position;
    status = editing_app.status;
    applied_date = editing_app.appliedDate;
    salary = editing_app.salary || '';
    location = editing_app.location || '';
    url = editing_app.url || '';
    notes = editing_app.notes || '';
  }

  function handle_submit() {
    if (!company_name.trim() || !position.trim()) return;

    if (editing_app) {
      applications.update(editing_app.id, {
        companyName: company_name.trim(),
        position: position.trim(),
        status,
        appliedDate: applied_date,
        salary: salary.trim() || undefined,
        location: location.trim() || undefined,
        url: url.trim() || undefined,
        notes: notes.trim() || undefined
      });
    } else {
      applications.add({
        companyName: company_name.trim(),
        position: position.trim(),
        status,
        appliedDate: applied_date,
        salary: salary.trim() || undefined,
        location: location.trim() || undefined,
        url: url.trim() || undefined,
        notes: notes.trim() || undefined
      });
    }

    reset_form();
    on_close();
  }

  function reset_form() {
    company_name = '';
    position = '';
    status = ApplicationStatus.WISHLIST;
    applied_date = new Date().toISOString().split('T')[0];
    salary = '';
    location = '';
    url = '';
    notes = '';
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
        <label for="status">Status</label>
        <select id="status" bind:value={status}>
          {#each Object.values(ApplicationStatus) as s}
            <option value={s}>{s}</option>
          {/each}
        </select>
      </div>

      <div class="form-group">
        <label for="date">Applied Date</label>
        <input id="date" type="date" bind:value={applied_date} />
      </div>

      <div class="form-group">
        <label for="salary">Salary</label>
        <input id="salary" type="text" bind:value={salary} placeholder="$120k - $150k" />
      </div>

      <div class="form-group">
        <label for="location">Location</label>
        <input id="location" type="text" bind:value={location} placeholder="Remote, San Francisco" />
      </div>

      <div class="form-group">
        <label for="url">Job URL</label>
        <input id="url" type="url" bind:value={url} placeholder="https://..." />
      </div>

      <div class="form-group">
        <label for="notes">Notes</label>
        <textarea id="notes" bind:value={notes} rows="4" placeholder="Additional notes..."></textarea>
      </div>

      <div class="form-actions">
        <button type="button" class="btn-cancel" on:click={on_close}>Cancel</button>
        <button type="submit" class="btn-submit">{editing_app ? 'Update' : 'Create'}</button>
      </div>
    </form>
  </div>
{/if}

