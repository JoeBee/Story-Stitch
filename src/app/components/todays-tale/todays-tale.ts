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
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { InfoModal } from '../info-modal/info-modal';

interface Story {
  text: string;
  image?: string;
}

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
    MatTooltipModule
  ],
  templateUrl: './todays-tale.html',
  styleUrls: ['./todays-tale.scss']
})
export class TodaysTale implements OnInit, OnDestroy {
  selectedGuild = 'Moonshadow Acorns';
  userStoryInput = '';
  wordCount = 0;
  isSubmitted = false;
  isOnline = navigator.onLine;
  currentStory: Story = {
    text: 'Once upon a time in a realm where magic flowed like rivers and dreams took flight on silver wings...',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  };

  private onlineSubscription?: Subscription;

  constructor(
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Monitor online/offline status
    this.setupNetworkListener();
    this.loadTodaysStory();
  }

  ngOnDestroy(): void {
    if (this.onlineSubscription) {
      this.onlineSubscription.unsubscribe();
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

  private loadTodaysStory(): void {
    // In a real app, this would load from an API
    // For now, use a sample story
  }

  onTextChange(): void {
    this.wordCount = this.userStoryInput.trim().split(/\s+/).filter(word => word.length > 0).length;
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
