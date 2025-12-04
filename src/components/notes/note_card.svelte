<script lang="ts">
  import type { Note } from '../../types/note';
  import './note_card.css';

  export let note: Note;
  export let on_click: () => void;
  export let on_delete: () => void;
</script>

<div class="note-card" style="--note-color: {note.color}" on:click={on_click} role="button" tabindex="0">
  <div class="note-header">
    <h3 class="note-title">{note.title}</h3>
    <button class="btn-delete-note" on:click|stopPropagation={on_delete}>
      <span class="material-symbols-rounded">delete</span>
    </button>
  </div>
  
  <div class="note-content">
    {note.content}
  </div>
  
  {#if note.tags.length > 0}
    <div class="note-tags">
      {#each note.tags as tag}
        <span class="tag">{tag}</span>
      {/each}
    </div>
  {/if}
</div>

