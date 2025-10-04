import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from '../../shared/components/reusables/button/button';

@Component({
  selector: 'app-not-found',
  imports: [
    Button
  ],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css'
})
export class NotFound {
  private readonly router = inject(Router);
  
  goHome(): void {
    this.router.navigate(['/']);
  }

  goBack(): void {
    window.history.back();
  }
}
