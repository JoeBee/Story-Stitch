import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { MatDialog } from '@angular/material/dialog';
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
    MatCheckboxModule
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
  isOnline = navigator.onLine;
  clearPenName = false;
  currentStory: DisplayStory = {
    title: 'Loading...',
    text: 'Please wait while we load today\'s story...',
    images: []
  };

  private onlineSubscription?: Subscription;
  private storySubscription?: Subscription;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private localStorageService: LocalStorageService,
    private penNameGeneratorService: PenNameGeneratorService,
    private firestoreService: FirestoreService
  ) { }

  ngOnInit(): void {
    // Load saved values from localStorage
    this.loadStoredValues();
    // Monitor online/offline status
    this.setupNetworkListener();
    this.loadTodaysStory();
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
    this.onTextChange(); // Update word count
  }

  private loadTodaysStory(): void {
    console.log('🚀 Starting to load today\'s story...');
    this.storySubscription = this.firestoreService.getTodaysStory().subscribe({
      next: (storyData: StoryData | null) => {
        console.log('📨 Received story data:', storyData);
        if (storyData) {
          this.currentStory = {
            title: storyData.title || '',
            text: storyData.intro || '',
            images: storyData.images || []
          };
        } else {
          // Fallback if no story found for today
          this.currentStory = {
            title: 'No Story Available',
            text: 'There is no story available for today. Please check back later.',
            images: []
          };
          console.log('⚠️ No story data found, showing fallback message');
        }
      },
      error: (error) => {
        console.error('💥 Error loading today\'s story:', error);
        this.currentStory = {
          title: 'Error Loading Story',
          text: 'Unable to load today\'s story. Please check your connection and try again.',
          images: []
        };
      }
    });
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
      this.selectedGuild !== '';
  }

  submitStory(): void {
    if (this.canSubmit() && this.isOnline) {
      // In a real app, this would send to an API
      console.log('Submitting story:', {
        guild: this.selectedGuild,
        text: this.userStoryInput,
        wordCount: this.wordCount
      });

      this.isSubmitted = true;
      // Show success message or update UI
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
}
