import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, updateDoc, arrayUnion } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { StoryData, StoryContribution } from '../interfaces/story.interface';
import { GoogleAiService, AIStoryResponse } from './google-ai.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
    providedIn: 'root'
})
export class FirestoreService {

    constructor(
        private firestore: Firestore,
        private googleAiService: GoogleAiService,
        private localStorageService: LocalStorageService
    ) { }

    /**
     * Gets today's story entry from Firestore using YYYYmmDD format
     * If no story exists, generates one using Google AI and saves it
     * @returns Observable<StoryData | null>
     */
    getTodaysStory(): Observable<StoryData | null> {
        const todayId = this.getTodayDocumentId(this.localStorageService.getGuild());
        console.log('🔍 Fetching story for document ID:', todayId);
        console.log('📅 Today\'s date:', new Date().toLocaleDateString());

        const storyDocRef = doc(this.firestore, 'Stories', todayId);

        return from(getDoc(storyDocRef)).pipe(
            switchMap(docSnap => {
                console.log('📄 Document exists:', docSnap.exists());
                if (docSnap.exists()) {
                    const data = docSnap.data() as StoryData;
                    console.log('📝 Raw document data:', data);
                    // Only return title, intro, and images as per requirements
                    // Handle both capitalized and lowercase field names from Firestore
                    const storyData = {
                        title: data.title || '',
                        intro: data.intro || '',
                        images: data.images || []
                    };
                    return [storyData];
                } else {
                    // No story exists, generate one using Google AI
                    console.log('🤖 No story found, generating with Google AI...');
                    return this.generateAndSaveStory(
                        todayId, this.localStorageService.getGuild());
                }
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
    // getStoryByDate(date: Date | string): Observable<StoryData | null> {
    //     const dateObj = typeof date === 'string' ? new Date(date) : date;
    //     const documentId = this.formatDateToDocumentId(dateObj);
    //     const storyDocRef = doc(this.firestore, 'Stories', documentId);

    //     return from(getDoc(storyDocRef)).pipe(
    //         map(docSnap => {
    //             if (docSnap.exists()) {
    //                 const data = docSnap.data() as StoryData;
    //                 return {
    //                     title: data.Title || data.title || '',
    //                     intro: data.Intro || data.intro || '',
    //                     images: data.Images || data.images || []
    //                 };
    //             }
    //             return null;
    //         }),
    //         catchError(error => {
    //             console.error(`Error fetching story for date ${documentId}:`, error);
    //             return [null];
    //         })
    //     );
    // }

    /**
     * Formats today's date to YYYYmmDD format for document ID
     * @returns string in YYYYmmDD format
     */
    private getTodayDocumentId(guild: string): string {
        return this.formatDateToDocumentId(new Date(), guild);
    }

    /**
     * Formats a date to YYYYmmDD format
     * @param date - Date object to format
     * @returns string in YYYYmmDD format
     */
    private formatDateToDocumentId(date: Date, guild: string): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        if (guild === '') {
            return `${year}${month}${day}`;
        } else {
            // Lowercase the guild name and remove spaces
            const gld = guild.replace(/\s+/g, '').toLowerCase();
            return `${year}${month}${day}-${gld}`;
        }
    }

    /**
     * Generates a new story using Google AI and saves it to Firestore
     * @param documentId - The document ID to save the story under
     * @returns Observable<StoryData | null>
     */
    private generateAndSaveStory(documentId: string, guild: string): Observable<StoryData | null> {
        console.log('🎨 Generating new story for document ID:', documentId);

        return this.googleAiService.generateStory().pipe(
            switchMap((aiResponse: AIStoryResponse) => {
                console.log('✨ Generated story:', aiResponse);

                const newStory: StoryData = {
                    title: aiResponse.title,
                    intro: aiResponse.introParagraph,
                    images: [],
                    guild: guild,
                    contributions: [],
                    publishedStory: ''
                };

                // const docid = documentId + '-' + guild;
                return this.saveStory(documentId, newStory).pipe(
                    map(() => {
                        console.log('💾 Story saved successfully!');
                        return {
                            title: newStory.title || '',
                            intro: newStory.intro || '',
                            images: newStory.images || []
                        };
                    })
                );
            }),
            catchError(error => {
                console.error('💥 Error generating and saving story:', error);
                // Return a fallback story on error
                return [{
                    title: 'The Magic Garden Adventure',
                    intro: 'In a hidden garden where flowers whispered secrets and butterflies danced with rainbows, young Emma discovered a magical key that glowed with starlight. With her brave friend Marcus beside her, she unlocked a door to a world where dreams came true and every wish sparkled like morning dew.',
                    images: []
                }];
            })
        );
    }

    /**
     * Saves a story to Firestore
     * @param documentId - The document ID to save under
     * @param storyData - The story data to save
     * @returns Observable<void>
     */
    private saveStory(documentId: string, storyData: StoryData): Observable<void> {
        const storyDocRef = doc(this.firestore, 'Stories', documentId);
        console.log('💾 Saving story to Firestore:', documentId, storyData);

        return from(setDoc(storyDocRef, storyData)).pipe(
            catchError(error => {
                console.error('💥 Error saving story to Firestore:', error);
                throw error;
            })
        );
    }

    /**
     * Saves a user's contribution to today's story
     * @param penName - The pen name of the contributor
     * @param chapter - The user's story contribution text
     * @param guild - The guild the user belongs to
     * @returns Observable<void>
     */
    saveContribution(penName: string, chapter: string, guild: string): Observable<void> {
        const todayId = this.getTodayDocumentId(guild);
        const storyDocRef = doc(this.firestore, 'Stories', todayId);

        const contribution: StoryContribution = {
            penName: penName,
            chapter: chapter,
            guild: guild,
            timestamp: new Date()
        };

        console.log('📝 Saving contribution to Firestore:', {
            documentId: todayId,
            contribution: contribution
        });

        return from(updateDoc(storyDocRef, {
            Contributions: arrayUnion(contribution)
        })).pipe(
            catchError(error => {
                console.error('💥 Error saving contribution to Firestore:', error);
                throw error;
            })
        );
    }
} 