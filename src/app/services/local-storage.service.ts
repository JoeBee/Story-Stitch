import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    private readonly STORAGE_KEYS = {
        GUILD: 'story-stitch-guild',
        PEN_NAME: 'story-stitch-pen-name',
        TODAYS_SUBMISSION: 'story-stitch-todays-submission',
        IS_SUBMITTED: 'story-stitch-is-submitted',
        LAST_RESET_DATE: 'story-stitch-last-reset-date'
    };

    constructor() {
        // Initialize default values if they don't exist
        this.initializeDefaults();
        // Check for daily reset
        this.checkAndPerformDailyReset();
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

    // Is Submitted methods
    getIsSubmitted(): boolean {
        const value = localStorage.getItem(this.STORAGE_KEYS.IS_SUBMITTED);
        return value === 'true';
    }

    setIsSubmitted(isSubmitted: boolean): void {
        localStorage.setItem(this.STORAGE_KEYS.IS_SUBMITTED, isSubmitted.toString());
    }

    // Utility methods
    clearAll(): void {
        Object.values(this.STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        this.initializeDefaults();
    }

    getAllData(): { guild: string; penName: string; todaysSubmission: string; isSubmitted: boolean } {
        return {
            guild: this.getGuild(),
            penName: this.getPenName(),
            todaysSubmission: this.getTodaysSubmission(),
            isSubmitted: this.getIsSubmitted()
        };
    }

    // Daily Reset functionality
    private checkAndPerformDailyReset(): void {
        const today = this.getCurrentDateString();
        const lastResetDate = localStorage.getItem(this.STORAGE_KEYS.LAST_RESET_DATE);

        if (lastResetDate !== today) {
            console.log('🔄 Performing daily reset - clearing submissions and isSubmitted');
            this.performDailyReset();
            localStorage.setItem(this.STORAGE_KEYS.LAST_RESET_DATE, today);
        }
    }

    private performDailyReset(): void {
        // Clear today's submission and reset isSubmitted flag
        localStorage.removeItem(this.STORAGE_KEYS.TODAYS_SUBMISSION);
        localStorage.removeItem(this.STORAGE_KEYS.IS_SUBMITTED);
        console.log('✅ Daily reset completed - submission cleared, isSubmitted set to false');
    }

    private getCurrentDateString(): string {
        // Get current date in YYYY-MM-DD format to detect day changes
        const now = new Date();
        return now.getFullYear() + '-' +
            String(now.getMonth() + 1).padStart(2, '0') + '-' +
            String(now.getDate()).padStart(2, '0');
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