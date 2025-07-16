import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-info-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './info-modal.html',
  styleUrls: ['./info-modal.scss']
})
export class InfoModal {

  openPrivacyPolicy(): void {
    // In a real app, this would open the privacy policy page
    window.open('/privacy-policy', '_blank');
  }
}
