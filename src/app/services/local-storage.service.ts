import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    private readonly STORAGE_KEYS = {
        GUILD: 'story-stitch-guild',
        PEN_NAME: 'story-stitch-pen-name',
        TODAYS_SUBMISSION: 'story-stitch-todays-submission'
    };

    constructor() {
        // Initialize default values if they don't exist
        this.initializeDefaults();
    }

    private initializeDefaults(): void {
        if (!this.getGuild()) {
            this.setGuild('Moonshadow Acorns');
        }
    }

    // Guild methods
    getGuild(): string {
        return localStorage.getItem(this.STORAGE_KEYS.GUILD) || 'Moonshadow Acorns';
    }

    setGuild(guild: string): void {
        localStorage.setItem(this.STORAGE_KEYS.GUILD, guild);
    }

    // Pen Name methods
    getPenName(): string {
        return localStorage.getItem(this.STORAGE_KEYS.PEN_NAME) || '';
    }

    setPenName(penName: string): void {
        localStorage.setItem(this.STORAGE_KEYS.PEN_NAME, penName);
    }

    // Today's Submission methods
    getTodaysSubmission(): string {
        return localStorage.getItem(this.STORAGE_KEYS.TODAYS_SUBMISSION) || '';
    }

    setTodaysSubmission(submission: string): void {
        localStorage.setItem(this.STORAGE_KEYS.TODAYS_SUBMISSION, submission);
    }

    // Utility methods
    clearAll(): void {
        Object.values(this.STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        this.initializeDefaults();
    }

    getAllData(): { guild: string; penName: string; todaysSubmission: string } {
        return {
            guild: this.getGuild(),
            penName: this.getPenName(),
            todaysSubmission: this.getTodaysSubmission()
        };
    }

    // Check if localStorage is available (for SSR compatibility)
    private isLocalStorageAvailable(): boolean {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch {
            return false;
        }
    }
} 