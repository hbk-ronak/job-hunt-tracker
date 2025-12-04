import { writable } from 'svelte/store';
import type { Note } from '../types/note';
import * as note_service from '../services/note_service';

function create_note_store() {
  const { subscribe, set, update } = writable<Note[]>([]);
  
  return {
    subscribe,
    load: () => {
      const notes = note_service.load_notes();
      set(notes);
    },
    add: (data: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
      const new_note = note_service.create_note(data);
      update(notes => [...notes, new_note]);
      return new_note;
    },
    update: (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => {
      const updated = note_service.update_note(id, updates);
      if (updated) {
        update(notes => notes.map(note => note.id === id ? updated : note));
      }
      return updated;
    },
    delete: (id: string) => {
      const success = note_service.delete_note(id);
      if (success) {
        update(notes => notes.filter(note => note.id !== id));
      }
      return success;
    }
  };
}

export const notes = create_note_store();

