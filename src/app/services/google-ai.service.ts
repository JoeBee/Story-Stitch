import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface AIStoryResponse {
    title: string;
    introParagraph: string;
}

@Injectable({
    providedIn: 'root'
})
export class GoogleAiService {
    private readonly API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
    private readonly API_KEY = environment.googleAI.apiKey;

    constructor(private http: HttpClient) { }

    /**
     * Generates a children's story using Google AI Gemini API
     * @returns Observable<AIStoryResponse>
     */
    generateStory(): Observable<AIStoryResponse> {
        const prompt = `Create a title and the introductory paragraph for a children's book.

The intro paragraph should have approximately 50 words:
- Introduce young characters with personality.
- This is a Children's dreamy fantasy story.
- The chidrens names should be unique, dreamy and not too common.

The title should be a fitting title for this that goes with the intro paragraph.

Data should be returned as JSON:
{
 "title": <string>,
 "introParagraph": <string>
}`;

        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.65,
                maxOutputTokens: 1024,
            }
        };

        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        const url = `${this.API_URL}?key=${this.API_KEY}`;

        return this.http.post<any>(url, requestBody, { headers }).pipe(
            map(response => {
                console.log('🤖 Google AI Response:', response);

                if (response.candidates && response.candidates[0] && response.candidates[0].content) {
                    const textContent = response.candidates[0].content.parts[0].text;
                    console.log('📝 Generated text:', textContent);

                    try {
                        // Try to parse the JSON response
                        const cleanedText = textContent.replace(/```json|```/g, '').trim();
                        const parsedResponse = JSON.parse(cleanedText);

                        return {
                            title: parsedResponse.title || 'Generated Story',
                            introParagraph: parsedResponse.introParagraph || 'A magical adventure awaits...'
                        };
                    } catch (parseError) {
                        console.error('❌ Error parsing AI response:', parseError);
                        console.log('Raw text response:', textContent);

                        // Fallback: extract title and paragraph manually if JSON parsing fails
                        return this.extractStoryFromText(textContent);
                    }
                }

                throw new Error('Invalid response format from Google AI');
            }),
            catchError(error => {
                console.error('💥 Error calling Google AI API:', error);
                // Return fallback story on error
                return [{
                    title: 'The Magic Garden Adventure',
                    introParagraph: 'In a hidden garden where flowers whispered secrets and butterflies danced with rainbows, young Emma discovered a magical key that glowed with starlight. With her brave friend Marcus beside her, she unlocked a door to a world where dreams came true and every wish sparkled like morning dew.'
                }];
            })
        );
    }

    /**
     * Fallback method to extract story elements from free-form text
     * @param text - The AI-generated text
     * @returns AIStoryResponse
     */
    private extractStoryFromText(text: string): AIStoryResponse {
        // Try to find title patterns
        const titleMatch = text.match(/(?:title):\s*"?([^"\n]+)"?/i) ||
            text.match(/"title":\s*"([^"]+)"/i) ||
            text.match(/^([^.\n]+)/); // First line as title

        // Try to find intro paragraph patterns
        const introMatch = text.match(/(?:introParagraph):\s*"?([^"]+)"?/i) ||
            text.match(/"introParagraph":\s*"([^"]+)"/i) ||
            text.match(/\n\s*(.+)/); // Second line as intro

        return {
            title: titleMatch ? titleMatch[1].trim() : 'A Magical Adventure',
            introParagraph: introMatch ? introMatch[1].trim() : 'Once upon a time in a land of wonder and magic, young heroes embarked on an incredible journey filled with friendship, courage, and endless possibilities.'
        };
    }
} 