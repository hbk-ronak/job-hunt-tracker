import type { Note } from '../types/note';
import { load_from_storage, save_to_storage } from './storage';

const STORAGE_KEY = 'sticky_notes';

export function generate_id(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function load_notes(): Note[] {
  return load_from_storage<Note[]>(STORAGE_KEY, []);
}

export function save_notes(notes: Note[]): void {
  save_to_storage(STORAGE_KEY, notes);
}

export function create_note(data: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note {
  const now = new Date().toISOString();
  const note: Note = {
    ...data,
    id: generate_id(),
    createdAt: now,
    updatedAt: now
  };
  
  const notes = load_notes();
  notes.push(note);
  save_notes(notes);
  
  return note;
}

export function update_note(id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>): Note | null {
  const notes = load_notes();
  const index = notes.findIndex(note => note.id === id);
  
  if (index === -1) {
    return null;
  }
  
  const updated: Note = {
    ...notes[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  notes[index] = updated;
  save_notes(notes);
  
  return updated;
}

export function delete_note(id: string): boolean {
  const notes = load_notes();
  const filtered = notes.filter(note => note.id !== id);
  
  if (filtered.length === notes.length) {
    return false;
  }
  
  save_notes(filtered);
  return true;
}

export function get_note_by_id(id: string): Note | null {
  const notes = load_notes();
  return notes.find(note => note.id === id) || null;
}

