import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { InfoModal } from '../info-modal/info-modal';
import { LocalStorageService } from '../../services/local-storage.service';
import { PenNameGeneratorService } from '../../services/pen-name-generator.service';
import { FirestoreService } from '../../services/firestore.service';
import { DisplayStory, StoryData } from '../../interfaces/story.interface';

@Component({
  selector: 'app-todays-tale',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatDialogModule
  ],
  templateUrl: './todays-tale.html',
  styleUrls: ['./todays-tale.scss']
})
export class TodaysTale implements OnInit, OnDestroy {
  selectedGuild = 'Moonshadow Acorns';
  penName = '';
  userStoryInput = '';
  wordCount = 0;
  isSubmitted = false;
  isSubmitting = false;
  isOnline = navigator.onLine;
  clearPenName = false;
  isSpeechSupported = false;
  isSpeaking = false;
  isLoading = true;
  isFadingOut = false;
  currentStory: DisplayStory = {
    title: 'Loading...',
    text: 'Please wait while we load today\'s story...',
    images: []
  };

  private onlineSubscription?: Subscription;
  private storySubscription?: Subscription;
  private speechSynthesis?: SpeechSynthesis;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private localStorageService: LocalStorageService,
    private penNameGeneratorService: PenNameGeneratorService,
    private firestoreService: FirestoreService,
    private cdr: ChangeDetectorRef
  ) {

    // TESTING
    console.log('🚀 1.', this.localStorageService.getTodaysSubmission());
    console.log('🚀 2.', this.localStorageService.getGuild());
    console.log('🚀 3.', this.localStorageService.getPenName());
    console.log('🚀 4.', this.localStorageService.getIsSubmitted());

  }

  ngOnInit(): void {
    // Load saved values from localStorage
    this.loadStoredValues();
    // Monitor online/offline status
    this.setupNetworkListener();
    this.loadTodaysStory();
    // Initialize speech synthesis
    this.initializeSpeechSynthesis();
  }

  ngOnDestroy(): void {
    if (this.onlineSubscription) {
      this.onlineSubscription.unsubscribe();
    }
    if (this.storySubscription) {
      this.storySubscription.unsubscribe();
    }
  }

  private setupNetworkListener(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  private loadStoredValues(): void {
    this.selectedGuild = this.localStorageService.getGuild();
    this.penName = this.localStorageService.getPenName();

    // Generate a pen name if none exists
    if (!this.penName || this.penName.trim() === '') {
      this.penName = this.penNameGeneratorService.generateRandomPenName();
      this.localStorageService.setPenName(this.penName);
    }

    this.userStoryInput = this.localStorageService.getTodaysSubmission();
    this.isSubmitted = this.localStorageService.getIsSubmitted();
    this.onTextChange(); // Update word count

    console.log('📚 Loaded stored values:', {
      guild: this.selectedGuild,
      penName: this.penName,
      submissionLength: this.userStoryInput.length,
      isSubmitted: this.isSubmitted
    });
  }

  private loadTodaysStory(): void {
    console.log('🚀 Starting to load today\'s story...');
    this.isLoading = true;
    this.isFadingOut = false;
    this.cdr.detectChanges(); // Trigger change detection

    // Safety timeout to prevent infinite loading
    const safetyTimeout = setTimeout(() => {
      if (this.isLoading && !this.isFadingOut) {
        console.log('⏰ Safety timeout triggered - forcing fade out');
        this.currentStory = {
          title: 'Story Loading...',
          text: 'Please wait a moment while we fetch today\'s magical tale...',
          images: []
        };
        this.startFadeOut();
      }
    }, 10000); // 10 second timeout

    this.storySubscription = this.firestoreService.getTodaysStory().subscribe({
      next: (storyData: StoryData | null) => {
        clearTimeout(safetyTimeout);
        console.log('📨 Received story data:', storyData);

        if (storyData) {
          this.currentStory = {
            title: storyData.title || '',
            text: storyData.intro || '',
            images: storyData.images || []
          };
          console.log('✅ Story loaded successfully:', this.currentStory.title);
        } else {
          // Fallback if no story found for today
          this.currentStory = {
            title: 'No Story Available',
            text: 'There is no story available for today. Please check back later.',
            images: []
          };
          console.log('⚠️ No story data found, showing fallback message');
        }

        // Start fade-out animation
        this.startFadeOut();
      },
      error: (error) => {
        clearTimeout(safetyTimeout);
        console.error('💥 Error loading today\'s story:', error);
        this.currentStory = {
          title: 'Error Loading Story',
          text: 'Unable to load today\'s story. Please check your connection and try again.',
          images: []
        };

        // Start fade-out animation even on error
        this.startFadeOut();
      }
    });
  }

  private startFadeOut(): void {
    console.log('🎆 Starting fireworks explosion animation...');
    this.isFadingOut = true;
    this.cdr.detectChanges(); // Trigger change detection for fireworks

    // Wait for fireworks animation to complete before hiding loading spinner
    setTimeout(() => {
      console.log('🎇 Fireworks explosion complete, hiding spinner');
      this.isLoading = false;
      this.isFadingOut = false;
      this.cdr.detectChanges(); // Trigger change detection for final state
    }, 1200); // 1200ms to match CSS animation duration
  }

  onTextChange(): void {
    this.wordCount = this.userStoryInput.trim().split(/\s+/).filter(word => word.length > 0).length;
    this.localStorageService.setTodaysSubmission(this.userStoryInput);
  }

  onGuildChange(): void {
    this.localStorageService.setGuild(this.selectedGuild);
  }

  onPenNameChange(): void {
    this.localStorageService.setPenName(this.penName);
  }

  onClearPenNameChange(): void {
    if (this.clearPenName) {
      this.penName = '';
      this.localStorageService.setPenName(this.penName);
    } else if (this.penName.trim() === '') {
      this.penName = this.penNameGeneratorService.generateRandomPenName();
      this.localStorageService.setPenName(this.penName);
    }
  }

  canSubmit(): boolean {
    return this.userStoryInput.trim().length > 0 &&
      this.wordCount <= 50 &&
      !this.isSubmitted &&
      !this.isSubmitting &&
      this.selectedGuild !== '';
  }

  submitStory(): void {
    if (this.canSubmit() && this.isOnline) {
      // Set submitting state immediately to disable button
      this.isSubmitting = true;

      console.log('Submitting story:', {
        guild: this.selectedGuild,
        penName: this.penName,
        text: this.userStoryInput,
        wordCount: this.wordCount
      });

      // Save contribution to Firestore
      this.firestoreService.saveContribution(
        this.penName,
        this.userStoryInput,
        this.selectedGuild
      ).subscribe({
        next: () => {
          console.log('✅ Story contribution saved to Firestore successfully');
          this.isSubmitted = true;
          this.isSubmitting = false;
          // Save isSubmitted state to local storage
          this.localStorageService.setIsSubmitted(true);
          console.log('✅ Story submitted and isSubmitted saved to local storage');
          // Show success message or update UI
        },
        error: (error) => {
          console.error('💥 Error saving contribution to Firestore:', error);
          // Still mark as submitted locally even if Firestore fails
          // so user doesn't try to submit again
          this.isSubmitted = true;
          this.isSubmitting = false;
          this.localStorageService.setIsSubmitted(true);
          // You could show an error message to the user here
          console.log('⚠️ Story marked as submitted locally despite Firestore error');
        }
      });
    }
  }

  goToGreatBook(): void {
    this.router.navigate(['/great-book-of-tales']);
  }

  openInfoModal(): void {
    this.dialog.open(InfoModal, {
      width: '90vw',
      maxWidth: '800px',
      maxHeight: '80vh',
      panelClass: 'info-modal-dialog'
    });
  }

  openContributionInfoDialog(): void {
    this.dialog.open(ContributionInfoDialog, {
      width: '95vw',
      maxWidth: '700px',
      height: 'auto',
      maxHeight: '90vh',
      panelClass: 'contribution-info-dialog'
    });
  }

  shareOnFacebook(): void {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`I just contributed to today's collaborative story in Story Stitch! Join the ${this.selectedGuild} guild and help weave our tale.`);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
  }

  shareOnTwitter(): void {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`I just contributed to today's collaborative story in Story Stitch! Join the ${this.selectedGuild} guild and help weave our tale. #StoryStitch #CollaborativeWriting`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  }

  shareNative(): void {
    if (navigator.share) {
      navigator.share({
        title: 'Story Stitch',
        text: `I just contributed to today's collaborative story in Story Stitch! Join the ${this.selectedGuild} guild and help weave our tale.`,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support native sharing
      this.copyToClipboard();
    }
  }

  private copyToClipboard(): void {
    const text = `I just contributed to today's collaborative story in Story Stitch! Join the ${this.selectedGuild} guild and help weave our tale. ${window.location.href}`;
    navigator.clipboard.writeText(text).then(() => {
      // Show success message
      console.log('Link copied to clipboard!');
    });
  }

  // Testing method to clear all local storage variables
  clearLocalVariables(): void {
    console.log('🧪 Testing: Clearing all local storage variables...');
    this.localStorageService.clearAll();

    // Reset component state
    this.isSubmitted = false;
    this.isSubmitting = false;
    this.userStoryInput = '';
    this.wordCount = 0;

    // Reload stored values (will get defaults)
    this.loadStoredValues();

    console.log('✅ Local storage cleared and component state reset');
  }

  private initializeSpeechSynthesis(): void {
    if ('speechSynthesis' in window) {
      this.speechSynthesis = window.speechSynthesis;
      this.isSpeechSupported = true;

      // Handle the case where voices are loaded asynchronously
      if (this.speechSynthesis.getVoices().length === 0) {
        this.speechSynthesis.addEventListener('voiceschanged', () => {
          console.log('Voices loaded:', this.speechSynthesis?.getVoices().length);
        });
      }
    } else {
      this.isSpeechSupported = false;
      console.warn('Speech synthesis is not supported in this browser');
    }
  }

  speakStory(): void {
    if (!this.isSpeechSupported || !this.speechSynthesis) {
      console.warn('Speech synthesis is not available');
      return;
    }

    // Stop any current speech
    if (this.isSpeaking) {
      this.speechSynthesis.cancel();
      this.isSpeaking = false;
      return;
    }

    // Create speech text by combining title and story text
    // Strip HTML tags from the content
    const titleText = this.stripHtmlTags(this.currentStory.title);
    const storyText = this.stripHtmlTags(this.currentStory.text);
    const fullText = `${titleText}. ${storyText}`;

    if (fullText.trim() === '') {
      console.warn('No text to speak');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(fullText);

    // Get available voices and select a female voice
    const voices = this.speechSynthesis.getVoices();
    const femaleVoice = this.selectFemaleVoice(voices);

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    // Configure speech settings for a soft, child-friendly voice
    utterance.rate = 0.8; // Slower pace for children
    utterance.pitch = 1.2; // Slightly higher pitch for a gentler tone
    utterance.volume = 0.9; // Slightly softer volume

    // Handle speech events
    utterance.onstart = () => {
      this.isSpeaking = true;
    };

    utterance.onend = () => {
      this.isSpeaking = false;
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      this.isSpeaking = false;
    };

    // Start speaking
    this.speechSynthesis.speak(utterance);
  }

  private selectFemaleVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
    // If no voices are loaded yet, wait and try again
    if (voices.length === 0) {
      // Voices might not be loaded immediately, trigger a reload
      this.speechSynthesis?.getVoices();
      return null;
    }

    // Priority order for selecting female voices
    const femaleVoicePreferences = [
      // English female voices (common names)
      'Google UK English Female',
      'Microsoft Zira - English (United States)',
      'Microsoft Hazel - English (Great Britain)',
      'Samantha',
      'Victoria',
      'Karen',
      'Moira',
      'Tessa',
      'Veena',
      'Fiona',
      'Alex' // Sometimes Alex is female on some systems
    ];

    // First, try to find a voice by exact name match
    for (const preferredName of femaleVoicePreferences) {
      const voice = voices.find(v => v.name === preferredName);
      if (voice) {
        console.log('Selected female voice:', voice.name);
        return voice;
      }
    }

    // Second, try to find any voice that contains "female" in the name
    const femaleVoice = voices.find(voice =>
      voice.name.toLowerCase().includes('female') ||
      voice.name.toLowerCase().includes('woman')
    );

    if (femaleVoice) {
      console.log('Selected female voice:', femaleVoice.name);
      return femaleVoice;
    }

    // Third, try to find voices that are commonly female
    const commonFemaleNames = ['zira', 'hazel', 'samantha', 'victoria', 'karen', 'moira', 'tessa', 'veena', 'fiona'];
    for (const femaleName of commonFemaleNames) {
      const voice = voices.find(v => v.name.toLowerCase().includes(femaleName));
      if (voice) {
        console.log('Selected female voice:', voice.name);
        return voice;
      }
    }

    // If no specifically female voice is found, log available voices for debugging
    console.log('Available voices:', voices.map(v => v.name));
    console.log('No female voice found, using default voice');

    // Return the first available voice as fallback
    return voices.length > 0 ? voices[0] : null;
  }

  private stripHtmlTags(html: string): string {
    if (!html) return '';
    // Create a temporary div element to parse HTML and extract text content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  }
}

@Component({
  selector: 'app-contribution-info-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="contribution-info-dialog">
      <div class="modal-header">
        <h2 mat-dialog-title>
          <mat-icon>info</mat-icon>
          How to Contribute
        </h2>
        <button mat-icon-button mat-dialog-close class="close-button">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      
      <div mat-dialog-content class="modal-content">
        <ul>
          <li>Read the 'intro' and title.</li>
          <li>Enter your 'Chapter' contribution.</li>
          <li>Click Submit</li>
          <li>Stories are published at 8:30 every evening.</li>
        </ul>
        <p>Check back at that time to find out how the journey ends!</p>
      </div>
    </div>
  `,
  styles: [`
    .contribution-info-dialog {
      font-family: 'Comic Sans MS', cursive, sans-serif;
      background-image: url('/assets/images/fantasyWorld2_sm.png');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      background-attachment: fixed;
      border-radius: 15px;
      overflow: hidden;
      position: relative;
      max-width: 100%;
      box-sizing: border-box;
    }
    
    .contribution-info-dialog::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.5);
      z-index: 1;
    }
    
    .modal-header, .modal-content {
      position: relative;
      z-index: 2;
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
      padding: 10px 20px;
    }
    
    .modal-header h2 {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0;
      color: #2c3e50;
      font-weight: bold;
      font-size: 1.8rem;
    }
    
    .modal-header mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }
    
    .close-button {
      color: #333;
      flex-shrink: 0;
    }
    
    .close-button mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
    
    .modal-content {
      padding: 0 20px 20px 20px;
      max-width: 100%;
      overflow-x: hidden;
      word-wrap: break-word;
    }
    
    .modal-content ul {
      margin: 0;
      padding-left: 30px;
      max-width: 100%;
    }
    
    .modal-content li {
      margin-bottom: 12px;
      line-height: 1.6;
      max-width: 100%;
      word-wrap: break-word;
      font-size: 1.2rem;
      color: #2c3e50;
      font-weight: 500;
    }
    
    .modal-content p {
      margin-top: 20px;
      font-weight: bold;
      color: #2c3e50;
      max-width: 100%;
      word-wrap: break-word;
      font-size: 1.3rem;
      text-align: center;
    }
  `]
})
export class ContributionInfoDialog { }
