export function load_from_storage<T>(key: string, default_value: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : default_value;
  } catch (error) {
    console.error(`Error loading ${key}:`, error);
    return default_value;
  }
}

export function save_to_storage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
  }
}

