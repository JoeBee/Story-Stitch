// Example usage of LocalStorageService
// This file demonstrates how to use the local storage service in your components

import { Component, inject } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

// Example 1: Using modern inject() function (Angular 14+)
export class LocalStorageExample {
  // Inject the service using the new inject function
  private localStorageService = inject(LocalStorageService);

  // Component properties
  guild = '';
  penName = '';
  todaysSubmission = '';

  constructor() {
    this.loadStoredValues();
  }

  // Load current values from localStorage
  loadStoredValues(): void {
    this.guild = this.localStorageService.getGuild();
    this.penName = this.localStorageService.getPenName();
    this.todaysSubmission = this.localStorageService.getTodaysSubmission();
  }

  // Save methods
  saveGuild(newGuild: string): void {
    this.guild = newGuild;
    this.localStorageService.setGuild(this.guild);
  }

  savePenName(newPenName: string): void {
    this.penName = newPenName;
    this.localStorageService.setPenName(this.penName);
  }

  saveSubmission(newSubmission: string): void {
    this.todaysSubmission = newSubmission;
    this.localStorageService.setTodaysSubmission(this.todaysSubmission);
  }

  // Utility methods
  clearAllData(): void {
    this.localStorageService.clearAll();
    this.loadStoredValues(); // Reload to get defaults
  }

  getAllStoredData(): { guild: string; penName: string; todaysSubmission: string } {
    return this.localStorageService.getAllData();
  }
}

// Alternative usage with traditional constructor injection
@Component({
  selector: 'app-traditional-example',
  template: '<div>Traditional injection example</div>'
})
export class TraditionalExample {
  constructor(private localStorageService: LocalStorageService) {
    // Example of using the service in constructor
    console.log('Current guild:', this.localStorageService.getGuild());
  }

  // Example methods
  saveUserPreferences(guild: string, penName: string): void {
    this.localStorageService.setGuild(guild);
    this.localStorageService.setPenName(penName);
  }

  getUserPreferences(): { guild: string; penName: string; todaysSubmission: string } {
    return this.localStorageService.getAllData();
  }
}

/*
=== USAGE GUIDE ===

1. Import and inject the service in your component:
   ```typescript
   import { LocalStorageService } from './services/local-storage.service';
   
   constructor(private localStorageService: LocalStorageService) {}
   ```

2. Use the service methods:
   ```typescript
   // Get values
   const guild = this.localStorageService.getGuild();
   const penName = this.localStorageService.getPenName();
   const submission = this.localStorageService.getTodaysSubmission();

   // Set values
   this.localStorageService.setGuild('Moonshadow Acorns');
   this.localStorageService.setPenName('MysticScribe');
   this.localStorageService.setTodaysSubmission('My story...');

   // Utility methods
   const allData = this.localStorageService.getAllData();
   this.localStorageService.clearAll();
   ```

3. The service automatically:
   - Sets 'Moonshadow Acorns' as default guild
   - Persists data between sessions
   - Handles browser compatibility

4. Storage keys used:
   - 'story-stitch-guild'
   - 'story-stitch-pen-name'
   - 'story-stitch-todays-submission'
*/ 