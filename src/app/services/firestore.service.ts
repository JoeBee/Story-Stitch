import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { StoryData } from '../interfaces/story.interface';

@Injectable({
    providedIn: 'root'
})
export class FirestoreService {

    constructor(private firestore: Firestore) { }

    /**
     * Gets today's story entry from Firestore using YYYYmmDD format
     * @returns Observable<StoryData | null>
     */
    getTodaysStory(): Observable<StoryData | null> {
        const todayId = this.getTodayDocumentId();
        console.log('🔍 Fetching story for document ID:', todayId);
        console.log('📅 Today\'s date:', new Date().toLocaleDateString());

        const storyDocRef = doc(this.firestore, 'Stories', todayId);

        return from(getDoc(storyDocRef)).pipe(
            map(docSnap => {
                console.log('📄 Document exists:', docSnap.exists());
                if (docSnap.exists()) {
                    const data = docSnap.data() as StoryData;
                    console.log('📝 Raw document data:', data);
                    // Only return title, intro, and images as per requirements
                    // Handle both capitalized and lowercase field names from Firestore
                    return {
                        title: data.Title || data.title || '',
                        intro: data.Intro || data.intro || '',
                        images: data.Images || data.images || []
                    };
                }
                return null;
            }),
            catchError(error => {
                console.error('Error fetching today\'s story:', error);
                return [null];
            })
        );
    }

    /**
     * Gets a specific story by date
     * @param date - Date object or date string
     * @returns Observable<StoryData | null>
     */
    getStoryByDate(date: Date | string): Observable<StoryData | null> {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        const documentId = this.formatDateToDocumentId(dateObj);
        const storyDocRef = doc(this.firestore, 'Stories', documentId);

        return from(getDoc(storyDocRef)).pipe(
            map(docSnap => {
                if (docSnap.exists()) {
                    const data = docSnap.data() as StoryData;
                    return {
                        title: data.Title || data.title || '',
                        intro: data.Intro || data.intro || '',
                        images: data.Images || data.images || []
                    };
                }
                return null;
            }),
            catchError(error => {
                console.error(`Error fetching story for date ${documentId}:`, error);
                return [null];
            })
        );
    }

    /**
     * Formats today's date to YYYYmmDD format for document ID
     * @returns string in YYYYmmDD format
     */
    private getTodayDocumentId(): string {
        return this.formatDateToDocumentId(new Date());
    }

    /**
     * Formats a date to YYYYmmDD format
     * @param date - Date object to format
     * @returns string in YYYYmmDD format
     */
    private formatDateToDocumentId(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    }
} 