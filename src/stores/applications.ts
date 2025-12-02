import { writable } from 'svelte/store';
import type { Application } from '../types/application';
import * as application_service from '../services/application_service';

function create_application_store() {
  const { subscribe, set, update } = writable<Application[]>([]);
  
  return {
    subscribe,
    load: () => {
      const applications = application_service.load_applications();
      set(applications);
    },
    add: (data: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>) => {
      const new_app = application_service.create_application(data);
      update(apps => [...apps, new_app]);
      return new_app;
    },
    update: (id: string, updates: Partial<Omit<Application, 'id' | 'createdAt'>>) => {
      const updated = application_service.update_application(id, updates);
      if (updated) {
        update(apps => apps.map(app => app.id === id ? updated : app));
      }
      return updated;
    },
    delete: (id: string) => {
      const success = application_service.delete_application(id);
      if (success) {
        update(apps => apps.filter(app => app.id !== id));
      }
      return success;
    }
  };
}

export const applications = create_application_store();

