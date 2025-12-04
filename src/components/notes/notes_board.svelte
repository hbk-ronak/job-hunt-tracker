<script lang="ts">
  import { notes } from '../../stores/notes';
  import type { Note } from '../../types/note';
  import NoteCard from './note_card.svelte';
  import './notes_board.css';

  export let show_form = false;

  let filtered_notes: Note[] = [];
  let selected_tag: string | null = null;
  let all_tags: string[] = [];
  let editing_note: Note | null = null;

  // Form fields
  let title = '';
  let content = '';
  let color = '#1e293b';
  let tags_input = '';

  const color_options = [
    { name: 'Slate', value: '#1e293b' },
    { name: 'Blue', value: '#1e40af' },
    { name: 'Purple', value: '#6b21a8' },
    { name: 'Emerald', value: '#065f46' },
    { name: 'Amber', value: '#92400e' },
    { name: 'Red', value: '#991b1b' }
  ];

  $: {
    all_tags = Array.from(new Set($notes.flatMap(note => note.tags))).sort();
    
    if (selected_tag) {
      filtered_notes = $notes.filter(note => note.tags.includes(selected_tag));
    } else {
      filtered_notes = $notes;
    }
  }

  $: if (editing_note) {
    title = editing_note.title;
    content = editing_note.content;
    color = editing_note.color;
    tags_input = editing_note.tags.join(', ');
  }

  function open_edit_note(note: Note) {
    editing_note = note;
    show_form = true;
  }

  $: if (show_form && !editing_note) {
    // Form opened from parent (Add button), clear editing state
    reset_form();
  }

  function handle_submit() {
    if (!title.trim()) return;

    const tags = tags_input
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    if (editing_note) {
      notes.update(editing_note.id, {
        title: title.trim(),
        content: content.trim(),
        color,
        tags
      });
    } else {
      notes.add({
        title: title.trim(),
        content: content.trim(),
        color,
        tags
      });
    }

    reset_form();
    show_form = false;
  }

  function handle_delete(note: Note) {
    if (confirm(`Delete note "${note.title}"?`)) {
      notes.delete(note.id);
    }
  }

  function reset_form() {
    title = '';
    content = '';
    color = '#1e293b';
    tags_input = '';
    editing_note = null;
  }

  function close_form() {
    reset_form();
    show_form = false;
  }
</script>

<div class="notes-container">
  <div class="notes-header">
    <div class="tag-filters">
      <button 
        class="tag-filter" 
        class:active={!selected_tag}
        on:click={() => selected_tag = null}
      >
        All Notes ({$notes.length})
      </button>
      {#each all_tags as tag}
        <button 
          class="tag-filter" 
          class:active={selected_tag === tag}
          on:click={() => selected_tag = tag}
        >
          {tag}
        </button>
      {/each}
    </div>
  </div>

  <div class="notes-grid">
    {#each filtered_notes as note (note.id)}
      <NoteCard 
        {note} 
        on_click={() => open_edit_note(note)}
        on_delete={() => handle_delete(note)}
      />
    {/each}
  </div>

  {#if filtered_notes.length === 0}
    <div class="empty-state">
      <span class="material-symbols-rounded">note_add</span>
      <p>{selected_tag ? `No notes with tag "${selected_tag}"` : 'No notes yet. Create your first note!'}</p>
    </div>
  {/if}
</div>

{#if show_form}
  <div class="overlay" on:click={close_form} role="button" tabindex="-1"></div>
  <div class="note-form-sidebar" class:open={show_form}>
    <div class="form-header">
      <h2>{editing_note ? 'Edit Note' : 'New Note'}</h2>
      <button class="btn-close" on:click={close_form}>×</button>
    </div>

    <form on:submit|preventDefault={handle_submit}>
      <div class="form-group">
        <label for="title">Title *</label>
        <input id="title" type="text" bind:value={title} required />
      </div>

      <div class="form-group">
        <label for="content">Content</label>
        <textarea id="content" bind:value={content} rows="8" placeholder="Write your note..."></textarea>
      </div>

      <div class="form-group">
        <label>Color</label>
        <div class="color-options">
          {#each color_options as option}
            <button
              type="button"
              class="color-option"
              class:selected={color === option.value}
              style="background-color: {option.value}"
              on:click={() => color = option.value}
              title={option.name}
            >
              {#if color === option.value}
                <span class="material-symbols-rounded">check</span>
              {/if}
            </button>
          {/each}
        </div>
      </div>

      <div class="form-group">
        <label for="tags">Tags (comma separated)</label>
        <input id="tags" type="text" bind:value={tags_input} placeholder="work, personal, ideas" />
      </div>

      <div class="form-actions">
        <button type="button" class="btn-cancel" on:click={close_form}>Cancel</button>
        <button type="submit" class="btn-submit">{editing_note ? 'Save' : 'Create'}</button>
      </div>
    </form>
  </div>
{/if}

