import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { InfoModal } from '../info-modal/info-modal';

interface CompleteStory {
  id: string;
  title: string;
  guild: string;
  date: Date;
  image?: string;
  fullText: string;
  contributors: string[];
}

@Component({
  selector: 'app-great-book-of-tales',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './great-book-of-tales.html',
  styleUrls: ['./great-book-of-tales.scss']
})
export class GreatBookOfTales implements OnInit, OnDestroy {
  stories: CompleteStory[] = [];
  currentStoryIndex = 0;
  currentStory?: CompleteStory;
  isOnline = navigator.onLine;

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.setupNetworkListener();
    this.loadStories();
    this.updateCurrentStory();
  }

  ngOnDestroy(): void {
    // Clean up event listeners
    window.removeEventListener('online', this.onOnline);
    window.removeEventListener('offline', this.onOffline);
  }

  private setupNetworkListener(): void {
    window.addEventListener('online', this.onOnline);
    window.addEventListener('offline', this.onOffline);
  }

  private onOnline = (): void => {
    this.isOnline = true;
  };

  private onOffline = (): void => {
    this.isOnline = false;
  };

  private loadStories(): void {
    // In a real app, this would load from an API
    // For demo purposes, create some sample stories
    this.stories = [
      {
        id: '1',
        title: 'The Enchanted Forest Beginning',
        guild: 'Moonshadow Acorns',
        date: new Date('2024-01-15'),
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        fullText: `Once upon a time in a realm where magic flowed like rivers and dreams took flight on silver wings, there lived a young apprentice named Luna. 
        
        <p>The Moonshadow Acorns guild had tasked her with finding the legendary Crystal of Whispered Dreams, hidden deep within the Enchanted Forest. As she stepped through the misty veil that separated the mundane world from the magical realm, Luna felt the ancient power tingling through her fingertips.</p>
        
        <p>The forest welcomed her with a symphony of otherworldly sounds - the gentle chiming of crystal leaves, the soft whispers of wind spirits, and the distant melody of a unicorn's call. Each step forward brought new wonders and new challenges that would test not just her magical abilities, but her courage and wisdom as well.</p>`,
        contributors: ['Sarah M.', 'Alex K.', 'Maria L.']
      },
      {
        id: '2',
        title: 'The Sky Pirates Adventure',
        guild: 'Stormwing Collective',
        date: new Date('2024-01-16'),
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        fullText: `High above the churning clouds, Captain Zara adjusted her goggles and peered through the brass telescope. The Stormwing Collective's flagship, the "Thunder's Edge," cut through the sky like a blade through silk.
        
        <p>"There!" she called to her crew, pointing toward a glinting object in the distance. "The Celestial Compass of the Ancients, just as the prophecy foretold." The artifact floated in a shimmering bubble of energy, guarded by ethereal sky serpents whose scales reflected every color of the rainbow.</p>
        
        <p>The crew prepared for battle, their storm-blessed weapons crackling with electrical energy. This would be no ordinary raid - the fate of all the sky cities depended on securing this artifact before the Shadow Armada could claim it for their dark purposes.</p>`,
        contributors: ['John D.', 'Emma R.', 'Carlos V.']
      }
    ];
  }

  private updateCurrentStory(): void {
    if (this.stories.length > 0 && this.currentStoryIndex >= 0 && this.currentStoryIndex < this.stories.length) {
      this.currentStory = this.stories[this.currentStoryIndex];
    } else {
      this.currentStory = undefined;
    }
  }

  previousStory(): void {
    if (this.currentStoryIndex > 0) {
      this.currentStoryIndex--;
      this.updateCurrentStory();
    }
  }

  nextStory(): void {
    if (this.currentStoryIndex < this.stories.length - 1) {
      this.currentStoryIndex++;
      this.updateCurrentStory();
    }
  }

  getCurrentStoryDate(): string {
    if (this.currentStory) {
      return this.currentStory.date.toLocaleDateString();
    }
    return '';
  }

  getGuildClass(guild: string): string {
    switch (guild) {
      case 'Moonshadow Acorns':
        return 'guild-moonshadow';
      case 'Stormwing Collective':
        return 'guild-stormwing';
      case 'Wispwood Whisperers':
        return 'guild-wispwood';
      default:
        return 'guild-default';
    }
  }

  shareStory(): void {
    if (this.currentStory && this.isOnline) {
      const shareText = `Check out this amazing collaborative story from Story Stitch: "${this.currentStory.title}" by the ${this.currentStory.guild} guild!`;

      if (navigator.share) {
        navigator.share({
          title: this.currentStory.title,
          text: shareText,
          url: window.location.href
        });
      } else {
        // Fallback for browsers that don't support native sharing
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(shareText);
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
      }
    }
  }

  goToToday(): void {
    this.router.navigate(['/todays-tale']);
  }

  openInfoModal(): void {
    this.dialog.open(InfoModal, {
      width: '90vw',
      maxWidth: '800px',
      maxHeight: '80vh',
      panelClass: 'info-modal-dialog'
    });
  }
}
