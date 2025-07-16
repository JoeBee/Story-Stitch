import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-splash-screen',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatIconModule],
  templateUrl: './splash-screen.html',
  styleUrls: ['./splash-screen.scss']
})
export class SplashScreen implements OnInit {
  isLoading = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Show splash screen for 5 seconds then navigate to main page
    setTimeout(() => {
      this.isLoading = true;
      setTimeout(() => {
        this.router.navigate(['/todays-tale']);
      }, 1000); // Allow fade out animation to complete
    }, 4000);
  }
}
