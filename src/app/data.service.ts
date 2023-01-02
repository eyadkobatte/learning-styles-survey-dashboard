import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private DATA_STORAGE_KEY = 'dashboard_data' as const;

  insertData(data: Record<string, unknown>[]) {
    window.localStorage.setItem(this.DATA_STORAGE_KEY, JSON.stringify(data));
  }

  getData() {
    const stringifiedContent = window.localStorage.getItem(
      this.DATA_STORAGE_KEY
    );
    if (!stringifiedContent) {
      return null;
    }
    return JSON.parse(stringifiedContent);
  }
}
