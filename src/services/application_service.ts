import type { Application } from '../types/application';
import { load_from_storage, save_to_storage } from './storage';

const STORAGE_KEY = 'job_applications';

export function generate_id(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function load_applications(): Application[] {
  return load_from_storage<Application[]>(STORAGE_KEY, []);
}

export function save_applications(applications: Application[]): void {
  save_to_storage(STORAGE_KEY, applications);
}

export function create_application(data: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>): Application {
  const now = new Date().toISOString();
  const application: Application = {
    ...data,
    id: generate_id(),
    createdAt: now,
    updatedAt: now
  };
  
  const applications = load_applications();
  applications.push(application);
  save_applications(applications);
  
  return application;
}

export function update_application(id: string, updates: Partial<Omit<Application, 'id' | 'createdAt'>>): Application | null {
  const applications = load_applications();
  const index = applications.findIndex(app => app.id === id);
  
  if (index === -1) {
    return null;
  }
  
  const updated: Application = {
    ...applications[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  applications[index] = updated;
  save_applications(applications);
  
  return updated;
}

export function delete_application(id: string): boolean {
  const applications = load_applications();
  const filtered = applications.filter(app => app.id !== id);
  
  if (filtered.length === applications.length) {
    return false;
  }
  
  save_applications(filtered);
  return true;
}

export function get_application_by_id(id: string): Application | null {
  const applications = load_applications();
  return applications.find(app => app.id === id) || null;
}

